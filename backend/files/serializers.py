import hashlib
import time
from dataclasses import dataclass
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import FileSystemStorage
from rest_framework import serializers
from typing import Optional, List, Callable
import os
from unica.settings import MEDIA_ROOT

import platform
if platform.system() == 'Darwin':
    import pylibmagic
import magic

from db.models.userfile import UserFile

def strict_type_check(file: UploadedFile, allowed_types: List[str]) -> bool:
    mime = magic.Magic(mime=True)
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
            file_name = self.cfg.target_name + '.' + file.name.split('.')[-1]
        else:
            file_name = hashlib.md5((file.name + str(time.time())).encode()).hexdigest() + '.' + file.name.split('.')[-1]
        
        self.cfg.target_dir = os.path.join(MEDIA_ROOT, self.cfg.target_dir)

        fs = FileSystemStorage(location=self.cfg.target_dir)
        if fs.exists(file_name):
            fs.delete(file_name)
        fs.save(file_name, file)
        relative_file_path = os.path.join(self.cfg.target_dir, file_name)
        user_file = UserFile.objects.create(user=user, file=relative_file_path)


        return user_file