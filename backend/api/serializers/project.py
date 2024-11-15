from rest_framework import serializers
from db.project import Project
from db.organization import Organization

class ProjectSerializer(serializers.ModelSerializer):
    owner_type = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at', 'owner_type', 'owner']

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
    
  
class ProjectCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at', 'owner_type', 'owner_id']
        read_only_fields = ['id']