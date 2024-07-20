from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import mmh3

User = get_user_model()

class Organization(models.Model):
    id = models.BigIntegerField(primary_key=True, editable=False, unique=True) # hash id
    display_name = models.CharField(max_length=20)
    description = models.CharField(blank=True, max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    members = models.ManyToManyField(User, through='Membership', related_name='organizations')

    def save(self, *args, **kwargs):
        # Generate id if not set
        if self.pk is None:
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S%f')
            self.id = mmh3.hash(str(self.display_name + timestamp), signed=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name

class Membership(models.Model):
    OWNER = 'Owner'
    MEMBER = 'Member'
    ROLE_CHOICES = [
        (OWNER, 'Owner'),
        (MEMBER, 'Member'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'organization')

    def __str__(self):
        return f"{self.user.username} - {self.organization.display_name} ({self.role})"

    def is_owner(self):
        return self.role == self.OWNER

    def is_member(self):
        return self.role == self.MEMBER