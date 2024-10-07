from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models, transaction
from jsonschema import validate, ValidationError as JSONSchemaValidationError
from .schemas import PROPERTY_SCHEMA
from api.project.models import Project
from api.models import AbstractComment

User = get_user_model()

class TaskCollection(models.Model):
    project = models.OneToOneField(Project, related_name='tasks', on_delete=models.CASCADE)
    global_properties = models.JSONField(default=list)  # global property definitions

    def add_or_update_global_property(self, new_prop):
        try:
            validate(instance=new_prop, schema=PROPERTY_SCHEMA)
        except JSONSchemaValidationError as e:
            raise ValueError(f"Invalid property definition: {e.message}")
        for prop in self.global_properties:
            if prop['name'] == new_prop['name']:
                if prop['type'] != new_prop['type']:
                    raise ValueError(f"Property already exists with different type")
                prop.update(new_prop)
                self.save()
                return
        self.global_properties.append(new_prop)
        self.save()

    def remove_global_property(self, property_name):
        self.global_properties = [prop for prop in self.global_properties if prop['name'] != property_name]
        self.save()


class Task(models.Model):
    collection = models.ForeignKey(TaskCollection, related_name='tasks', on_delete=models.CASCADE)
    # static properties
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    local_id = models.IntegerField(editable=False)  # local id, in the same discussion(organization) scope
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False) # soft delete
    pinned_users = models.ManyToManyField(User, related_name='pinned_tasks')
    # dynamic properties
    global_properties = models.JSONField(default=dict)  # global property values
    local_properties = models.JSONField(default=dict)  # local property definitions and values

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.local_id:
                max_local_id = Task.objects.filter(
                    collection = self.collection
                ).select_for_update().aggregate(models.Max('local_id'))['local_id__max']
                
                if max_local_id is not None:
                    self.local_id = max_local_id + 1 # Generate local_id at max+1
                else:
                    self.local_id = 1
            super().save(*args, **kwargs)

        # Update the parent project's updated_at field
        self.collection.project.updated_at = timezone.now()
        self.collection.project.save()

    def archive(self):
        self.archived = True
        self.save()
        
    def delete(self):
        self.deleted = True
        self.save()

    def __str__(self):
        return f"#{self.local_id} {self.title}"
    

class TaskComment(AbstractComment):
    task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)