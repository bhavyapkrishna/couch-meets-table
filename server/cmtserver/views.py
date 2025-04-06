from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import CustomUserSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the user directly using the serializer
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
