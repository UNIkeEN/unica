from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Discussion
from api.organization.decorators import organization_permission_classes


@swagger_auto_schema(
    method='post',
    responses={
        200: openapi.Response(description="Discussion enabled in this organization"),
        400: openapi.Response(description="Discussion already enabled"),
        403: openapi.Response(description="Authenticated user is not an owner of this organization"),
        404: openapi.Response(description="User not found in this organization, or organization not found"),
    },
    operation_description="Remove a user from the organization. Need 'Owner' permission.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def enable_discussion(request, id):
    organization = request.organization
    if hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion already enabled'}, status=status.HTTP_400_BAD_REQUEST)
    Discussion.objects.create(organization=organization)
    return Response({'detail': 'Discussion enabled in this organization'}, status=status.HTTP_200_OK)