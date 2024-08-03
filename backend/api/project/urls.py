from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_project, name='create_project'),
    path('list/', get_projects, name='list_projects'),
]
