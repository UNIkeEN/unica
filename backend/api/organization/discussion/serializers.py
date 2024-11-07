from rest_framework import serializers
from .models import Discussion, DiscussionTopic, DiscussionComment, DiscussionCategory
from api.user.serializers import UserBasicInfoSerializer


class DiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussion
        fields = ['organization', 'created_at', 'categories']
        read_only_fields = ['created_at']
        depth = 1
    

class DiscussionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionCategory
        fields = ['id', 'name', 'emoji', 'color', 'description']
        read_only_fields = ['id']


class DiscussionCommentSerializer(serializers.ModelSerializer):
    user = UserBasicInfoSerializer(read_only=True)

    class Meta:
        model = DiscussionComment
        fields = ['id', 'user', 'topic', 'content', 'created_at', 'updated_at', 'local_id', 'edited']
        read_only_fields = ['id', 'user', 'topic', 'created_at', 'updated_at', 'local_id', 'edited']


class DiscussionTopicSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    category = DiscussionCategorySerializer(read_only=True)
    comment = DiscussionCommentSerializer(write_only=True, required=False)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=DiscussionCategory.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = DiscussionTopic
        fields = [
            'id', 'title', 'category', 'category_id', 'local_id', 'deleted',
            'created_at', 'updated_at', 'user', 'comment'
        ]
        read_only_fields = [
            'id', 'category', 'local_id', 'deleted', 'created_at', 'updated_at', 'comment'
        ]
        depth = 1

    def validate(self, data):
        # Ensure that 'discussion' is in the context
        discussion = self.context.get('discussion')
        if not discussion:
            raise serializers.ValidationError("Discussion is required.")

        category_id = data.get('category_id')
        if category_id:
            try:
                category = DiscussionCategory.objects.get(id=category_id, discussion=discussion)
                data['category'] = category
            except DiscussionCategory.DoesNotExist:
                raise serializers.ValidationError("The category does not belong to the same discussion or does not exist.")

        return data

    def get_user(self, obj):
        earliest_comment = obj.comments.order_by('created_at').first()
        if earliest_comment:
            return UserBasicInfoSerializer(earliest_comment.user).data
        return None

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


# class DiscussionCommentCreationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DiscussionComment
#         fields = ['content','local_id']
#         read_only_fields = ['local_id']


# class DiscussionTopicCreationSerializer(serializers.ModelSerializer):
#     comment = DiscussionCommentSerializer(required=False)
#     category = serializers.PrimaryKeyRelatedField(queryset=DiscussionCategory.objects.all(), required=False, allow_null=True)

#     class Meta:
#         model = DiscussionTopic
#         fields = ['title', 'category', 'comment', 'local_id']

#     def validate(self, data):
#         discussion = self.context.get('discussion')
#         if not discussion:
#             raise serializers.ValidationError("Discussion is required.")

#         if data.get('category') is None:
#             data['category'] = None
#         else:
#             category = data['category']
#             if category.discussion != discussion:
#                 raise serializers.ValidationError("The category does not belong to the same discussion.")

#         return data


#     def create(self, validated_data):
#         discussion = self.context['discussion']
#         comment_data = validated_data.pop('comment', None)
#         topic = DiscussionTopic.objects.create(
#             discussion=discussion,
#             **validated_data
#         )
#         if comment_data:
#             DiscussionComment.objects.create(
#                 topic=topic,
#                 user=self.context['request'].user,
#                 **comment_data
#             )
#         return topic
