from django.urls import path, include
from .views import *

urlpatterns = [
    # Project CRUD
    path('create/', create_project, name='create_project'),
    path('list/', get_projects, name='list_projects'),
    path('<int:id>/info/', get_project_info, name='get_project_info'),

    # Board
    path('<int:id>/board/', include('api.project.board.urls')),
]
