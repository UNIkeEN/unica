from django.db import models
from django.utils import timezone
from api.models import AbstractComment
from api.organization.models import Organization


class Discussion(models.Model):
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='discussion')
    created_at = models.DateTimeField(auto_now_add=True)
    categories = models.JSONField(default=list)  # [{id, name, color},...]

    def __str__(self):
        return f"Discussions of {self.organization.display_name}"
    

class DiscussionTopic(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=100)
    category_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Validate category_id exists
        if not any(cat['id'] == self.category_id for cat in self.discussion.categories):
            raise ValueError("Invalid category_id.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

class DiscussionComment(AbstractComment):
    topic = models.ForeignKey(DiscussionTopic, on_delete=models.CASCADE, related_name='comments')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the parent topic's updated_at field
        self.topic.updated_at = timezone.now()
        self.topic.save()

    def __str__(self):
        return f"Comment by {self.user.username} on {self.topic.title}"