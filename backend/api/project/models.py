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
    owner_id = models.BigIntegerField()
    owner = GenericForeignKey('owner_type', 'owner_id')

    def save(self, *args, **kwargs):
        # Generate id if not set
        if self.pk is None:
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S%f')
            self.id = mmh3.hash(str(self.display_name + timestamp), signed=False)
        super().save(*args, **kwargs)
        # Automatically create the associated board
        if not hasattr(self, 'board'):
            Board.objects.create(project=self)

    def __str__(self):
        return self.display_name

    def is_user_project(self):
        return self.owner_type == ContentType.objects.get_for_model(User)

    def is_organization_project(self):
        return self.owner_type == ContentType.objects.get_for_model(Organization)
    

class Board(models.Model):
    project = models.OneToOneField(Project, related_name='board', on_delete=models.CASCADE)
    global_properties = models.JSONField(default=list)  # global property definitions


class Task(models.Model):
    board = models.ForeignKey(Board, related_name='tasks', on_delete=models.CASCADE)
    # static properties
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # dynamic properties
    global_properties = models.JSONField(default=dict)  # global property values
    local_properties = models.JSONField(default=dict)  # local property definitions and values

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the parent project's updated_at field
        self.board.project.updated_at = timezone.now()
        self.board.project.save()

    def __str__(self):
        return f"#{self.id} {self.title}"