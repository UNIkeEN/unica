from rest_framework import serializers
from jsonschema import validate, ValidationError as JSONSchemaValidationError
from .models import Board
from .schemas import PROPERTY_SCHEMA

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'

    def validate_global_properties(self, value):
        for prop in value:
            try:
                validate(instance=prop, schema=PROPERTY_SCHEMA)
            except JSONSchemaValidationError as e:
                raise serializers.ValidationError(f"Invalid global property definition: {e.message}")
        return value
