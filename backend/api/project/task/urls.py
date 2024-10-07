from django.urls import path
from .views import *

urlpatterns = [
    # Task CRUD
    path('create/', create_task, name='create_task'),
    path('list/', list_tasks, name='list_tasks'),
    path('update/', update_task, name='update_task'),
    path('pin/', pin_task, name='pin_task'),
    path('unpin/', unpin_task, name='unpin_task'),
    path('delete/', delete_tasks_by_batch, name='delete_tasks_by_batch'),

    # global property
    path('g-prop/update/', add_or_update_global_property, name='add_or_update_global_property'),
    path('g-prop/remove/', remove_global_property, name='remove_global_property'),
]
