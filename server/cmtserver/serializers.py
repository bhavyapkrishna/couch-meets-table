from rest_framework import serializers
from .models import CustomUser, UserDorm, UserResults, UserIdeal, UserImportant

class UserResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResults
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']

class UserIdealSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserIdeal
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']

class UserImportantSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImportant
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']

class UserDormSerializer(serializers.ModelSerializer):
    model = UserDorm
    fields = ['dorm']

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    results = UserResultsSerializer()
    preferences = UserIdealSerializer()
    important = UserImportantSerializer()
    dorms = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'caseid', 'age', 'grade', 'major', 'bio', 'password', 'results', 'preferences', 'important', 'dorms']

    def create(self, validated_data):
        results = validated_data.pop('results')
        preferences = validated_data.pop('preferences')
        important = validated_data.pop('important')
        dorms = validated_data.pop('dorms')

        user = CustomUser.objects.create_user(**validated_data)

        UserResults.objects.create(userID=user, **results)
        UserIdeal.objects.create(userID=user, **preferences)
        UserImportant.objects.create(userID=user, **important)

        for dorm in dorms:
            UserDorm.objects.create(userID=user, dorm=dorm)

        return user