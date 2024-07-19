from django.contrib.auth.models import AbstractUser
from django.db import models

class UnicaUser(AbstractUser):
    
    # use email as unique username in AbstractUser
    display_name = models.CharField(max_length=50, blank=True, null=True)
    oauth_provider = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username