from django.urls import path, include
from api.views.project import *

urlpatterns = [
    # Project CRUD
    path('create/', create_project, name='create_project'),
    path('list/', list_projects, name='list_projects'),
    path('<int:id>/info/', get_project_info, name='get_project_info'),

    # Tasks
    path('<int:id>/task/', include('api.urls.task')),
]
