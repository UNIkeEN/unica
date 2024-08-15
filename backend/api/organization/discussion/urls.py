from django.urls import path
from .views import *

urlpatterns = [
    path('enable/', enable_discussion, name='enable_discussion'),
]