from django.contrib import admin
from .models import Tags, Types, Cuisines
# Register your models here.

admin.site.register(Tags)
admin.site.register(Types)
admin.site.register(Cuisines)
