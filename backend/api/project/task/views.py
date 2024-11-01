from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import TaskCollection, Task
from .serializers import TaskCollectionSerializer, TaskSerializer
from ..decorators import project_basic_permission_required
from utils.query import QuerySteps, QueryExecutor, QueryOptions


@swagger_auto_schema(
    method='post',
    request_body=TaskSerializer,
    responses={
        201: openapi.Response(
            description="Task created successfully",
            schema=TaskSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
    },
    operation_description="Create a new task in a specific task collection.",
    tags=["Project/Task"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def create_task(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)

    serializer = TaskSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(collection=collection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=QueryOptions.to_openapi_schema(
        [QuerySteps.PAGINATION, QuerySteps.FILTERS]
    ),
    responses={
        200: openapi.Response(
            description="List of all tasks retrieved successfully",
            schema=TaskSerializer(many=True)
        ),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found")
    },
    operation_description="Retrieve a paginated list of all tasks with optional filters",
    tags=["Project/Task"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def list_tasks(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)
    base_query = collection.tasks.filter(deleted=False, archived=False)

    result = QueryExecutor(
        base_query,
        options=QueryOptions.build_from_request(request),
        supported_steps=[QuerySteps.PAGINATION, QuerySteps.FILTERS]
    ).execute().paginated_serialize(TaskSerializer)

    return Response(result, status=status.HTTP_200_OK)



@swagger_auto_schema(
    method='patch',
    responses={
        200: openapi.Response(
            description="Task updated successfully",
            schema=TaskSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
    },
    operation_description="Update an existing task.",
    tags=["Project/Task"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def update_task(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)

    local_id = request.data.get('local_id')
    updated_value = request.data.get('updated_value')
    if not local_id:
        return Response({'detail': 'Local ID is required for update.'}, status=status.HTTP_400_BAD_REQUEST)
    if not updated_value:
        return Response({'detail': 'New Value is required for update.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        task = collection.tasks.get(local_id=local_id)
    except Task.DoesNotExist:
        return Response({'detail': 'No task found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=updated_value, partial=True) 
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['local_id']
    ),
    responses={
        204: openapi.Response(description="Task pinned successfully"),
        400: openapi.Response(description="Maximum number of pinned tasks per user reached"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found"),
    },
    operation_description="Pin an existing task.",
    tags=["Project/Task"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def pin_task(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)

    local_id = request.data.get('local_id')
    
    try:
        task = collection.tasks.get(local_id=local_id)
    except Task.DoesNotExist:
        return Response({'detail': 'No task found.'}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        pinned_tasks = Task.objects.filter(pinned_users=request.user).select_for_update()
        if len(pinned_tasks) >= 5:
            return Response({'detail': 'You can only pin up to 5 tasks.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            task.pinned_users.add(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['local_id']
    ),
    responses={
        204: openapi.Response(description="Task unpinned successfully"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found"),
    },
    operation_description="Unpin an existing task.",
    tags=["Project/Task"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def unpin_task(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)

    local_id = request.data.get('local_id')
    
    try:
        task = collection.tasks.get(local_id=local_id)
    except Task.DoesNotExist:
        return Response({'detail': 'No task found.'}, status=status.HTTP_404_NOT_FOUND)

    task.pinned_users.remove(request.user)
    return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'local_ids': openapi.Schema(type=openapi.TYPE_ARRAY, 
                                        items=openapi.Items(type=openapi.TYPE_INTEGER))
        },
        required=['local_ids']
    ),
    responses={
        204: openapi.Response(description="Tasks deleted successfully"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found"),
        400: openapi.Response(description="Invalid input"),
    },
    operation_description="Batch delete tasks by local_id.",
    tags=["Project/Task"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def delete_tasks_by_batch(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)
    local_ids = request.data.get('local_ids')

    if not local_ids or not isinstance(local_ids, ):
        return Response({'detail': 'Invalid local_ids. Must be a list of integers.'}, status=status.HTTP_400_BAD_REQUEST)
    if not all(isinstance(local_id, int) for local_id in local_ids):
        return Response({'detail': 'All local_ids must be integers.'}, status=status.HTTP_400_BAD_REQUEST)

    tasks = collection.tasks.filter(local_id__in=local_ids, deleted=False)
    if not tasks.exists():
        return Response({'detail': 'No tasks found or tasks are already deleted.'}, status=status.HTTP_404_NOT_FOUND)

    for task in tasks:
        task.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        additional_properties=openapi.Schema(type=openapi.TYPE_OBJECT)
    ),
    responses={
        200: openapi.Response(
            description="Global property added or updated successfully",
            schema=TaskCollectionSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found")
    },
    operation_description="Add or update a global property for the board.",
    tags=["Project/Task"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def add_or_update_global_property(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)
    new_property = request.data
    try:
        collection.add_or_update_global_property(new_property)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    serializer = TaskCollectionSerializer(collection)
    return Response(serializer.data)


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
        200: openapi.Response(
            description="Global property removed successfully",
            schema=TaskCollectionSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Project or task collection not found")
    },
    operation_description="Remove a global property from the board.",
    tags=["Project/Task"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def remove_global_property(request, id):
    collection = get_object_or_404(TaskCollection, project=request.project)
    property_name = request.data.get('name')
    if not property_name:
        return Response({'error': 'Property name is required.'}, status=status.HTTP_400_BAD_REQUEST)
    collection.remove_global_property(property_name)
    # TODO: clear the property values from all tasks
    serializer = TaskCollectionSerializer(collection)
    return Response(serializer.data)