from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.db import models
import mmh3
from django.contrib.auth import get_user_model
from ..organization.models import Organization

User = get_user_model()

class Project(models.Model):
    id = models.BigIntegerField(primary_key=True, editable=False, unique=True)  # hash id
    display_name = models.CharField(max_length=20)
    description = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Generic foreign key to support both User and Organization
    owner_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    owner_id = models.PositiveIntegerField()
    owner = GenericForeignKey('owner_type', 'owner_id')

    def save(self, *args, **kwargs):
        # Generate id if not set
        if self.pk is None:
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S%f')
            self.id = mmh3.hash(str(self.name + timestamp), signed=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def is_user_project(self):
        return self.owner_type == ContentType.objects.get_for_model(User)

    def is_organization_project(self):
        return self.owner_type == ContentType.objects.get_for_model(Organization)
