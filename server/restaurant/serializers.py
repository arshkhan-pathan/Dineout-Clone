from .models import Restaurant, ResImage, MenuImage, Review,  Table, Booking, PricingRule, Invoice, Notifications
from moderator.serializers import TagsSerializer, CuisinesSerializer, TypesSerializer
from rest_framework import serializers


class RestaurantImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResImage
        fields = ["id", "restaurant", "image"]


class MenuImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuImage
        fields = ["id", "restaurant", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source='user.first_name', read_only=True)
    created_at = serializers.SerializerMethodField()
    user_imageurl = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        return obj.created_at.strftime("%d-%m-%Y ")

    def get_user_imageurl(self, obj):
        # Customize the logic to retrieve the user's imageurl
        user = obj.user
        return user.image_url if hasattr(user, 'image_url') else None

    class Meta:
        model = Review
        fields = "__all__"


class RestaurantSerializer(serializers.ModelSerializer):
    images = RestaurantImageSerializer(many=True, read_only=True)

    menuImages = MenuImageSerializer(many=True, read_only=True)

    tag_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    types_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    cuisines_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    uploaded_images = serializers.ListField(
        child=serializers.URLField(
            max_length=1000000, required=False),
        write_only=True, required=False)

    uploaded_menuImages = serializers.ListField(
        child=serializers.URLField(
            max_length=1000000,  required=False,),
        write_only=True, required=False)

    class Meta:
        model = Restaurant
        fields = ["manager", "name", "description", "images", "locality", "phone_number", "address", "city", "avg_cost", "coordinates", "opening_time", "closing_time", "extras",
                  "uploaded_images", "uploaded_menuImages", "menuImages", "tag_list",
                  "types_list", "cuisines_list", "unit_charge"]


class RestaurantViewSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    tags = TagsSerializer(many=True, read_only=True)
    cuisines = CuisinesSerializer(many=True, read_only=True)
    types = TypesSerializer(many=True, read_only=True)
    images = RestaurantImageSerializer(many=True, read_only=True)
    menuImages = MenuImageSerializer(many=True, read_only=True)
    tag_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    types_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    cuisines_list = serializers.ListField(
        child=serializers.IntegerField(required=False), write_only=True, required=False)

    uploaded_images = serializers.ListField(
        child=serializers.URLField(
            max_length=1000000, required=False),
        write_only=True, required=False)

    uploaded_menuImages = serializers.ListField(
        child=serializers.URLField(
            max_length=1000000,  required=False,),
        write_only=True, required=False)

    manager_name = serializers.CharField(
        source='manager.first_name', read_only=True)

    class Meta:
        model = Restaurant
        fields = "__all__"

    def get_reviews(self, obj):
        limit = 3  # Set the desired limit for the number of reviews
        reviews = obj.reviews.all().order_by('-id')[:limit]
        return ReviewSerializer(reviews, many=True).data


class TableSerializer(serializers.ModelSerializer):
    is_occupied = serializers.CharField(read_only=True)

    class Meta:
        model = Table
        fields = ['id', 'table_number',
                  'capacity', 'is_occupied']


class BookingSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(
        source='restaurant.name', read_only=True)
    table_no = serializers.CharField(
        source='table.table_number', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'


class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = ["id", "price_offset", "price_multiplier",
                  "day_of_week", "start_time", "end_time"]


class InvoiceSerializer(serializers.ModelSerializer):
    restaurant = serializers.SerializerMethodField()
    booking_details = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    customer_name = serializers.CharField(
        source='customer.first_name', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'booking', 'amount',
                  'created_at', 'restaurant', 'booking_details', "customer_name"]

    def get_restaurant(self, invoice):
        return invoice.restaurant_details

    def get_booking_details(self, invoice):
        return invoice.booking_details


class EarningsSerializer(serializers.Serializer):
    total_earnings = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'
