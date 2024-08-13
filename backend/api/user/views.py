from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import UserBasicInfoSerializer


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description="Successfully get user information",
            schema=UserBasicInfoSerializer
        )
    },
    operation_description="Get the authenticated user's basic information",
    tags=["User"],
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    serializer = UserBasicInfoSerializer(user)
    return Response(serializer.data)



@swagger_auto_schema(
    method='patch',
    request_body=UserBasicInfoSerializer(partial=True),
    responses={
        200: openapi.Response(
            description="Successfully update user information",
            schema=UserBasicInfoSerializer
        ),
        400: "Invalid data provided",
    },
    operation_description="Update the authenticated user's basic information",
    tags=["User"],
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_user_info(request):
    serializer = UserBasicInfoSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)