from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_organization, name='create_organization'),
    path('list/', get_user_organizations, name='get_user_organizations'),

    path('<int:id>/permission/', check_user_organization_permission, name='check_user_organization_permission'),
    path('<int:id>/members/', get_organization_members, name='get_organization_members'),
    path('<int:id>/invite/create/', create_invitation, name='create_invitation'),
    path('<int:id>/invite/list/', get_organization_invitations, name='get_organization_invitations'),
    path('<int:id>/invite/respond/', respond_invitation, name='respond_invitation'),
]
