from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Organization, Membership
from .serializers import OrganizationCreationSerializer, OrganizationSerializer, MembershipSerializer
from .decorators import organization_permission_classes


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
        ),
        401: openapi.Response(
            description="Unauthorized - Authentication credentials were not provided or are invalid"
        ),
    },
    operation_description="Retrieve a list of organizations the authenticated user belongs to.",
    tags=["organization"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_organizations(request):
    memberships = Membership.objects.filter(user=request.user)
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
            description="Organization name and authenticated user's role",
        ),
        404: openapi.Response(
            description="Organization not found"
        ),
        403: openapi.Response(
            description="Authenticated user are not a member of this organization"
        ),
    },
    operation_description="Check if the authenticated user is a member of the organization and retrieve the user's role.",
    tags=["organization"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def check_user_organization_permission(request, id):
    serializer = MembershipSerializer(request.membership)
    data = serializer.data
    data['org_name'] = request.organization.display_name
    return Response(data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description="List of members in the organization",
            schema=MembershipSerializer(many=True)
        ),
        404: openapi.Response(
            description="Organization not found"
        ),
        403: openapi.Response(
            description="Authenticated user are not a member of this organization"
        ),
    },
    operation_description="Retrieve a list of members in an organization.",
    tags=["organization"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def get_organization_members(request, id):
    memberships = Membership.objects.filter(organization=request.organization)
    serializer = MembershipSerializer(memberships, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)