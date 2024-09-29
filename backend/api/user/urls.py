from django.urls import path
from .views import UserProfileAPIView,upload_user_avatar

urlpatterns = [
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('avatar/upload/', upload_user_avatar, name='user-avatar-upload'),

]
