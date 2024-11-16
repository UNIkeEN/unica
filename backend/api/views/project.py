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
from db.models.organization import Organization
from api.decorators.organization import organization_permission_classes
from db.models.project import Project
from api.serializers.project import ProjectSerializer, ProjectCreationSerializer
from api.decorators.project import project_basic_permission_required
from utils.query import QuerySteps, QueryExecutor, QueryOptions

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
    request_body=QueryOptions.to_openapi_schema(
        [QuerySteps.PAGINATION],
        extra_schemas={
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
def list_projects(request):
    org_id = request.data.get('org_id')

    if org_id:
        @organization_permission_classes(['Owner', 'Member'])
        def __internal_func():
            return Project.objects.filter(owner_type=ContentType.objects.get_for_model(Organization), owner_id=org_id).order_by('-updated_at')
        
        projects = __internal_func()
    else:
        projects = Project.objects.filter(owner_type=ContentType.objects.get_for_model(User), owner_id=request.user.id).order_by('-updated_at')

    if isinstance(projects, Response):  # return 403 or 404 response from @organization_permission_classes
        return projects

    result = QueryExecutor(
        projects,
        options=QueryOptions.build_from_request(request),
        supported_steps=[QuerySteps.PAGINATION]
    ).execute().paginated_serialize(
        ProjectSerializer
    )

    return Response(result, status=status.HTTP_200_OK)



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
