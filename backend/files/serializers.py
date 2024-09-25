import hashlib
import time
from dataclasses import dataclass
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import FileSystemStorage
from magic import Magic
from rest_framework import serializers
from typing import Optional, List, Callable
from .models import UserFile

def strict_type_check(file: UploadedFile, allowed_types: List[str]) -> bool:
    mime = Magic(mime=True)
    file_mime_type = mime.from_buffer(file.read(1024))
    file.seek(0)

    return file_mime_type in allowed_types


@dataclass
class UserFileSerializerConfig:
    # save location
    target_dir: str = ''
    target_name: Optional[str] = None

    # validate and preprocess
    max_size: Optional[int] = None
    allowed_types: Optional[List[str]] = None
    strict_check: Optional[bool] = True
    preprocess: Optional[Callable[[UploadedFile], UploadedFile]] = None


class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ['user', 'file']

    def __init__(self, *args, cfg: UserFileSerializerConfig, **kwargs):
        self.cfg = cfg
        super().__init__(*args, **kwargs)

    def validate_file(self, value:UploadedFile):
        # validate size
        if self.cfg.max_size and value.size > self.cfg.max_size:
            raise ValidationError("File size exceeds the maximum limit.")

        # validate type
        if self.cfg.allowed_types:
            if value.content_type not in self.cfg.allowed_types:
                raise ValidationError("File type is not allowed.")
            if self.cfg.strict_check and not strict_type_check(value, self.cfg.allowed_types):
                raise ValidationError("File type is not allowed.")

        return value
    
    def create(self, validated_data):
        user = validated_data['user']
        file = validated_data['file']

        # preprocess
        if self.cfg.preprocess:
            file = self.cfg.preprocess(file)

        if self.cfg.target_name:
            file_name = self.cfg.target_name
        else:
            file_name = hashlib.md5((file.name + str(time.time())).encode()).hexdigest() + '.' + file.name.split('.')[-1]

        fs = FileSystemStorage(location=self.cfg.target_dir)
        saved_file_name = fs.save(file_name, file)
        user_file = UserFile.objects.create(user=user, file=saved_file_name)

        return user_file