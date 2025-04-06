from rest_framework import serializers
from .models import CustomUser, Login

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['caseid', 'email', 'first_name', 'last_name', 'age', 'grade', 'major', 'bio', 'username', 'password']

    def create(self, validated_data):
        #save user info
        user = CustomUser.objects.create_user(
            caseid=validated_data.get('caseid', None),
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            age=validated_data.get('age', None),
            grade=validated_data.get('grade', None),
            major=validated_data.get('major', None),
            bio=validated_data.get('bio', None),
        )

        #save login info
        login = Login.objects.create(
            user=user,
            username=validated_data['email'],  # Use email as the username
        )
        login.set_password(validated_data['password'])  # Hash the password
        login.save()

        return user
