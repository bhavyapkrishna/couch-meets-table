from django.urls import path
from .views import RegisterView, UploadProfilePhotoView, get_current_user_profile, logout, update_user_profile
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_current_user_profile, name='get_profile'),
    path('logout/', logout, name='logout'),
    path('upload_photo/', UploadProfilePhotoView.as_view(), name='upload_profile_photo'),
    path('update/', update_user_profile, name='update_profile')
]