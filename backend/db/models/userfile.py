from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    file = models.FileField(upload_to='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.file}"
