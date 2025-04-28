from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserScore, CustomUser, UserResults
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
def get_matches(request):
    user_caseid = request.GET.get('caseid')

    if not user_caseid:
        return JsonResponse({"error": "caseid parameter required"}, status=400)

    try:
        user = CustomUser.objects.get(caseid=user_caseid)  # 🔥
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    matches = UserScore.objects.filter(caseid1=user)  # 🔥

    profiles = []
    for match in matches:
        try:
            matched_user = CustomUser.objects.get(caseid=match.caseid2.caseid)  # 🔥 careful here
            profile_data = {
                "caseid": matched_user.caseid,
                "first_name": matched_user.first_name,
                "last_name": matched_user.last_name,
                "age": matched_user.age,
                "grade": matched_user.grade,
                "major": matched_user.major,
                "bio": matched_user.bio,
                "score": match.score,
            }
            profiles.append(profile_data)
        except CustomUser.DoesNotExist:
            continue

    return JsonResponse(profiles, safe=False)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_results(request):
#     user_caseid = request.GET.get('caseid')
#
#     if not user_caseid:
#         return JsonResponse({"error": "caseid parameter required"}, status=400)
#
#     try:
#         result = UserResults.objects.get(userID=user_caseid)
#         data = {
#             "wakeTime": result.wakeTime,
#             "sleepTime": result.sleepTime,
#             "noise": result.noise,
#             "messiness": result.messiness,
#             "guests": result.guests,
#             "inRoom": result.inRoom,
#         }
#         return JsonResponse(data)
#     except UserResults.DoesNotExist:
#         return JsonResponse({"error": "No results found"}, status=404)


#view that gets all matches of logged in user (can change to top)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matches(request):
    user = request.user

    scores = UserScore.objects.filter(caseid1=user).order_by('-score')

    matches = []
    for score in scores:
        match_user = score.caseid2

        #reverse_score = UserScore.objects.filter(caseid1=match_user, caseid2=user, swiped=True).first()

        #if reverse_score:
        matches.append({
                'id': match_user.userid,
                'name': f"{match_user.first_name} {match_user.last_name}",
                'age': match_user.age,
                'major': match_user.major,
                # 'dorms': [dorm.dorm for dorm in match_user.userdorm_set.all()],
                'bio': match_user.bio,
                'matchPercentage': score.score,
        })

    return Response(matches)