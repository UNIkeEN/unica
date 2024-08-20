from django.db import models, transaction
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
    title = models.CharField(max_length=40)
    category_id = models.IntegerField()
    local_id = models.IntegerField(editable=False)  # local id, in the same discussion(organization) scope
    deleted = models.BooleanField(default=False) # soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('discussion', 'local_id')
    
    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.local_id:
                max_local_id = DiscussionTopic.objects.filter(
                    discussion=self.discussion
                ).select_for_update().aggregate(models.Max('local_id'))['local_id__max']

                if max_local_id is not None:
                    self.local_id = max_local_id + 1 # Generate local_id at max+1
                else:
                    self.local_id = 1
            super().save(*args, **kwargs)

    def delete(self):
        self.deleted = True
        self.save()

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