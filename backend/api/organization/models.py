from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

class Organization(models.Model):
    display_name = models.CharField(max_length=100)
    name = models.CharField(unique=True, max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    members = models.ManyToManyField(User, through='Membership', related_name='organizations')

    def __str__(self):
        return self.display_name

class Membership(models.Model):
    OWNER = 'owner'
    MEMBER = 'member'
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