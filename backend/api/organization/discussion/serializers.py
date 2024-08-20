from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.db import models
from .models import Discussion, DiscussionTopic, DiscussionComment



class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ['organization', 'created_at', 'categories']
        read_only_fields = ['created_at']
        depth = 1


class DiscussionTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionTopic
        fields = ['id', 'title', 'category_id', 'local_id', 'deleted', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        depth = 1

    def validate(self, data):
        # Ensure that 'discussion' is in the context
        discussion = self.context.get('discussion')
        if not discussion:
            raise serializers.ValidationError("Discussion is required.")
        if data['category_id'] == 0:
           return data
        if not any(cat['id'] == data['category_id'] for cat in data['discussion'].categories):
            raise serializers.ValidationError("Invalid category_id.")
        return data

    def create(self, validated_data):
        discussion = self.context['discussion']
        # max_local_id = DiscussionTopic.objects.filter(
        #     discussion=discussion
        # ).aggregate(models.Max('local_id'))['local_id__max']
        # local_id = (max_local_id + 1) if max_local_id else 1

        return DiscussionTopic.objects.create(
            discussion=discussion,
            # local_id=local_id,
            **validated_data
        )


class DiscussionCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionComment
        fields = ['id', 'user', 'topic', 'content', 'created_at', 'updated_at']
