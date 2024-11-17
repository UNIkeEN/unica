from rest_framework import serializers
from jsonschema import validate, ValidationError as JSONSchemaValidationError
from db.models.task import TaskCollection, Task
from api.schemas.task import PROPERTY_SCHEMA

class TaskCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollection
        fields = ['global_properties']

    def validate_global_properties(self, value):
        for prop in value:
            try:
                validate(instance=prop, schema=PROPERTY_SCHEMA)
            except JSONSchemaValidationError as e:
                raise serializers.ValidationError(f"Invalid global property definition: {e.message}")
        return value


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'local_id', 'created_at', 'updated_at', 'archived', 'deleted', 'global_properties', 'local_properties']
        read_only_fields = ['id', 'local_id', 'created_at', 'updated_at', 'deleted']


