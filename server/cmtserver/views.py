from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserScore, CustomUser, UserResults, UserDorm
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser 
from django.utils.text import get_valid_filename
import os

# Create your views here.

#view for registering user
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#view for uploading user profile photo
class UploadProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('profile_photo')
        if not file_obj:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        filename = get_valid_filename(file_obj.name)
        filename = default_storage.generate_filename(os.path.join(f'uploads/{request.user.caseid}', filename))
        filename = default_storage.save(filename, ContentFile(file_obj.read()))

        file_url = default_storage.url(filename)  
        request.user.profile_photo = file_url
        request.user.save()

        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    scores = UserScore.objects.filter(caseid1=user, swiped=False).order_by("-score")
    matches = []
    for score in scores:
        match_user = score.caseid2
        dorms = UserDorm.objects.filter(userid=match_user.userid).values()
        results = UserResults.objects.filter(userid=match_user.userid).values()
        # print(match_user)


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
            'caseid': match_user.caseid,
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def swipes_right(request):
    user = request.user
    caseid1 = user.caseid
    print("user", user)
    print("case id 1", caseid1)

    data = request.data
    print(request)
    caseid2 = data.get('caseid2')
    # print("caseid2", caseid2)

    if not caseid2:
        return JsonResponse({'error': 'Missing caseid2'}, status=400)

    try:
        match = UserScore.objects.get(caseid1=caseid1, caseid2=caseid2)
        match.swiped = True
        match.save()
        return JsonResponse({'message': 'Swiped status updated successfully'})
    except UserScore.DoesNotExist:
        return JsonResponse({'error': 'Match not found'}, status=404)


#view that gets all matches of logged in user (can change to top)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matches(request):
    user = request.user

    scores = UserScore.objects.filter(caseid1=user, swiped=True).order_by('-score')

    # print(f"Found {scores.count()} scores for user {user.caseid}")  

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
        
        reverse_score = UserScore.objects.filter(caseid1=match_user, caseid2=user, swiped=True).first()
        print("Reverse score", UserScore.objects.filter(caseid1=match_user, caseid2=user))
        
        if reverse_score:
            matches.append({
                'id': match_user.userid,
                'caseid': match_user.caseid,
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

        # print(f"Match found for {user.caseid} with {match_user.caseid}: {score.score}")
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
#view for logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
