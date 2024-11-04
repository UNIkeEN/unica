from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from api.organization.models import Organization, Membership
from api.project.models import Project
from .serializers import OrganizationSerializer, MembershipSerializer
from .decorators import organization_permission_classes
from utils.query import QuerySteps, QueryExecutor, QueryOptions, QueryResult
from utils.mails import send_email

User = get_user_model()


@swagger_auto_schema(
    method='post',
    request_body=OrganizationSerializer,
    responses={
        201: openapi.Response(
            description="Organization successfully created",
            schema=OrganizationSerializer
        ),
        400: openapi.Response(
            description="Invalid input data"
        ),
    },
    operation_description="Create a new organization. The user creating the organization will automatically be assigned the role of OWNER.",
    tags=["Organization"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_organization(request):
    serializer = OrganizationSerializer(data=request.data)
    if serializer.is_valid():
        organization = serializer.save()
        Membership.objects.create(user=request.user, organization=organization, role=Membership.OWNER)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=QueryOptions.to_openapi_schema(
        [QuerySteps.ORDER_BY, QuerySteps.PAGINATION]
    ),
    responses={
        200: openapi.Response(
            description="List of organizations the user belongs to",
            schema=OrganizationSerializer(many=True)
        )
    },
    operation_description="Retrieve a list of organizations the authenticated user belongs to.",
    tags=["Organization"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def list_user_organizations(request):
    base_query = Membership.objects.filter(user=request.user).exclude(role=Membership.PENDING)
    options = QueryOptions.build_from_request(request)

    if options.order_by.startswith('-'):
        options.order_by = f"-organization__{options.order_by[1:]}"
    else:
        options.order_by = f"organization__{options.order_by}"

    count, memberships = QueryExecutor(
        base_query=base_query,
        options=options,
        supported_steps=[QuerySteps.ORDER_BY, QuerySteps.PAGINATION]
    ).execute()

    organizations = [membership.organization for membership in memberships]
    response_data = QueryResult(count, organizations).paginated_serialize(
        OrganizationSerializer,
        context={'request': request}
    )
    return Response(response_data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description="Organization info and authenticated user's role"
        ),
        404: openapi.Response(
            description="Organization not found"
        ),
        403: openapi.Response(
            description="Authenticated user is not a member of this organization"
        ),
    },
    operation_description="Check if the authenticated user is a member of the organization and retrieve organization's basic info and user's role.",
    tags=["Organization/Membership"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(required_roles=['Owner', 'Member', 'Pending'])
def check_user_organization_permission(request, id):
    membership = MembershipSerializer(request.membership, context={'request': request}).data
    organization = OrganizationSerializer(request.organization, context={'request': request}).data
    data = {
        **membership,
        'organization': organization
    }
    return Response(data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='patch',
    request_body=OrganizationSerializer(partial=True),
    responses={
        200: openapi.Response(
            description="Organization updated successfully",
            schema=OrganizationSerializer()
        ),
        400: openapi.Response(description="Invalid input data"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="Organization not found"),
    },
    operation_description="Partially update an organization's model field(e.g. name or description). Need 'Owner' permission.",
    tags=["Organization"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(required_roles=['Owner'])
def update_organization(request, id):
    serializer = OrganizationSerializer(request.organization, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='delete',
    responses={
        204: openapi.Response(description="Organization and associated projects deleted successfully"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="Organization not found"),
    },
    operation_description="Delete an organization by its ID(and associated projects). Need 'Owner' permission.",
    tags=["Organization"]
)
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(required_roles=['Owner'])
def delete_organization(request, id):
    organization = request.organization
    # delete all projects associated with the organization(it will not auto delete cascadly)
    Project.objects.filter(owner_type=ContentType.objects.get_for_model(Organization), owner_id=organization.id).delete()
    organization.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'page': openapi.Schema(type=openapi.TYPE_INTEGER, default=1),
            'page_size': openapi.Schema(type=openapi.TYPE_INTEGER, default=20),
        }
    ),
    responses={
        200: openapi.Response(
            description="List of members in the organization",
            schema=MembershipSerializer(many=True)
        ),
        404: openapi.Response(
            description="Organization not found"
        ),
        403: openapi.Response(
            description="Authenticated user is not a member of this organization"
        ),
    },
    operation_description="Retrieve a list of members in an organization.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def list_organization_members(request, id):
    class CustomPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = CustomPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    memberships = Membership.objects.filter(organization=request.organization).exclude(role=Membership.PENDING).order_by('-joined_at')
    result_page = paginator.paginate_queryset(memberships, request)
    serializer = MembershipSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@swagger_auto_schema(
    method='delete',
    responses={
        200: openapi.Response(description="Left the organization successfully"),
        400: openapi.Response(description="Cannot remove the only owner"),
        403: openapi.Response(description="Authenticated user is not a member of this organization"),
        404: openapi.Response(description="Organization not found"),
    },
    tags=["Organization/Membership"]
)
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(required_roles=['Owner', 'Member'])
def leave_organization(request, id):
    membership = request.membership
    if membership.is_owner():
        if Membership.objects.filter(organization=request.organization, role=Membership.OWNER).count() <= 1:
            return Response({"detail": "Cannot remove the only owner"}, status=status.HTTP_400_BAD_REQUEST)
    membership.delete()
    return Response({"detail": "Left the organization successfully"}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='username of the user to remove'),
        },
        required=['username']
    ),
    responses={
        200: openapi.Response(description="User removed successfully"),
        400: openapi.Response(description="Cannot remove the only owner of the organization"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="User not found in this organization, or organization not found"),
    },
    operation_description="Remove a user from the organization. Need 'Owner' permission.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def remove_member(request, id):
    username = request.data.get('username')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        membership = Membership.objects.get(user=user, organization=request.organization)
        if membership.is_owner():
            if Membership.objects.filter(organization=request.organization, role=Membership.OWNER).count() <= 1:
                return Response({"detail": "Cannot remove the only owner"}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return Response({"detail": "User removed successfully"}, status=status.HTTP_200_OK)
    except Membership.DoesNotExist:
        return Response({"detail": "User not found in this organization"}, status=status.HTTP_404_NOT_FOUND)
    

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='username of the user to modify role'),
            'new_role': openapi.Schema(type=openapi.TYPE_STRING, enum=[Membership.OWNER, Membership.MEMBER], description='New role for the user'),
        },
        required=['username', 'new_role']
    ),
    responses={
        200: openapi.Response(description="User role updated successfully"),
        400: openapi.Response(description="Cannot change the only owner to a different role"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="User not found in this organization, or organization not found"),
        418: openapi.Response(description="Invalid role"),
    },
    operation_description="Modify a user's role in the organization. Need 'Owner' permission.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def modify_member_role(request, id):
    username = request.data.get('username')
    new_role = request.data.get('new_role')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        membership = Membership.objects.get(user=user, organization=request.organization)
        if new_role not in dict(Membership.ROLE_CHOICES):
            return Response({"detail": "Invalid role"}, status=status.HTTP_418_IM_A_TEAPOT)
        if membership.is_owner() and new_role != Membership.OWNER:
            if Membership.objects.filter(organization=request.organization, role=Membership.OWNER).count() <= 1:
                return Response({"detail": "Cannot change the only owner to a different role"}, status=status.HTTP_400_BAD_REQUEST)
        membership.change_role(new_role)
        return Response({"detail": "User role updated successfully"}, status=status.HTTP_200_OK)
    except Membership.DoesNotExist:
        return Response({"detail": "User not found in this organization"}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='username of the user to invite')
        },
        required=['username']
    ),
    responses={
        201: openapi.Response(description="Invitation sent successfully"),
        403: openapi.Response(
            description="Authenticated user is not an owner of this organization"
        ),
        404: openapi.Response(
            description="User not found, or organization not found"
        ),
        409: openapi.Response(
            description="User is already a member of the organization or has a pending invitation"
        ),
    },
    operation_description="Invite a user to join the organization. Need 'Owner' permission.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def create_invitation(request, id):
    username = request.data.get('username')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    organization = Organization.objects.get(id=id)
    if Membership.objects.filter(user=user, organization=organization).exists():
        return Response({"detail": "User is already a member of the organization"}, status=status.HTTP_409_CONFLICT)
    
    Membership.objects.create(user=user, organization=organization, role=Membership.PENDING)
    send_email(
        'organization-invitation',
        f'The {organization.display_name} organization has invited you to join - UNICA',
        [user.email],
        {
            'org_name': organization.display_name,
            'invitation_link': request.build_absolute_uri(f'/organizations/{organization.id}/invitation')
        }
    )
    return Response({"detail": "Invitation sent successfully"}, status=status.HTTP_201_CREATED)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'page': openapi.Schema(type=openapi.TYPE_INTEGER, default=1),
            'page_size': openapi.Schema(type=openapi.TYPE_INTEGER, default=20),
        }
    ),
    responses={
        200: openapi.Response(
            description="List of pending invitations in the organization",
            schema=MembershipSerializer(many=True)
        ),
        404: openapi.Response(
            description="Organization not found"
        ),
        403: openapi.Response(
            description="Authenticated user is not an owner of this organization"
        ),
    },
    operation_description="Retrieve a list of pending invitations in an organization. Need 'Owner' permission.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def list_organization_invitations(request, id):
    class CustomPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = CustomPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    memberships = Membership.objects.filter(organization=request.organization, role=Membership.PENDING).order_by('-joined_at')
    result_page = paginator.paginate_queryset(memberships, request)
    serializer = MembershipSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='username of the user to cancel invitation'),
        },
        required=['username']
    ),
    responses={
        200: openapi.Response(description="Cancel invitation successfully"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="User not found, or invitation not found"),
    },
    operation_description="Cancel a member invitation. Need 'Owner' permission.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def cancel_invitation(request, id):
    username = request.data.get('username')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        membership = Membership.objects.get(user=user, organization=request.organization, role=Membership.PENDING)
        membership.delete()
        return Response({"detail": "Cancel Invitation successfully"}, status=status.HTTP_200_OK)
    except Membership.DoesNotExist:
        return Response({"detail": "Invitation not found in this organization"}, status=status.HTTP_404_NOT_FOUND)
    

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'accept': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Accept or decline the invitation')
        },
        required=['accept']
    ),
    responses={
        200: openapi.Response(description="Invitation response processed successfully"),
        403: openapi.Response(description="Authenticated user does not have the pending invitation from this organization"),
        404: openapi.Response(description="Organization not found"),
    },
    operation_description="Accept or decline an invitation to join the organization.",
    tags=["Organization/Membership"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Pending'])
def respond_invitation(request, id):
    accept = request.data.get('accept')
    membership = request.membership
    if accept:
        membership.change_role(Membership.MEMBER)
        return Response({"detail": "Invitation accepted successfully"}, status=status.HTTP_200_OK)
    else:
        membership.delete()
        return Response({"detail": "Invitation declined successfully"}, status=status.HTTP_200_OK)
    
    #     return data