from django.db.models import Count, Sum, F
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes
from .serializers import TagsSerializer, CuisinesSerializer, TypesSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from restaurant.filters import RestaurantFilter
from rest_framework.permissions import IsAdminUser
from restaurant.pagination import RestaurantListPagination
from restaurant.models import Restaurant
from restaurant.serializers import RestaurantViewSerializer
from restaurant.utils import create_notification
from rest_framework.views import APIView


from rest_framework import generics
from restaurant.models import Tags, Cuisines, Types, Restaurant, Booking


from django.contrib.auth import get_user_model
User = get_user_model()

# Create your views here.

'''
Tags
'''


class TagsListCreateView(generics.ListCreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


class TagsRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


'''
Cuisines
'''


class CuisinesListCreateView(generics.ListCreateAPIView):
    queryset = Cuisines.objects.all()
    serializer_class = CuisinesSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


class CuisinesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cuisines.objects.all()
    serializer_class = CuisinesSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


'''
Types
'''


class TypeListCreateView(generics.ListCreateAPIView):
    queryset = Types.objects.all()
    serializer_class = TypesSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


class TypeRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Types.objects.all()
    serializer_class = TypesSerializer
    # permission_classes = [IsAdminUser]
    authentication_classes = []


'''
Pending Restaurants
'''


class RestaurantListAPIView(generics.ListAPIView):
    queryset = Restaurant.objects.all().filter(is_verified=False, is_Pending=True)
    serializer_class = RestaurantViewSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    # use __ for diving deep
    filterset_class = RestaurantFilter
    search_fields = ['name', 'cuisines__name', 'description',
                     'locality', 'city', 'address', "types__name", "tags__name"]
    ordering_fields = ["ratings"]
    authentication_classes = []


"""

/id/delete
/id/verified
"""


@api_view(['GET'])
@authentication_classes([])
def getRestaurant(requests, id):
    restaurant = Restaurant.objects.get(id=id)
    serializer = RestaurantViewSerializer(restaurant, many=False)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([])
def getRestaurantApprove(requests, id):
    restaurant = Restaurant.objects.get(id=id)
    restaurant.is_verified = True
    restaurant.is_Pending = False
    restaurant.save()
    serializer = RestaurantViewSerializer(restaurant, many=False)
    create_notification(restaurant.manager, "Your Restaurant Is Approved By Admin",
                        f"Congraturlation {restaurant.name} is live now on Dineout make sure to add Tables", 1)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([])
def getRestaurantDelete(requests, id, ):
    message = (requests.data["message"])
    restaurant = Restaurant.objects.get(id=id)
    create_notification(restaurant.manager, "Your Restaurant Is Rejected By Admin",
                        f"Sorry request of adding {restaurant.name} is rejected now on this site by Admin", 2)
    create_notification(restaurant.manager, "Restaurant Rejection Reason",
                        message, 2)
    restaurant.is_Pending = False
    restaurant.save()
    print(restaurant.is_Pending)

    print("Deleted Succes")
    return Response(["Deleted Sucess"])


# Admin Apis

class StatsAPIView(APIView):
    authentication_classes = []

    def get(self, request):
        # Calculate the start and end dates for this week
        today = timezone.now().date()
        start_date = today - timedelta(days=today.weekday())
        end_date = start_date + timedelta(days=6)

        # Get the count of new users with role 3 registered this week
        new_users_count = User.objects.filter(role=3, date_joined__range=[
                                              start_date, end_date]).count()

        # Get the total number of users
        total_users_count = User.objects.count()

        # Get the total number of verified restaurants
        verified_restaurants_count = Restaurant.objects.filter(
            is_verified=True).count()

        # Get the total number of unverified restaurants
        unverified_restaurants_count = Restaurant.objects.filter(
            is_verified=False).count()

        # Generate data for new users vs date
        new_users_graph_data = User.objects.filter(role=3).values(
            'date_joined__date').annotate(count=Count('id'))

        # Generate data for total bookings made vs date
        bookings_graph_data = Booking.objects.values(
            'date').annotate(count=Count('id'))

        # Prepare the response data
        response_data = {
            'new_users_count': new_users_count,
            'total_users_count': total_users_count,
            'verified_restaurants_count': verified_restaurants_count,
            'unverified_restaurants_count': unverified_restaurants_count,
            'new_users_graph_data': list(new_users_graph_data),
            'bookings_graph_data': list(bookings_graph_data),
        }

        return Response(response_data)


# Featured Restaurants
@api_view(['GET'])
@authentication_classes([])
def addRestaurantToFeatured(request, id):
    restaurant = Restaurant.objects.get(id=id)
    restaurant.is_featured = True
    restaurant.save()
    serializer = RestaurantViewSerializer(restaurant, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([])
def removeRestaurantFromFeatured(request, id):
    restaurant = Restaurant.objects.get(id=id)
    restaurant.is_featured = False
    restaurant.save()
    serializer = RestaurantViewSerializer(restaurant, many=False)
    return Response(serializer.data)


class TagsTypesCuisinesListAPIView(APIView):
    authentication_classes = []

    def get(self, request):
        tags = Tags.objects.all()
        types = Types.objects.all()
        cuisines = Cuisines.objects.all()

        tags_serializer = TagsSerializer(tags, many=True)
        types_serializer = TypesSerializer(types, many=True)
        cuisines_serializer = CuisinesSerializer(cuisines, many=True)

        data = {
            'tags': tags_serializer.data,
            'types': types_serializer.data,
            'cuisines': cuisines_serializer.data
        }

        return Response(data)


class RequestsStatsAPIView(APIView):
    authentication_classes = []

    def get(self, request):
        today = timezone.now().date()

        total_pending_restaurants = Restaurant.objects.filter(
            is_verified=False).count()

        new_restaurants_today = Restaurant.objects.filter(
            created_at__date=today).count()

        total_verified_restaurants = Restaurant.objects.filter(
            is_verified=True).count()

        response_data = {
            'total_pending_restaurants': total_pending_restaurants,
            'new_restaurants_today': new_restaurants_today,
            'total_verified_restaurants': total_verified_restaurants,
        }

        return Response(response_data)


class RestaurantDetailView(APIView):
    authentication_classes = []

    def get(self, request, id):
        try:
            restaurant = Restaurant.objects.get(id=id)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=404)

        today = timezone.now().date()

        # Calculate start and end dates for last week
        last_week_start = today - timezone.timedelta(days=7)
        last_week_end = today - timezone.timedelta(days=1)

        # Calculate start and end dates for last month
        last_month_start = timezone.datetime(today.year, today.month, 1).date()
        last_month_end = today

        # Retrieve earnings for last week, last month, and today

        last_week_earnings = Booking.objects.filter(restaurant=id, date__range=(
            last_week_start, last_week_end)).aggregate(total_earnings=Sum('amount'))['total_earnings']

        last_month_earnings = Booking.objects.filter(restaurant=id, date__range=(
            last_month_start, last_month_end)).aggregate(total_earnings=Sum('amount'))['total_earnings']

        today_earnings = Booking.objects.filter(restaurant=id, date=today).aggregate(
            total_earnings=Sum('amount'))['total_earnings']

        graph_data = Booking.objects.filter(restaurant=id).values(
            'date').annotate(total_bookings=Count('id'), total_earnings=Sum('amount'))

        today_bookings = Booking.objects.filter(
            restaurant=id, date=today).count()

        # Get upcoming bookings for the manager
        upcoming_bookings = Booking.objects.filter(
            restaurant=id, date__gt=today).count()

        # Get past bookings for the manager
        past_bookings = Booking.objects.filter(
            restaurant=id, date__lt=today).count()

        # Get booking data for this month for the manager
        bookings_this_month = Booking.objects.filter(
            restaurant=id, date__month=today.month).count()

        response_data = {
            'today_earnings': today_earnings,
            "last_week_earnings": last_week_earnings,
            "last_month_earnings": last_month_earnings,
            "earnings_graph": graph_data,
            'today_bookings': today_bookings,
            'upcoming_bookings': upcoming_bookings,
            'past_bookings': past_bookings,
            'bookings_this_month': bookings_this_month,

        }

        return Response(response_data, status=200)
