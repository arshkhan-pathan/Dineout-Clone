from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from restaurant.delete_bookings import start_booking_cleanup_thread

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("base.api.urls")),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

start_booking_cleanup_thread()
