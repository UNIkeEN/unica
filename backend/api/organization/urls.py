from django.urls import path, include
from .views import *

urlpatterns = [
    # Organization CRUD
    path('create/', create_organization, name='create_organization'),
    path('list/', list_user_organizations, name='list_user_organizations'),
    path('<int:id>/update/', update_organization, name='update_organization'),
    path('<int:id>/delete/', delete_organization, name='delete_organization'),

    # Membership CRUD
    path('<int:id>/permission/', check_user_organization_permission, name='check_user_organization_permission'),
    path('<int:id>/leave/', leave_organization, name='leave_organization'),
    path('<int:id>/members/list/', list_organization_members, name='list_organization_members'),
    path('<int:id>/members/remove/', remove_member, name='remove_member'),
    path('<int:id>/members/role/', modify_member_role, name='modify_member_role'),

    # Invitation CRUD
    path('<int:id>/invite/create/', create_invitation, name='create_invitation'),
    path('<int:id>/invite/list/', list_organization_invitations, name='list_organization_invitations'),
    path('<int:id>/invite/respond/', respond_invitation, name='respond_invitation'),
    path('<int:id>/invite/cancel/', cancel_invitation, name='cancel_invitation'),

    # Discussion
    path('<int:id>/discussion/', include('api.organization.discussion.urls')),
]
