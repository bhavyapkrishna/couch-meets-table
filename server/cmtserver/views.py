from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserScore, CustomUser, UserResults, UserDorm
from django.http import JsonResponse

# Create your views here.

#view for registering user
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#view for getting user data during login
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)

#view for creating authentication for login
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# view that gets the scores
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matches_users(request):
    user = request.user
    scores = UserScore.objects.filter(caseid1=user).order_by("-score")
    matches = []
    for score in scores:
        match_user = score.caseid2
        dorms = UserDorm.objects.filter(userid=match_user.userid).values()
        results = UserResults.objects.filter(userid=match_user.userid).values()


        # print("matched user", results, len(results))

        options = {
            "wakeTime": ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
            "sleepTime": ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
            "noise": ["Silent", "Somewhat quiet", "Average", "Somewhat loud", "Loud"],
            "messiness": ["Neat", "Somewhat neat", "Average", "Somewhat messy", "Messy"],
            "guests": ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"],
            "inRoom": ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"]}

        matches.append({
            'id': match_user.userid,
            'grade': match_user.grade,
            'name': f"{match_user.first_name} {match_user.last_name}",
            'age': match_user.age,
            'major': match_user.major,
            'dorms': [dorm['dorm'] for dorm in dorms],
            'bio': match_user.bio,
            'matchPercentage': score.score,
            'wakeup': options["wakeTime"][results[0]["wakeTime"]-1],
            'sleepTime': options["sleepTime"][results[0]["sleepTime"]-1],
            'noise': options["noise"][results[0]["noise"]-1],
            'messiness': options["messiness"][results[0]["messiness"]-1],
            'guests': options["guests"][results[0]["guests"]-1],
            'inRoom': options["inRoom"][results[0]["inRoom"]-1],
        })

    return Response(matches)

#view that gets all matches of logged in user (can change to top)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matches(request):
    user = request.user

    scores = UserScore.objects.filter(caseid1=user).order_by('-score')

    # print(f"Found {scores.count()} scores for user {user.caseid}")  # Add logging to see the results

    matches = []
    for score in scores:
        match_user = score.caseid2
        dorms = UserDorm.objects.filter(userid=match_user.userid).values()
        results = UserResults.objects.filter(userid=match_user.userid).values()


        # print("matched user", results, len(results))

        options = {
            "wakeTime": ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
            "sleepTime": ["Early", "Somewhat early", "Average", "Somewhat late", "Late"],
            "noise": ["Silent", "Somewhat quiet", "Average", "Somewhat loud", "Loud"],
            "messiness": ["Neat", "Somewhat neat", "Average", "Somewhat messy", "Messy"],
            "guests": ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"],
            "inRoom": ["Rarely", "Somewhat rarely", "Sometimes", "Somewhat often", "Often"]}

        matches.append({
            'id': match_user.userid,
            'grade': match_user.grade,
            'name': f"{match_user.first_name} {match_user.last_name}",
            'age': match_user.age,
            'major': match_user.major,
            'dorms': [dorm['dorm'] for dorm in dorms],
            'bio': match_user.bio,
            'matchPercentage': score.score,
            'wakeup': options["wakeTime"][results[0]["wakeTime"]-1],
            'sleepTime': options["sleepTime"][results[0]["sleepTime"]-1],
            'noise': options["noise"][results[0]["noise"]-1],
            'messiness': options["messiness"][results[0]["messiness"]-1],
            'guests': options["guests"][results[0]["guests"]-1],
            'inRoom': options["inRoom"][results[0]["inRoom"]-1],
        })

        #reverse_score = UserScore.objects.filter(caseid1=match_user, caseid2=user, swiped=True).first()
        # print(f"Match found for {user.caseid} with {match_user.caseid}: {score.score}")

        #if reverse_score:
        # matches.append({
        #         'id': match_user.userid,
        #         'name': f"{match_user.first_name} {match_user.last_name}",
        #         'age': match_user.age,
        #         'major': match_user.major,
        #         'dorms': [dorm['dorm'] for dorm in dorms],
        #         'bio': match_user.bio,
        #         'matchPercentage': score.score,
        # })

    return Response(matches)