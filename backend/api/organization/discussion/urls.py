from django.urls import path
from .views import *

urlpatterns = [
    path('enable/', enable_discussion, name='enable_discussion'),

    #topic CRUD
    path('topic/create/', create_topic, name='create_topic'),
    path('topic/list/', list_topics, name='list_topic'),
    path('topic/delete/', delete_topic, name='delete_topic'),
]