from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .models import Organization, Membership

def organization_permission_classes(required_roles=None):
    if required_roles is None:
        required_roles = ['Owner', 'Member']

    def decorator(func):
        @wraps(func)
        async def wrapper(request, *args, **kwargs):
            try:
                organization = await Organization.objects.aget(id=kwargs.get('id'))
            except Organization.DoesNotExist:
                return Response({"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND)

            try:
                membership = await Membership.objects.aget(user=request.user, organization=organization)
            except Membership.DoesNotExist:
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)

            if required_roles and membership.role not in required_roles:
                return Response({"detail": "You do not have the required permissions."}, status=status.HTTP_403_FORBIDDEN)

            request.organization = organization
            request.membership = membership

            return await func(request, *args, **kwargs)
        return wrapper
    return decorator
