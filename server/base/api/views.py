from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer, UserUpdateSerializer, ManagerLoginSerializer, ManagerRegisterSerializer, ManagerSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from restaurant.utils import create_notification
User = get_user_model()

'''
Routtes List
'''


@api_view(['GET'])
def getRoutes(request):
    routes = [
        "api/users/",
        "api/users/me",
        "api/login/",
        'api/token/',
        'api/login/',
        'api/token/refresh/',
        'api/change-password/'
        "api/managers/"
        'api/managers/register/',
        'api/managers/login/',
        "api/managers/<str:email>/"
        "api/admin/login"






    ]
    return Response(routes)


'''
User Registeration
'''


class RegisterAPIView(APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': str(user.role),
                    'first_name': user.first_name,
                    "image": user.image_url
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
User Login
'''


class UserLoginView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny, )
    authentication_classes = []

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=False)
        status_code = status.HTTP_401_UNAUTHORIZED
        response = {
            'success': False,
            'statusCode': status_code,
            'errors': "Invalid Credentials"
        }

        if valid:
            if serializer.data['role'] == "3":
                status_code = status.HTTP_200_OK

                response = {
                    'success': True,
                    'statusCode': status_code,
                    'access': serializer.data['access'],
                    'refresh': serializer.data['refresh'],
                    'user': {
                        'id': serializer.data['id'],
                        'email': serializer.data['email'],
                        'role': serializer.data['role'],
                        'first_name': serializer.data['first_name'],
                        "image": serializer.data["image_url"]
                    }
                }

        return Response(response, status=status_code)


'''
Get all Users
'''


@api_view(['GET'])
def getUsers(requests):
    User = get_user_model()
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


'''
Get Users By Email
'''


@api_view(['GET'])
def getUsersById(requests, email):
    Users = get_user_model()
    user = Users.objects.all().filter(email=email).first()
    if user is None:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


'''
User Login/Token Generation // ReadyMade
'''


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Manager Register
class ManagerRegisterAPIView(APIView):
    serializer_class = ManagerRegisterSerializer
    authentication_classes = []

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            create_notification(user, "Welcome to Dineout",
                                "Hello , Please Navigate to Manage to add restaurant Details and Head back to tables section to get started", 3)
            refresh = RefreshToken.for_user(user)

            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    "role": user.role

                },
                "status": status.HTTP_201_CREATED
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
Manager Login
'''


class ManagerLoginView(APIView):
    serializer_class = ManagerLoginSerializer
    authentication_classes = []

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=False)
        user = User.objects.filter(email=serializer.data['email']).first()

        if user and valid:
            # Get the user's role
            role = user.role  # Assuming the User model has a 'role' field

            if role == 2:
                status_code = status.HTTP_200_OK
                response = {
                    'success': True,
                    'statusCode': status_code,
                    'access': serializer.data['access'],
                    'refresh': serializer.data['refresh'],
                    'user': {
                        "id": user.id,
                        'email': serializer.data['email'],
                        'role': role,
                        'first_name': serializer.data['first_name']

                    }
                }
                return Response(response, status=status_code)

            # User has a different role
            status_code = status.HTTP_406_NOT_ACCEPTABLE
            response = {
                'success': False,
                'statusCode': status_code,
                'errors': "Invalid User Role"
            }
            return Response(response, status=status_code)

        # Invalid credentials or validation failed
        status_code = status.HTTP_401_UNAUTHORIZED
        response = {
            'success': False,
            'statusCode': status_code,
            'errors': "Invalid Credentials "
        }
        return Response(response, status=status_code)


'''
Get all Manager
'''


@api_view(['GET'])
def getManagers(requests):
    User = get_user_model()
    users = User.objects.filter(role=2)
    serializer = ManagerSerializer(users, many=True)
    return Response(serializer.data)


'''
Get Users By Email
'''


@api_view(['GET'])
def getManagersById(requests, email):
    Users = get_user_model()
    user = Users.objects.all().filter(email=email).first()
    if user is None:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ManagerSerializer(user, many=False)
    return Response(serializer.data)


# Get User Profile

# Admin Authentication
class AdminLoginView(APIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny, )
    authentication_classes = []

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        valid = serializer.is_valid(raise_exception=False)
        status_code = status.HTTP_401_UNAUTHORIZED
        response = {
            'success': False,
            'statusCode': status_code,
            'errors': "Invalid Credentials"
        }

        if valid:
            if serializer.data['role'] == "1":
                status_code = status.HTTP_200_OK

                response = {
                    'success': True,
                    'statusCode': status_code,
                    'access': serializer.data['access'],
                    'refresh': serializer.data['refresh'],
                    'user': {
                        'id': serializer.data['id'],
                        'email': serializer.data['email'],
                        'role': serializer.data['role'],
                        'first_name': serializer.data['first_name'],
                        "image": serializer.data["image_url"]
                    }
                }

        return Response(response, status=status_code)


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Current User


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
