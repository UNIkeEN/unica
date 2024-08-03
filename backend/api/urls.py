from django.urls import path, include

urlpatterns = [
    path('user/', include('api.user.urls')),
    path('organization/', include('api.organization.urls')),
    path('project/', include('api.project.urls')),
]