from rest_framework import serializers
from .models import Tags, Types, Cuisines

from restaurant.models import Restaurant


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"


class TypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Types
        fields = "__all__"


class CuisinesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisines
        fields = "__all__"
