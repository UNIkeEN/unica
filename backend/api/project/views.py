from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from ..organization.models import Organization
from ..organization.decorators import organization_permission_classes
from .models import Project
from .serializers import ProjectSerializer, ProjectCreationSerializer
from .decorators import project_basic_permission_required

User = get_user_model()


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'display_name': openapi.Schema(type=openapi.TYPE_STRING, description='Display name of the project'),
            'description': openapi.Schema(type=openapi.TYPE_STRING, description='Description of the project'),
            'org_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Organization ID')
        },
        required=['display_name']
    ),
    responses={
        201: openapi.Response(description="Project created successfully"),
        400: openapi.Response(description="Invalid input data"),
        403: openapi.Response(description="You do not have the required permissions to create a project"),
        404: openapi.Response(description="Organization not found"),
    },
    operation_description="Create a new project.",
    tags=["Project"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_project(request):
    display_name = request.data.get('display_name')
    description = request.data.get('description')
    org_id = request.data.get('org_id')

    def _get_owner_info():
        if org_id:
            @organization_permission_classes(['Owner', 'Member'])
            def __internal_func(request, id):
                return ContentType.objects.get_for_model(Organization), id
            
            return __internal_func(request, id = org_id)
        else:
            return ContentType.objects.get_for_model(User), request.user.id

    owner_info = _get_owner_info()
    if isinstance(owner_info, Response):  # return 403 or 404 response from @organization_permission_classes
        return owner_info

    owner_type, owner_id = owner_info

    serializer = ProjectCreationSerializer(data={
        'display_name': display_name,
        'description': description,
        'owner_type': owner_type.pk,
        'owner_id': owner_id
    })
    if serializer.is_valid():
        project = serializer.save()
        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'page': openapi.Schema(type=openapi.TYPE_INTEGER, default=1),
            'page_size': openapi.Schema(type=openapi.TYPE_INTEGER, default=20),
            'org_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Organization ID')
        }
    ),
    responses={
        200: openapi.Response(description="Successfully get list of projects", schema=ProjectSerializer(many=True)),
        404: openapi.Response(description="Organization not found"),
        403: openapi.Response(description="Authenticated user is not a member of this organization"),
    },
    operation_description="Retrieve a list of projects with pagination.",
    tags=["Project"]
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_projects(request):
    org_id = request.data.get('org_id')

    def _get_projects():
        if org_id:
            @organization_permission_classes(['Owner', 'Member'])
            def __internal_func(request, id):
                return Project.objects.filter(owner_type=ContentType.objects.get_for_model(Organization), owner_id=id).order_by('-updated_at')
            
            return __internal_func(request, id = org_id)
        else:
            return Project.objects.filter(owner_type=ContentType.objects.get_for_model(User), owner_id=request.user.id).order_by('-updated_at')

    projects = _get_projects()
    if isinstance(projects, Response):  # return 403 or 404 response from @organization_permission_classes
        return projects

    class CustomPagination(PageNumberPagination):
        page_size_query_param = 'page_size'
    paginator = CustomPagination()

    request.query_params._mutable = True
    request.query_params['page'] = request.data.get('page', 1)
    request.query_params['page_size'] = request.data.get('page_size', 20)
    request.query_params._mutable = False

    result_page = paginator.paginate_queryset(projects, request)
    serializer = ProjectSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response(description="Successfully get project basic info", schema=ProjectSerializer()),
        404: openapi.Response(description="Project not found"),
        403: openapi.Response(description="Authenticated user does not have permission of this project"),
    },
    operation_description="Retrieve details of a project by its ID.",
    tags=["Project"]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@project_basic_permission_required
def get_project_info(request, id):
    project = request.project
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)
