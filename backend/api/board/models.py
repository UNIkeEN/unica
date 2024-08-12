from django.utils import timezone
from django.db import models
from jsonschema import validate, ValidationError as JSONSchemaValidationError
from .schemas import PROPERTY_SCHEMA
from ..project.models import Project

class Board(models.Model):
    project = models.OneToOneField(Project, related_name='board', on_delete=models.CASCADE)
    global_properties = models.JSONField(default=list)  # global property definitions

    async def add_or_update_global_property(self, new_prop):
        try:
            validate(instance=new_prop, schema=PROPERTY_SCHEMA)
        except JSONSchemaValidationError as e:
            raise ValueError(f"Invalid property definition: {e.message}")
        for prop in self.global_properties:
            if prop['name'] == new_prop['name']:
                if prop['type'] != new_prop['type']:
                    raise ValueError(f"Property already exists with different type")
                prop.update(new_prop)
                await self.asave()
                return
        self.global_properties.append(new_prop)
        await self.asave()

    async def remove_global_property(self, property_name):
        self.global_properties = [prop for prop in self.global_properties if prop['name'] != property_name]
        await self.asave()


class Task(models.Model):
    board = models.ForeignKey(Board, related_name='tasks', on_delete=models.CASCADE)
    # static properties
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived = models.BooleanField(default=False)
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