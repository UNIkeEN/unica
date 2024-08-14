from django.urls import path
from .views import UserProfileAPIView

urlpatterns = [
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
]
