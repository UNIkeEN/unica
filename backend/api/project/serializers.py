from rest_framework import serializers
from .models import Project
from ..organization.models import Organization

class ProjectSerializer(serializers.ModelSerializer):
    owner_type = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at', 'owner_type', 'owner','owner_id']
        read_only_fields = ['id','created_at', 'updated_at', 'owner_type', 'owner','owner_id']

    def get_owner_type(self, obj):
        if obj.is_user_project():
            return 'User'
        elif obj.is_organization_project():
            return 'Organization'
        return None

    def get_owner(self, obj):
        if obj.is_organization_project():
            organization = Organization.objects.get(id=obj.owner_id)
            return {
                'id': organization.id,
                'display_name': organization.display_name
            }
        return None
    
  
