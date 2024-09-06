from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import emoji
from emoji import is_emoji
from .models import Discussion
from api.organization.decorators import organization_permission_classes
from .serializers import *


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


#create_topic
@swagger_auto_schema(
    method='post',
    request_body=DiscussionTopicCreationSerializer,
    responses={
        201: openapi.Response(
            description="Discussion topic created successfully",
            schema=DiscussionTopicCreationSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Organization not found, or discussion not enabled in this organization"),
    },
    operation_description="Create a new discussion topic in this organization, with an optional initial comment.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def create_topic(request, id):
    organization = request.organization
    if not hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion not enabled in this organization'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if 'category' in data and data['category']:
        category_id = data['category']
        try:
            category = DiscussionCategory.objects.get(id=category_id)
        except DiscussionCategory.DoesNotExist:
            return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        data['category'] = None
    serializer = DiscussionTopicCreationSerializer(data=data, context={'discussion': organization.discussion, 'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={ 'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER) },
        required=['topic_local_id']
    ),
    responses={
        200: openapi.Response(
            description="Discussion topic retrieved successfully",
            schema=DiscussionTopicSerializer
        ),
        404: openapi.Response(description="Topic not found or has been deleted"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
    },
    operation_description="Retrieve a discussion topic in this organization.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def get_topic_info(request, id):
    organization = request.organization
    if not hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion not enabled in this organization'}, status=status.HTTP_404_NOT_FOUND)
    topic_local_id = request.data.get('topic_local_id')
    try:
        topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    except DiscussionTopic.DoesNotExist:
        return Response({'detail': 'Topic not found or has been deleted'}, status=status.HTTP_404_NOT_FOUND)
    serializer = DiscussionTopicSerializer(topic)
    return Response(serializer.data, status=status.HTTP_200_OK)


# topic list
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
            description="List of discussion topics in the organization",
            schema=DiscussionTopicSerializer(many=True)
        ),
        404: openapi.Response(description="Organization not found, or discussion not enabled in this organization"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
    },
    operation_description="Retrieve a paginated list of discussion topics in this organization.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def list_topics(request, id):
    class CustomPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = CustomPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    organization = request.organization
    if not hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion not enabled in this organization'}, status=status.HTTP_404_NOT_FOUND)

    # Filter out topics where deleted=True
    topics = organization.discussion.topics.filter(deleted=False).order_by('-created_at')
    result_page = paginator.paginate_queryset(topics, request)
    serializer = DiscussionTopicSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# delete_topic
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER)
        },
        required=['topic_local_id']
    ),
    responses={
        204: openapi.Response(description="Discussion topic deleted successfully"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion topic not found"),
    },
    operation_description="Delete a discussion topic in this organization.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def delete_topic(request, id):
    organization = request.organization
    if not hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion not enabled in this organization'}, status=status.HTTP_404_NOT_FOUND)

    topic_local_id = request.data.get('topic_local_id')
    topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    if not topic:
        return Response({'detail': 'Discussion topic not found'}, status=status.HTTP_404_NOT_FOUND)

    first_comment = topic.comments.filter(deleted=False).order_by('created_at').first()

    if request.membership.role != 'Owner' and request.user != first_comment.user:
        return Response({'detail': 'You do not have permission to delete this topic'}, status=status.HTTP_403_FORBIDDEN)

    topic.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'content': openapi.Schema(type=openapi.TYPE_STRING, max_length=200)
        },
        required=['topic_local_id', 'content']
    ),
    responses={
        201: openapi.Response(
            description="Comment added successfully",
            schema=DiscussionCommentCreationSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Topic not found or has been deleted"),
    },
    operation_description="Add a comment to an existing discussion topic.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def create_comment(request, id):
    organization = request.organization
    topic_local_id = request.data.get('topic_local_id')

    try:
        topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    except DiscussionTopic.DoesNotExist:
        return Response({'detail': 'Topic not found or has been deleted'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscussionCommentCreationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(topic=topic, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'page': openapi.Schema(type=openapi.TYPE_INTEGER, default=1),
            'page_size': openapi.Schema(type=openapi.TYPE_INTEGER, default=20),
        },
        required=['topic_local_id']
    ),
    responses={
        200: openapi.Response(
            description="List of comments retrieved successfully",
            schema=DiscussionCommentSerializer(many=True)
        ),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Topic not found or has been deleted"),
    },
    operation_description="Retrieve a paginated list of comments for an existing discussion topic.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def list_comment(request, id):
    organization = request.organization
    topic_local_id = request.data.get('topic_local_id')

    try:
        topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    except DiscussionTopic.DoesNotExist:
        return Response({'detail': 'Topic not found or has been deleted'}, status=status.HTTP_404_NOT_FOUND)

    class CustomPagination(PageNumberPagination):
        page_size_query_param = 'page_size'

    paginator = CustomPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    comments = topic.comments.filter(deleted=False).order_by('created_at')
    result_page = paginator.paginate_queryset(comments, request)
    serializer = DiscussionCommentSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'comment_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['topic_local_id', 'comment_local_id']
    ),
    responses={
        204: openapi.Response(description="Comment deleted successfully"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Comment or topic not found"),
        400: openapi.Response(description="Please use delete_topic to delete the entire topic.")
    },
    operation_description="Delete a comment from an existing discussion topic.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def delete_comment(request, id):
    organization = request.organization
    topic_local_id = request.data.get('topic_local_id')
    comment_local_id = request.data.get('comment_local_id')
    if comment_local_id == 1:
        return Response({'detail': 'Please use delete_topic to delete the entire topic.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    except DiscussionTopic.DoesNotExist:
        return Response({'detail': 'Topic not found or has been deleted'}, status=status.HTTP_404_NOT_FOUND)
    try:
        comment = DiscussionComment.objects.get(topic=topic, local_id=comment_local_id, deleted=False)
    except DiscussionComment.DoesNotExist:
        return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.membership.role != 'Owner' and request.user != comment.user:
        return Response({'detail': 'You do not have permission to delete this comment'},
                        status=status.HTTP_403_FORBIDDEN)

    # Mark the comment as deleted
    comment.deleted = True
    comment.save()

    return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'comment_local_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'content': openapi.Schema(type=openapi.TYPE_STRING, max_length=200)
        },
        required=['topic_local_id', 'comment_local_id', 'content']
    ),
    responses={
        201: openapi.Response(
            description="Comment edited successfully",
            schema=DiscussionCommentCreationSerializer
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Topic not found or has been deleted"),
    },
    operation_description="Edited an existed comment",
    tags=["Organization/Discussion"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def edit_comment(request, id):
    organization = request.organization
    topic_local_id = request.data.get('topic_local_id')
    comment_local_id = request.data.get('comment_local_id')

    try:
        topic = DiscussionTopic.objects.get(discussion=organization.discussion, local_id=topic_local_id, deleted=False)
    except DiscussionTopic.DoesNotExist:
        return Response({'detail': 'Topic not found or has been deleted'}, status=status.HTTP_404_NOT_FOUND)
    try:
        comment = DiscussionComment.objects.get(topic=topic, local_id=comment_local_id, deleted=False, user=request.user)
    except DiscussionComment.DoesNotExist:
        return Response({'detail': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DiscussionCommentCreationSerializer(comment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(topic=topic, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=DiscussionCategorySerializer(),
    responses={
        201: openapi.Response(
            description="Category created successfully",
            schema=DiscussionCategorySerializer(many=True)
        ),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion not found"),
    },
    operation_description="Create a new category for a discussion and return the updated list of categories.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def create_category(request, id):
    organization = request.organization
    try:
        discussion = Discussion.objects.get(organization=organization)
    except Discussion.DoesNotExist:
        return Response({'detail': 'Discussion not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscussionCategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(discussion=discussion)
        # return all categories
        categories = discussion.categories.all()
        updated_serializer = DiscussionCategorySerializer(categories, many=True)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(
            description="List of categories in the discussion",
            schema=DiscussionCategorySerializer(many=True)
        ),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion not found"),
    },
    operation_description="Retrieve a list of categories in the discussion.",
    tags=["Organization/Discussion"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner', 'Member'])
def list_categories(request, id):
    organization = request.organization
    try:
        discussion = Discussion.objects.get(organization=organization)
    except Discussion.DoesNotExist:
        return Response({'detail': 'Discussion not found'}, status=status.HTTP_404_NOT_FOUND)
    
    categories = discussion.categories.all().order_by('name')
    serializer = DiscussionCategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'category_id': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="The ID of the category to update"
            ),
            'category_value': openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                    'emoji': openapi.Schema(type=openapi.TYPE_STRING),
                    'color': openapi.Schema(type=openapi.TYPE_STRING),
                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                },
                description="Fields to update for the category",
            ),
        },
        required=['category_id', 'category_value'],
    ),
    responses={
        200: openapi.Response(
            description="Category updated successfully",
            schema=DiscussionCategorySerializer(many=True)
        ),
        400: openapi.Response(description="Bad request, need category_id and category_value"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion or Category not found"),
    },
    operation_description="Update an existing category for a discussion and return the updated list of categories.",
    tags=["Organization/Discussion"]
)
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def update_category(request, id):
    organization = request.organization
    try:
        discussion = Discussion.objects.get(organization=organization)
    except Discussion.DoesNotExist:
        return Response({'detail': 'Discussion not found'}, status=status.HTTP_404_NOT_FOUND)

    category_id = request.data.get('category_id')
    if not category_id:
        return Response({'detail': 'Category ID is required for update.'}, status=status.HTTP_400_BAD_REQUEST)
    category_value = request.data.get('category_value')
    if not category_value:
        return Response({'detail': 'Category value is required for update.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        category_instance = DiscussionCategory.objects.get(id=category_id, discussion=discussion)
    except DiscussionCategory.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscussionCategorySerializer(category_instance, data=category_value, partial=True)
    if serializer.is_valid():
        serializer.save()
        # return all categories
        categories = discussion.categories.all().order_by('name')
        updated_serializer = DiscussionCategorySerializer(categories, many=True)
        return Response(updated_serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'category_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="The ID of the category to delete"),
        },
        required=['category_id'],
    ),
    responses={
        200: openapi.Response(
            description="Category deleted successfully",
            schema=DiscussionCategorySerializer(many=True)
        ),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion or Category not found"),
    },
    operation_description="Delete an existing category from a discussion and return the updated list of categories.",
    tags=["Organization/Discussion"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def delete_category(request, id):
    organization = request.organization
    try:
        discussion = Discussion.objects.get(organization=organization)
    except Discussion.DoesNotExist:
        return Response({'detail': 'Discussion not found'}, status=status.HTTP_404_NOT_FOUND)

    category_id = request.data.get('category_id')
    if not category_id:
        return Response({'detail': 'Category ID is required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        category_instance = DiscussionCategory.objects.get(id=category_id, discussion=discussion)
    except DiscussionCategory.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    category_instance.delete()
    # return all categories
    categories = discussion.categories.all().order_by('name')
    updated_serializer = DiscussionCategorySerializer(categories, many=True)
    return Response(updated_serializer.data, status=status.HTTP_200_OK)