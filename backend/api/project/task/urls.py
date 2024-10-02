from django.urls import path
from .views import *

urlpatterns = [
    path('g-prop/update', add_or_update_global_property, name='add_or_update_global_property'),
    path('g-prop/remove', remove_global_property, name='remove_global_property'),
]
