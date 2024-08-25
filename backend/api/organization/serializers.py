from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Organization, Membership
from api.project.models import Project
from api.user.serializers import UserBasicInfoSerializer

class MembershipSerializer(serializers.ModelSerializer):
    user = UserBasicInfoSerializer()

    class Meta:
        model = Membership
        fields = ['user', 'role', 'joined_at']


class OrganizationSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()  # All members, include owner
    owner_count = serializers.SerializerMethodField()
    project_count = serializers.SerializerMethodField()
    is_discussion_enabled = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at', 'role', 'member_count', 'owner_count', 'project_count', 'is_discussion_enabled']
        read_only_fields = ['id']

    def get_role(self, obj):
        user = self.context['request'].user
        membership = Membership.objects.filter(user=user, organization=obj).first()
        return membership.role if membership else None
    
    def get_member_count(self, obj):
        return Membership.objects.filter(organization=obj).exclude(role=Membership.PENDING).count()
    
    def get_owner_count(self, obj):
        return Membership.objects.filter(organization=obj, role=Membership.OWNER).count()
    
    def get_project_count(self, obj):
        return Project.objects.filter(owner_type=ContentType.objects.get_for_model(Organization), owner_id=obj.id).count()
    
    def get_is_discussion_enabled(self, obj):
        return hasattr(obj, "discussion")


class OrganizationCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id']

    # def validate(self, data):
    #     display_name = data.get('display_name')
    #     if not display_name:
    #         raise serializers.ValidationError("Name is required.")
    #     if len(display_name) > 20:
    #         raise serializers.ValidationError("Name cannot be longer than 20 characters.")
    #     description = data.get('description', '')
    #     if len(description) > 200:
    #         raise serializers.ValidationError("Description cannot be longer than 200 characters.")
        
    #     return data