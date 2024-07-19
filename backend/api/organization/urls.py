from django.urls import path
from .views import *

urlpatterns = [
    path('create/check-name', check_name, name='check_name'),
    path('create/', create_organization, name='create_organization'),
    path('list/', get_user_organizations, name='get_user_organizations'),
    path('<slug:slug>/members/', get_organization_members_by_slug, name='get_organization_members_by_slug'),
]
