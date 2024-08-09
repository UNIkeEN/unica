from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
