from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, UserProfileSerializer

# Create your views here.

#view for registering user
class RegisterView(APIView):
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