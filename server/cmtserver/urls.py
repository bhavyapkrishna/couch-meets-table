from django.urls import path
from .views import RegisterView, get_current_user_profile, get_matches_users, get_matches
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_current_user_profile, name='get_profile'),
    path('get_matches/', get_matches, name='get_matches'),
    path('get_matches_users/', get_matches_users, name='get_matches_users'),
    # path('get_user_results/', get_user_results, name='get_user_results'),
]
