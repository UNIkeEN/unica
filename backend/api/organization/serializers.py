from rest_framework import serializers
from slugify import slugify
from .models import Organization, Membership


class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Membership
        fields = ['user', 'role', 'joined_at']


class OrganizationSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()  # All members, include owner
    owner_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'name', 'slug', 'created_at', 'updated_at', 'role', 'member_count', 'owner_count']

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
        fields = ['id', 'display_name', 'name', 'slug', 'created_at', 'updated_at']

    def validate(self, data):
        name = data.get('name')
        if not name:
            raise serializers.ValidationError("Name is required.")
        if len(name) > 100:
            raise serializers.ValidationError("Name cannot be longer than 100 characters.")
        slug = slugify(name)
        if not slug:
            raise serializers.ValidationError("Invalid name.")
        if Organization.objects.filter(name=name).exists():
            raise serializers.ValidationError("Name is already in use.")
        if Organization.objects.filter(slug=slug).exists():
            raise serializers.ValidationError("Slug is already in use.")
        data['slug'] = slug
        data['display_name'] = name
        return data