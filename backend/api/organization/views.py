from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Organization, Membership
from .serializers import OrganizationCreationSerializer, OrganizationSerializer, MembershipSerializer
from .decorators import organization_permission_classes

User = get_user_model()


@swagger_auto_schema(
    method='post',
    request_body=OrganizationCreationSerializer,
    responses={
        201: openapi.Response(
            description="Organization successfully created",
            schema=OrganizationCreationSerializer
        ),
        400: openapi.Response(
            description="Invalid input data"
        ),
    },
    operation_description="Create a new organization. The user creating the organization will automatically be assigned the role of OWNER.",
    tags=["organization"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_organization(request):
    serializer = OrganizationCreationSerializer(data=request.data)
    if serializer.is_valid():
        organization = serializer.save()
        Membership.objects.create(user=request.user, organization=organization, role=Membership.OWNER)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description="List of organizations the user belongs to",
            schema=OrganizationSerializer(many=True)
        )
    },
    operation_description="Retrieve a list of organizations the authenticated user belongs to.",
    tags=["organization"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_organizations(request):
    memberships = Membership.objects.filter(user=request.user).exclude(role=Membership.PENDING)
    organizations = sorted(
        (membership.organization for membership in memberships),
        key=lambda org: org.updated_at,
        reverse=True
    )
    serializer = OrganizationSerializer(organizations, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


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
    operation_description="Check if the authenticated user is a member of the organization and retrieve the user's role.",
    tags=["organization"]
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
    tags=["organization"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def get_organization_members(request, id):
    class MembersNumberPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = MembersNumberPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    memberships = Membership.objects.filter(organization=request.organization).exclude(role=Membership.PENDING).order_by('joined_at')
    result_page = paginator.paginate_queryset(memberships, request)
    serializer = MembershipSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


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
            description="User not found"
        ),
        409: openapi.Response(
            description="User is already a member of the organization or has a pending invitation"
        ),
    },
    operation_description="Invite a user to join the organization.",
    tags=["organization"]
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
    operation_description="Retrieve a list of pending invitations in an organization.",
    tags=["organization"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def get_organization_invitations(request, id):
    class MembersNumberPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = MembersNumberPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    memberships = Membership.objects.filter(organization=request.organization, role=Membership.PENDING).order_by('joined_at')
    result_page = paginator.paginate_queryset(memberships, request)
    serializer = MembershipSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


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
    tags=["organization"]
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
    
