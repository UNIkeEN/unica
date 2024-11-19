from django.urls import path, include

urlpatterns = [
    path('user/', include('api.urls.user')),
    path('organization/', include('api.urls.organization')),
    path('project/', include('api.urls.project')),
]