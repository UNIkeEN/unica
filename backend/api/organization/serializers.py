from rest_framework import serializers
from slugify import slugify
from .models import Organization, Membership


class MembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Membership
        fields = ['user', 'role', 'joined_at']


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'display_name', 'name', 'slug', 'created_at', 'updated_at', 'role']

    def get_role(self, obj):
        user = self.context['request'].user
        membership = Membership.objects.filter(user=user, organization=obj).first()
        return membership.role if membership else None


class OrganizationSerializer(serializers.ModelSerializer):
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
        print(f"Name: {name}, Slug: {slug}")
        if Organization.objects.filter(name=name).exists():
            raise serializers.ValidationError("Name is already in use.")
        if Organization.objects.filter(slug=slug).exists():
            raise serializers.ValidationError("Slug is already in use.")
        data['slug'] = slug
        data['display_name'] = name
        return data