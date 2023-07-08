from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


from .managers import CustomUserManager

AUTH_PROVIDERS = {'google': 'google', 'email': 'email'}


class CustomUser(AbstractUser):

    ADMIN = 1
    MANAGER = 2
    USER = 3

    ROLE_CHOICES = (
        (ADMIN, 'admin'),
        (MANAGER, 'manager'),
        (USER, 'user')
    )

    username = None
    email = models.EmailField(_('email address'), unique=True)
    user_profile_image = models.ImageField(
        upload_to="profile", blank=True, default="")
    city = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    role = models.PositiveSmallIntegerField(
        choices=ROLE_CHOICES, blank=True, null=True, default=3)
    date_joined = models.DateTimeField(auto_now_add=True)
    image_url = models.CharField(max_length=255, blank=True, null=True,
                                 default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyUAB_Hbdz5YjruXOXnXEOH5HlUE1mSupuT8hVfRd0gA&s")
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=timezone.now)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
