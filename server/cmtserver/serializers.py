from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only for security

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'caseid', 'age', 'grade', 'major', 'bio', 'password']

    def create(self, validated_data):
        # Create and save the user using Django's built-in password hashing
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            caseid=validated_data.get('caseid', ''),
            age=validated_data.get('age', None),
            grade=validated_data.get('grade', ''),
            major=validated_data.get('major', ''),
            bio=validated_data.get('bio', ''),
            password=validated_data['password'],  # This will hash the password automatically
        )
        return user
