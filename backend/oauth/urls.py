from django.urls import path
from .views import login_oauth, auth_oauth, logout, oidc_refresh

urlpatterns = [
    path('login/<str:provider>/', login_oauth, name='login_oauth'),
    path('auth/<str:provider>/', auth_oauth, name='auth_oauth'),
    path('logout/', logout, name='logout'),
    path('oidc_refresh/', oidc_refresh, name='oidc_refresh'),
]
