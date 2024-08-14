from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

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
        fields = ['discussion', 'title', 'category_id', 'local_id', 'deleted', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        depth = 1

    def validate(self, data):
        if not any(cat['id'] == data['category_id'] for cat in data['discussion'].categories):
            raise serializers.ValidationError("Invalid category_id.")
        return data


class DiscussionCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionComment
        fields = ['id', 'user', 'topic', 'content', 'created_at', 'updated_at']
