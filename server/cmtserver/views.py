from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserScore, CustomUser

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
                'dorms': [dorm.dorm for dorm in match_user.userdorm_set.all()],
                'bio': match_user.bio,
                'matchPercentage': score.score,
        })

    return Response(matches)