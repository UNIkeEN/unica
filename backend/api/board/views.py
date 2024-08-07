from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Board
from .serializers import BoardSerializer
from ..project.decorators import project_basic_permission_required


@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        additional_properties=openapi.Schema(type=openapi.TYPE_OBJECT)
    ),
    responses={
        200: openapi.Response(description="Global property added or updated successfully"),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or board not found")
    },
    operation_description="Add or update a global property for the board.",
    tags=["project board"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def add_or_update_global_property(request, id):
    board = get_object_or_404(Board, project=request.project)
    new_property = request.data
    try:
        board.add_or_update_global_property(new_property)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    serializer = BoardSerializer(board)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['name']
    ),
    responses={
        200: openapi.Response(description="Global property removed successfully"),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or board not found")
    },
    operation_description="Remove a global property from the board.",
    tags=["project board"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def remove_global_property(request, id):
    board = get_object_or_404(Board, project=request.project)
    property_name = request.data.get('name')
    if not property_name:
        return Response({'error': 'Property name is required.'}, status=status.HTTP_400_BAD_REQUEST)
    board.remove_global_property(property_name)
    # TODO: clear the property values from all tasks
    serializer = BoardSerializer(board)
    return Response(serializer.data)