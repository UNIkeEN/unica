from magic import Magic
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import UserFile

def strict_type_check(file, allowed_types):
    mime = Magic(mime=True)
    file_mime_type = mime.from_buffer(file.read(1024))
    file.seek(0)

    return file_mime_type in allowed_types

class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ['user', 'file']

    def __init__(self, *args, **kwargs):
        self.max_size = kwargs.pop('max_size', None)
        self.allowed_types = kwargs.pop('allowed_types', None)
        self.use_strict_type_check = kwargs.pop('use_strict_type_check', False)
        super().__init__(*args, **kwargs)

    def validate_file(self, value):
        # validate size
        if self.max_size and value.size > self.max_size:
            raise ValidationError("File size exceeds the maximum limit.")

        # validate type
        if self.allowed_types:
            if value.content_type not in self.allowed_types:
                raise ValidationError("File type is not allowed.")
            if self.use_strict_type_check and not strict_type_check(value, self.allowed_types):
                raise ValidationError("File type is not allowed.")

        return value
    
    def create(self, validated_data):
        # TBD
        pass 