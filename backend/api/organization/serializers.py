from rest_framework import serializers
from .models import Organization, Membership

class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = ['user', 'role', 'joined_at']

    def get_user(self, obj):
        user = obj.user
        return {
            'email': user.email,
            'display_name': user.display_name,
        }


class OrganizationSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()  # All members, include owner
    owner_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at', 'role', 'member_count', 'owner_count']
        read_only_fields = ['id']

    def get_role(self, obj):
        user = self.context['request'].user
        membership = Membership.objects.filter(user=user, organization=obj).first()
        return membership.role if membership else None
    
    def get_member_count(self, obj):
        return Membership.objects.filter(organization=obj).count()
    
    def get_owner_count(self, obj):
        return Membership.objects.filter(organization=obj, role=Membership.OWNER).count()


class OrganizationCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id']

    def validate(self, data):
        display_name = data.get('display_name')
        if not display_name:
            raise serializers.ValidationError("Name is required.")
        if len(display_name) > 20:
            raise serializers.ValidationError("Name cannot be longer than 20 characters.")
        description = data.get('description', '')
        if len(description) > 200:
            raise serializers.ValidationError("Description cannot be longer than 200 characters.")
        
        return data