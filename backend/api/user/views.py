from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from ..project.task.serializers import TaskSerializer
from .serializers import UserProfileSerializer
from files.serializers import UserFileSerializer, UserFileSerializerConfig
from PIL import Image
from io import BytesIO


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


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'file': openapi.Schema(type=openapi.TYPE_FILE, description='The image file to upload')
        },
        required=['file']
    ),
    responses={
        201: openapi.Response(description="Image successfully uploaded"),
        400: openapi.Response(description="Invalid data provided"),
    },
    operation_description="Upload an avatar for the authenticated user",
    tags=["User"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def upload_user_avatar(request):
    print(request.FILES)
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    def preprocess_image(uploaded_file):
        image = Image.open(uploaded_file)
        image_io = BytesIO()
        image.save(image_io, format='PNG')
        image_io.seek(0)
        return ContentFile(image_io.read(), name=uploaded_file.name.replace(uploaded_file.name.split('.')[-1], 'png'))

    cfg = UserFileSerializerConfig(
        target_dir='user_content/',
        max_size=5 * 1024 * 1024,  # 5 MB
        allowed_types=['image/jpeg', 'image/png'],
        target_name = f"{request.user.username}",
        strict_check=True,
        preprocess=preprocess_image
    )

    serializer = UserFileSerializer(data={'file': file, 'user': request.user.id}, cfg=cfg)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(description="List of pinned tasks retrieved successfully"),
    },
    operation_description="Retrieve a list of pinned tasks of the authenticated user",
    tags=["User"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def list_pinned_tasks(request):
    serializer = TaskSerializer(request.user.pinned_tasks.all(), many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)