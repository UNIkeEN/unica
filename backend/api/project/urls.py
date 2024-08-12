from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_project, name='create_project'),
    path('list/', get_projects, name='list_projects'),
    path('<int:id>/info/', get_project_info, name='get_project_info'),
]
