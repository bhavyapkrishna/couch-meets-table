from django.urls import path
from .views import RegisterView, get_current_user_profile, get_matchesUsers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_current_user_profile, name='get_profile'),
    path('get_matchesUsers/', get_matchesUsers, name='get_matchesUsers'),
    # path('get_user_results/', get_user_results, name='get_user_results'),
]
