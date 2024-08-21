from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Discussion
from api.organization.decorators import organization_permission_classes
from .serializers import DiscussionTopicSerializer, DiscussionSerializer, DiscussionCommentSerializer


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
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING),
            'category_id': openapi.Schema(type=openapi.TYPE_INTEGER)
        },
        required=['title', 'category_id']
    ),
    responses={
        201: openapi.Response(
            description="Discussion topic created successfully",
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Organization not found"),
    },
    operation_description="Create a new discussion topic in this organization.",
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
    serializer = DiscussionTopicSerializer(data=data, context={'discussion': organization.discussion})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
        404: openapi.Response(description="Organization not found"),
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
    method='delete',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'topic_id': openapi.Schema(type=openapi.TYPE_INTEGER)
        },
        required=['topic_id']
    ),
    responses={
        204: openapi.Response(description="Discussion topic deleted successfully"),
        403: openapi.Response(description="Authenticated user does not have the required permissions"),
        404: openapi.Response(description="Discussion topic not found"),
    },
    operation_description="Delete a discussion topic in this organization.",
    tags=["Organization/Discussion"]
)
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@organization_permission_classes(['Owner'])
def delete_topic(request, id):
    organization = request.organization
    if not hasattr(organization, 'discussion'):
        return Response({'detail': 'Discussion not enabled in this organization'}, status=status.HTTP_404_NOT_FOUND)

    topic_id = request.data.get('topic_id')
    topic = organization.discussion.topics.filter(id=topic_id).first()
    if not topic:
        return Response({'detail': 'Discussion topic not found'}, status=status.HTTP_404_NOT_FOUND)

    topic.deleted = True
    topic.save()
    return Response(status=status.HTTP_204_NO_CONTENT)