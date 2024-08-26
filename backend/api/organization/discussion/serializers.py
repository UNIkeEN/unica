from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.db import models
from .models import Discussion, DiscussionTopic, DiscussionComment
from api.user.serializers import UserBasicInfoSerializer


class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ['organization', 'created_at', 'categories']
        read_only_fields = ['created_at']
        depth = 1


class DiscussionTopicSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    class Meta:
        model = DiscussionTopic
        fields = ['id', 'title', 'category_id', 'local_id', 'deleted', 'created_at', 'updated_at', 'user']
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

    def get_user(self, obj):
        earliest_comment = obj.comments.order_by('created_at').first()
        if earliest_comment:
            return UserBasicInfoSerializer(earliest_comment.user).data
        return None


class DiscussionCommentSerializer(serializers.ModelSerializer):
    user = UserBasicInfoSerializer()
    class Meta:
        model = DiscussionComment
        fields = ['id', 'user', 'topic', 'content', 'created_at', 'updated_at', 'local_id', 'edited']

class DiscussionCommentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionComment
        fields = ['content','local_id']
        read_only_fields = ['local_id']

class DiscussionTopicCreationSerializer(serializers.ModelSerializer):
    comment = DiscussionCommentCreationSerializer(required=False)

    class Meta:
        model = DiscussionTopic
        fields = ['title', 'category_id', 'comment', 'local_id']

    def validate(self, data):
        discussion = self.context.get('discussion')
        if not discussion:
            raise serializers.ValidationError("Discussion is required.")
        if data['category_id'] == 0:
           return data
        if not any(cat['id'] == data['category_id'] for cat in discussion.categories):
            raise serializers.ValidationError("Invalid category_id.")
        return data

    def create(self, validated_data):
        discussion = self.context['discussion']
        comment_data = validated_data.pop('comment', None)
        topic = DiscussionTopic.objects.create(
            discussion=discussion,
            **validated_data
        )
        if comment_data:
            DiscussionComment.objects.create(
                topic=topic,
                user=self.context['request'].user,
                **comment_data
            )

        return topic
