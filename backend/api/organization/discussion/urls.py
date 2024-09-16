from django.urls import path
from .views import *

urlpatterns = [
    path('enable/', enable_discussion, name='enable_discussion'),

    #topic CRUD
    path('topic/create/', create_topic, name='create_topic'),
    path('topic/info/', get_topic_info, name='get_topic_info'),
    path('topic/list/', list_topics, name='list_topic'),
    path('topic/delete/', delete_topic, name='delete_topic'),

    #comment CRUD
    path('comment/create/', create_comment, name='create_comment'),
    path('comment/list/', list_comment, name='list_comment'),
    path('comment/update/', edit_comment, name='edit_comment'),
    path('comment/delete/', delete_comment, name='delete_comment'),

    #category CRUD
    path('category/create/', create_category, name='create_category'),
    path('category/info/', get_category_info, name='get_category_info'),
    path('category/list/', list_categories, name='list_category'),
    path('category/update/', update_category, name='update_category'),
    path('category/delete/', delete_category, name='delete_category'),
]