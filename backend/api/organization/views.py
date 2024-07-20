from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Organization, Membership
from .serializers import OrganizationCreationSerializer, OrganizationSerializer, MembershipSerializer


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


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_organizations(request):
    memberships = Membership.objects.filter(user=request.user)
    organizations = [membership.organization for membership in memberships]
    serializer = OrganizationSerializer(organizations, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_organization_members_by_slug(request, slug):
    try:
        organization = Organization.objects.get(slug=slug)
    except Organization.DoesNotExist:
        return Response({"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND)

    memberships = Membership.objects.filter(organization=organization)
    serializer = MembershipSerializer(memberships, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)