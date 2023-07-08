from django.urls import path, include
from . import views
from .views import MyTokenObtainPairView, RegisterAPIView, CurrentUserView, ChangePasswordView, UserLoginView, ManagerRegisterAPIView, ManagerLoginView, AdminLoginView, getManagers, getManagersById


from rest_framework_simplejwt.views import (
    TokenObtainPairView,         # Using Custom function/model
    TokenRefreshView,
)
urlpatterns = [
    path("", views.getRoutes),

    # Users
    path("users/<str:email>/", views.getUsersById),
    path("users/", views.getUsers),
    path("users/me", CurrentUserView.as_view()),

    # Auth
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterAPIView.as_view()),
    path('login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # Admin
    path("admin/login", AdminLoginView.as_view()),

    # Managers
    path("managers/", getManagers),
    path('managers/register/', ManagerRegisterAPIView.as_view()),
    path('managers/login/', ManagerLoginView.as_view(), name='manager-login'),
    path("managers/<str:email>/", getManagersById),

    # Routers to other Apps
    path('restaurant/', include("restaurant.urls")),
    path('mod/', include("moderator.urls")),
    path('social/', include("social_auth.urls")),

]
