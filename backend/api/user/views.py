from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import UserProfileSerializer


class UserProfileAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get the authenticated user's basic information",
        responses={
            200: openapi.Response(
                description="Successfully get user information", 
                schema=UserProfileSerializer
            )
        },
        tags=["User"]
    )
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    

    @swagger_auto_schema(
        operation_description="Update the authenticated user's basic information",
        request_body=UserProfileSerializer(partial=True),
        responses={
            200: openapi.Response(
                description="Successfully update user information", 
                schema=UserProfileSerializer
            ),
            400: "Invalid data provided"
        },
        tags=["User"]
    )
    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
