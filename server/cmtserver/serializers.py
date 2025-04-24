from rest_framework import serializers
from .models import CustomUser, UserDorm, UserResults, UserIdeal, UserImportant
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class UserResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResults
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']
        extra_kwargs = {
            'userID': {'write_only': True}
        }

class UserIdealSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserIdeal
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']
        extra_kwargs = {
            'userID': {'write_only': True}
        }

class UserImportantSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImportant
        fields = ['wakeTime', 'sleepTime', 'noise', 'messiness', 'guests', 'inRoom']
        extra_kwargs = {
            'userID': {'write_only': True}
        }

class UserDormSerializer(serializers.ModelSerializer):
    model = UserDorm
    fields = ['dorm']
    extra_kwargs = {
            'userID': {'write_only': True}
    }

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

        UserResults.objects.create(userid=user, **results)
        UserIdeal.objects.create(userid=user, **preferences)
        UserImportant.objects.create(userid=user, **important)

        for dorm in dorms:
            UserDorm.objects.create(userid=user, dorm=dorm)

        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField()
    preferences = serializers.SerializerMethodField()
    important = serializers.SerializerMethodField()
    dorms = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'caseid', 'age', 'grade', 'major', 'bio', 'results', 'preferences', 'important', 'dorms']

    def get_results(self, obj):
        try:
            return UserResultsSerializer(UserResults.objects.get(userid=obj)).data
        except UserResults.DoesNotExist:
            return None

    def get_preferences(self, obj):
        try:
            return UserIdealSerializer(UserIdeal.objects.get(userid=obj)).data
        except UserIdeal.DoesNotExist:
            return None

    def get_important(self, obj):
        try:
            return UserImportantSerializer(UserImportant.objects.get(userid=obj)).data
        except UserImportant.DoesNotExist:
            return None

    def get_dorms(self, obj):
        dorms = UserDorm.objects.filter(userid=obj)
        return [d.dorm for d in dorms]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)
