from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from api.models.project import Project
from api.models.organization import Membership


def project_basic_permission_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        try:
            project = Project.objects.get(id=kwargs.get('id'))
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        if project.is_user_project():
            if project.owner != user:
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)
        elif project.is_organization_project():
            organization = project.owner
            membership = Membership.objects.filter(organization=organization, user=user).exclude(role=Membership.PENDING)
            if not membership.exists():
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)
        
        request.project = project

        return func(request, *args, **kwargs)
    return wrapper


def project_advanced_permission_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        try:
            project = Project.objects.get(id=kwargs.get('id'))
        except Project.DoesNotExist:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        if project.is_user_project():
            if project.owner != user:
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)
        elif project.is_organization_project():
            organization = project.owner
            membership = Membership.objects.filter(organization=organization, user=user, role=Membership.OWNER)
            if not membership.exists():
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)
        
        request.project = project

        return func(request, *args, **kwargs)
    return wrapper
