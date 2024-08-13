from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'biography']
        read_only_fields = ['id', 'email']

    def validate(self, data):
        display_name = data.get('display_name')
        if not display_name:
            raise serializers.ValidationError("Name is required.")
        if len(display_name) > 20:
            raise serializers.ValidationError("Name cannot be longer than 20 characters.")
        biography = data.get('biography', '')
        if len(biography) > 200:
            raise serializers.ValidationError("Biograph cannot be longer than 200 characters.")

        return data