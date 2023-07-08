from django.contrib.auth import authenticate
from base.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
from rest_framework.exceptions import AuthenticationFailed
import os


def register_social_user(provider, user_id, email, name, image):
    filtered_user_by_email = CustomUser.objects.filter(email=email)

    if filtered_user_by_email.exists():

        if provider == filtered_user_by_email[0].auth_provider:

            user = authenticate(
                email=email, password=os.environ.get("GOOGLE_SECRET"))
            refresh = RefreshToken.for_user(user)

            update_last_login(None, user)
            print(user)
            return {

                'email': user.email,
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

        else:
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        user = {

            'email': email,
            'password': os.environ.get("GOOGLE_SECRET"),
            "first_name": name,
            "image_url": image


        }
        user = CustomUser.objects.create_user(**user)
        user.is_verified = True
        user.auth_provider = provider
        user.save()
        refresh = RefreshToken.for_user(user)

        new_user = authenticate(
            email=email, password=os.environ.get("GOOGLE_SECRET"))
        print(new_user)
        return {
            'email': new_user.email,
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
