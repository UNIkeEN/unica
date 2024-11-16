from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from db.models.abstract import AbstractComment
from db.models.organization import Organization


class Discussion(models.Model):
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='discussion')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Discussions of {self.organization.display_name}"
    

class DiscussionCategory(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=20)
    emoji = models.CharField(max_length=2, blank=True, null=True)
    color = models.CharField(max_length=7, default="gray")
    description = models.TextField(max_length=200, blank=True, null=True)

    class Meta:
        unique_together = ('discussion', 'name', 'color')

    def __str__(self):
        return f"{self.name}"
    

class DiscussionTopic(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=40)
    category = models.ForeignKey(DiscussionCategory, on_delete=models.SET_NULL, related_name='topics', null=True, blank=True)
    local_id = models.IntegerField(editable=False)  # local id, in the same discussion(organization) scope
    deleted = models.BooleanField(default=False) # soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('discussion', 'local_id')
    
    def save(self, *args, **kwargs):
        if self.category and self.category.discussion != self.discussion:
            raise ValidationError("The category does not belong to the same discussion.")
        
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
    local_id = models.IntegerField(editable=False)  # local id, in the same topic scope
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False) # soft delete

    def save(self, *args, **kwargs):
        with transaction.atomic():
            self.edited = True
            if not self.local_id:
                max_local_id = DiscussionComment.objects.filter(
                    topic=self.topic
                ).select_for_update().aggregate(models.Max('local_id'))['local_id__max']

                if max_local_id is not None:
                    self.local_id = max_local_id + 1  # Generate local_id at max+1
                else:
                    self.local_id = 1
                self.edited = False # no local_id regarded as creation(no edited)

                self.topic.updated_at = timezone.now()
                self.topic.save()
            super().save(*args, **kwargs)
                

    def delete(self):
        self.deleted = True
        self.save()

    def __str__(self):
        return f"Comment by {self.user.username} on {self.topic.title}"