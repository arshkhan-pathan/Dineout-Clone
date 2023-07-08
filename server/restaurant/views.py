from datetime import datetime, date, timedelta
from rest_framework.generics import ListAPIView, CreateAPIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.db.models import Count, Sum, F
from django.utils import timezone
from django.views import View
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from backend.settings import PUBLIC_KEY, RAZOR_SECRET_KEY
from rest_framework.decorators import api_view, authentication_classes
from rest_framework import status, generics
from .serializers import InvoiceSerializer,  ReviewSerializer, RestaurantViewSerializer, TableSerializer, NotificationsSerializer, BookingSerializer, PricingRuleSerializer, RestaurantSerializer, EarningsSerializer
import razorpay
import json
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from .models import Booking, Table, PricingRule, Invoice, Restaurant, MenuImage, ResImage, Tags, Cuisines, Booking, Restaurant, Review, Notifications
from .utils import checkAll, calculate_price, create_notification, get_table
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import RestaurantFilter, ReviewFilter
from .pagination import RestaurantListPagination, ReviewListPagination
from base.api.serializers import UserSerializer

User = get_user_model()


class RestaurantListAPIView(generics.ListAPIView):
    queryset = Restaurant.objects.all().filter(is_verified=True)

    serializer_class = RestaurantViewSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    # use __ for diving deep
    filterset_class = RestaurantFilter
    search_fields = ['name', 'cuisines__name', 'description',
                     'locality', 'city', 'address', "types__name", "tags__name"]
    ordering_fields = ["ratings"]
    pagination_class = RestaurantListPagination
    authentication_classes = []


class RestaurantCreateAPIView(CreateAPIView):
    serializer_class = RestaurantSerializer
    authentication_classes = []

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = request.data["manager"]
        user = User.objects.get(id=user_id)

        if user.role != 2:
            return Response({"message": "Failed-Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        uploaded_images = serializer.validated_data.pop("uploaded_images", [])
        tags = serializer.validated_data.pop("tag_list", [])
        cuisines = serializer.validated_data.pop("cuisines_list", [])
        types = serializer.validated_data.pop("types_list", [])
        uploaded_menu_images = serializer.validated_data.pop(
            "uploaded_menuImages", [])

        restaurant = serializer.save()
        restaurant.is_Pending = True
        restaurant.save()

        for tag_id in tags:
            tag = Tags.objects.get(id=tag_id)
            restaurant.tags.add(tag)

        for cuisine_id in cuisines:
            cuisine = Cuisines.objects.get(id=cuisine_id)
            restaurant.cuisines.add(cuisine)

        for type_id in types:
            restaurant.types.add(type_id)

        for image in uploaded_images:
            ResImage.objects.create(restaurant=restaurant, image=image)

        for menu_image in uploaded_menu_images:
            MenuImage.objects.create(restaurant=restaurant, image=menu_image)
        create_notification(User.objects.get(id=1), "New Restaurant Approval Request",
                            "Check Pending Restaurant for New Request", 3)
        create_notification(User.objects.get(id=user_id), "Restaurant Creation Request Succesful",
                            "Your Restaurnat Data is Sent Succecssfully", 1)
        headers = self.get_success_headers(serializer.data)
        response_data = {
            'message': 'Restaurant created successfully',
            'data': serializer.data,
            'status': 201

        }
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class RestaurantRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantViewSerializer
    authentication_classes = []

    def get_object(self):
        manager_id = self.kwargs['id']

        try:
            restaurant = Restaurant.objects.get(manager_id=manager_id)
        except Restaurant.DoesNotExist:
            raise NotFound('Restaurant not found for the given manager ID.')

        return restaurant

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        user_id = request.data.get("manager")
        user = User.objects.get(id=user_id)

        if user.role != 2:
            return Response({"message": "Failed-Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        uploaded_images = serializer.validated_data.pop("uploaded_images", [])
        tags = serializer.validated_data.pop("tag_list", [])
        cuisines = serializer.validated_data.pop("cuisines_list", [])
        types = serializer.validated_data.pop("types_list", [])
        uploaded_menu_images = serializer.validated_data.pop(
            "uploaded_menuImages", [])
        instance.tags.clear()
        instance.cuisines.clear()
        instance.types.clear()
        instance.is_Pending = True
        restaurant = serializer.save()

        # Update tags, cuisines, types, uploaded_images, and uploaded_menu_images similar to the create view
        for tag_id in tags:
            tag = Tags.objects.get(id=tag_id)
            restaurant.tags.add(tag)

        for cuisine_id in cuisines:
            cuisine = Cuisines.objects.get(id=cuisine_id)
            restaurant.cuisines.add(cuisine)

        for type_id in types:
            restaurant.types.add(type_id)

        for image in uploaded_images:
            ResImage.objects.create(restaurant=restaurant, image=image)

        for menu_image in uploaded_menu_images:
            MenuImage.objects.create(restaurant=restaurant, image=menu_image)
        response_data = {
            'message': 'Restaurant updated successfully',
            'data': serializer.data,
            'status': 200
        }

        return Response(response_data, status=status.HTTP_200_OK, )


class RestaurantRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantViewSerializer
    authentication_classes = []

    def get_object(self):
        restaurant_id = self.kwargs['id']
        try:
            restaurant = Restaurant.objects.get(
                id=restaurant_id, is_verified=True)
        except Restaurant.DoesNotExist:
            raise NotFound('Restaurant not found or not verified.')
        return restaurant


class ReviewCreateAPIView(CreateAPIView):
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Review created successfully'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([])
def check_table_availability(request):
    date = request.GET.get('date')

    restaurant_id = request.GET.get('restaurant_id')
    num_guests = request.GET.get('num_guests')
    date = datetime.strptime(date, '%Y-%m-%d').date()

    time_slots = checkAll(
        restaurant_id, date, num_guests)

    response_data = {
        "time": time_slots,

    }

    # Return the response as JSON
    return JsonResponse(response_data, )


class CreateTableByManagerView(generics.CreateAPIView):
    serializer_class = TableSerializer
    authentication_classes = []

    def perform_create(self, serializer):
        manager_id = self.kwargs['manager_id']
        restaurant = Restaurant.objects.filter(manager_id=manager_id).first()
        serializer.save(restaurant=restaurant)


class RestaurantTablesByManagerView(generics.ListAPIView):
    serializer_class = TableSerializer
    authentication_classes = []

    def get_queryset(self):
        manager_id = self.kwargs['manager_id']
        current_time = datetime.now().time()

        tables = Table.objects.filter(restaurant__manager_id=manager_id)
        bookings = Booking.objects.filter(restaurant__manager_id=manager_id,
                                          isPaid=True,
                                          date=datetime.now().date(),
                                          start_time__lte=current_time,
                                          end_time__gt=current_time)
        print(bookings)
        occupied_table_ids = bookings.values_list('table_id', flat=True)

        for table in tables:
            if table.id in occupied_table_ids:
                table.is_occupied = "Yes"
            else:
                table.is_occupied = "No"

        return tables


class TableRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TableSerializer
    authentication_classes = []

    def get_queryset(self):
        manager_id = self.kwargs['manager_id']
        return Table.objects.filter(restaurant__manager_id=manager_id)

    def get_object(self):
        queryset = self.get_queryset()
        table_id = self.kwargs['id']
        obj = get_object_or_404(queryset, id=table_id)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookingCreateAPIView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        guests = request.data["guests"]
        restaurant_id = request.data["restaurant"]
        base_amount = guests * \
            Restaurant.objects.get(id=restaurant_id).unit_charge
        amount = calculate_price(
            restaurant_id, base_amount, request.data["date"], request.data["start_time"], request.data["end_time"])

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data["amount"] = amount
        table = (get_table(restaurantid=restaurant_id,
                           date=request.data["date"], start_time=request.data["start_time"], end_time=request.data["end_time"], capacity=guests))

        if table:
            print(table)
            serializer.validated_data["table_id"] = int(table)
            booking = serializer.save()

            client = razorpay.Client(auth=(PUBLIC_KEY, RAZOR_SECRET_KEY))
            payment = client.order.create({
                "amount": int(amount) * 100,
                "currency": "INR",
                "payment_capture": "1"
            })

            booking.order_payment_id = payment["id"]
            booking.save()

            response_data = {
                'payment': payment,
                'data': serializer.data,


            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print("No tables")
            response_data = {
                # 'payment': payment,
                'data': "No talbe",


            }
            return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@authentication_classes([])
def handle_payment_success(request):

    res = json.loads(request.data["response"])

    ord_id = ""
    raz_pay_id = ""
    raz_signature = ""

    for key in res.keys():
        if key == 'razorpay_order_id':
            ord_id = res[key]
        elif key == 'razorpay_payment_id':
            raz_pay_id = res[key]
        elif key == 'razorpay_signature':
            raz_signature = res[key]

    data = {
        'razorpay_order_id': ord_id,
        'razorpay_payment_id': raz_pay_id,
        'razorpay_signature': raz_signature
    }

    client = razorpay.Client(auth=(PUBLIC_KEY, RAZOR_SECRET_KEY))

    check = client.utility.verify_payment_signature(data)

    if not check:

        return Response({'error': 'Something went wrong'})

    booking = Booking.objects.get(order_payment_id=ord_id)
    booking.isPaid = True
    booking.save()

    Invoice.objects.create(customer=booking.customer,
                           booking=booking, amount=booking.amount)
    res_data = {
        'booking': booking.id
    }
    create_notification(booking.customer, "Your Booking is made Successfully",
                        f"Your Booking Is successfully created at {booking.restaurant.name} on {booking.date}  at {booking.start_time} in  {booking.table} ", 1
                        )
    create_notification(booking.restaurant.manager, "You Have recieved a new Booking",
                        f"New Booking on {booking.date}  at {booking.start_time} in table no {booking.table}", 1)

    return Response(res_data)


class PricingRuleListCreateView(generics.CreateAPIView):
    serializer_class = PricingRuleSerializer
    authentication_classes = []

    def perform_create(self, serializer):
        manager_id = self.kwargs['manager_id']
        restaurant = Restaurant.objects.get(manager_id=manager_id)
        serializer.save(restaurant=restaurant)


class PricingRuleListByManagerView(generics.ListAPIView):
    serializer_class = PricingRuleSerializer
    authentication_classes = []

    def get_queryset(self):
        manager_id = self.kwargs['manager_id']
        restaurant = Restaurant.objects.get(manager_id=manager_id)
        return PricingRule.objects.filter(restaurant=restaurant)


class PricingRuleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PricingRuleSerializer
    authentication_classes = []

    def get_queryset(self):
        manager_id = self.kwargs['manager_id']
        return PricingRule.objects.filter(restaurant__manager_id=manager_id)

    def get_object(self):
        queryset = self.get_queryset()
        pricing_rule_id = self.kwargs['id']
        obj = get_object_or_404(queryset, id=pricing_rule_id)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_invoice(request, booking_id):
    invoice = get_object_or_404(Invoice, booking_id=booking_id)
    serializer = InvoiceSerializer(invoice)
    return Response(serializer.data)


"""
Dashboard Endpoints
"""


class RestaurantEarningsAPIView(generics.RetrieveAPIView):
    serializer_class = EarningsSerializer
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        manager_id = self.kwargs['id']
        today = timezone.now().date()

        # Calculate start and end dates for last week
        last_week_start = today - timezone.timedelta(days=7)
        last_week_end = today - timezone.timedelta(days=1)

        # Calculate start and end dates for last month
        last_month_start = timezone.datetime(today.year, today.month, 1).date()
        last_month_end = today

        # Retrieve earnings for last week, last month, and today
        last_week_earnings = Booking.objects.filter(restaurant__manager_id=manager_id, is_cancelled=False, date__range=(
            last_week_start, last_week_end)).aggregate(total_earnings=Sum('amount'))['total_earnings']
        last_month_earnings = Booking.objects.filter(restaurant__manager_id=manager_id, is_cancelled=False, date__range=(
            last_month_start, last_month_end)).aggregate(total_earnings=Sum('amount'))['total_earnings']
        today_earnings = Booking.objects.filter(restaurant__manager_id=manager_id, is_cancelled=False, date=today).aggregate(
            total_earnings=Sum('amount'))['total_earnings']

        # Get the graph data for the bookings and earnings by day
        graph_data = Booking.objects.filter(restaurant__manager_id=manager_id, is_cancelled=False).values(
            'date').annotate(total_bookings=Count('id'), total_earnings=Sum('amount'))

        earnings = {
            'last_week': last_week_earnings,
            'last_month': last_month_earnings,
            'today': today_earnings,
            'graph': list(graph_data)
        }

        return Response(earnings)


class RestaurantBookingsView(View):
    def get(self, request, id):
        today = date.today()

        restaurant = Restaurant.objects.get(manager_id=id)

        bookings = Booking.objects.filter(restaurant=restaurant)

        today_bookings = bookings.filter(date=today, is_cancelled=False)
        upcoming_bookings = bookings.filter(
            date__gt=today, is_cancelled=False)
        past_bookings = bookings.filter(date__lt=today, is_cancelled=False)
        data = {

            'today_bookings': today_bookings.count(),
            'upcoming_bookings': upcoming_bookings.count(),
            'past_bookings': past_bookings.count(),
        }

        return JsonResponse(data)


class BookingStatsView(APIView):
    authentication_classes = []

    def get(self, request, id):
        today = timezone.now().date()

        # Get today's bookings for the manager
        today_bookings = Booking.objects.filter(
            restaurant__manager_id=id, date=today, is_cancelled=False).count()

        # Get upcoming bookings for the manager
        upcoming_bookings = Booking.objects.filter(
            restaurant__manager_id=id, date__gt=today, is_cancelled=False).count()

        # Get past bookings for the manager
        past_bookings = Booking.objects.filter(
            restaurant__manager_id=id, date__lt=today, is_cancelled=False).count()

        # Get booking data for this month for the manager
        bookings_this_month = Booking.objects.filter(
            restaurant__manager_id=id, date__month=today.month, is_cancelled=False).count()

        # Get booking data with customer names
        today_bookings_data = Booking.objects.filter(
            restaurant__manager_id=id, date=today, is_cancelled=False).values('id', 'date', "start_time", 'amount', 'customer_id', "order_payment_id", customer_name=F('customer__first_name'), tableNo=F("table__table_number")).order_by('-date')

        upcoming_bookings_data = Booking.objects.filter(
            restaurant__manager_id=id, date__gt=today, is_cancelled=False).values('id', 'date', "start_time", 'amount',  'customer_id', "order_payment_id", customer_name=F('customer__first_name'), tableNo=F("table__table_number")).order_by('-date')

        past_bookings_data = Booking.objects.filter(
            restaurant__manager_id=id, date__lt=today, is_cancelled=False).values('id', 'date', "start_time", 'amount', 'customer_id', "order_payment_id", customer_name=F('customer__first_name'), tableNo=F("table__table_number")).order_by('-date')

        cancelled_bookings_data = Booking.objects.filter(
            restaurant__manager_id=id, is_cancelled=True).values('id', 'date', "start_time", 'amount', 'customer_id', "order_payment_id", customer_name=F('customer__first_name'), tableNo=F("table__table_number")).order_by('-date')

        stats = {
            'today_bookings': today_bookings,
            'upcoming_bookings': upcoming_bookings,
            'past_bookings': past_bookings,
            'bookings_this_month': bookings_this_month,
            'today_bookings_data': list(today_bookings_data),
            'upcoming_bookings_data': list(upcoming_bookings_data),
            'past_bookings_data': list(past_bookings_data),
            'cancelled_bookings_data': list(cancelled_bookings_data),
        }

        return Response(stats)


class RestaurantReviewsByManagerView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    authentication_classes = []
    filterset_class = ReviewFilter
    pagination_class = ReviewListPagination

    def get_queryset(self):
        manager_id = self.kwargs['manager_id']
        return Review.objects.filter(restaurant__manager_id=manager_id)


# Fetch bookings


class UserBookingsAPIView(ListAPIView):
    serializer_class = BookingSerializer

    def get(self, request, user_id, format=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        now = datetime.now()

        # Filter upcoming bookings by date and time
        upcoming_bookings = Booking.objects.filter(
            customer_id=user_id,
            date__gte=now.date(),
            isPaid=True,
            is_cancelled=False
        ).exclude(
            date=now.date(),
            start_time__lte=now.time()
        )
        upcoming_total_bookings = upcoming_bookings.count()

        # Filter past bookings by date and time
        past_bookings = Booking.objects.filter(
            customer_id=user_id,
            isPaid=True,
            is_cancelled=False
        ).exclude(
            date__gte=now.date()
        ) | Booking.objects.filter(
            customer_id=user_id,
            date=now.date(),
            start_time__lte=now.time(),
            isPaid=True,
            is_cancelled=False
        )
        past_total_bookings = past_bookings.count()
        cancelled_bookings = Booking.objects.filter(
            customer=user, is_cancelled=True).order_by('-date')
        user_serializer = UserSerializer(user)
        upcoming_bookings_serializer = self.serializer_class(
            upcoming_bookings, many=True)
        past_bookings_serializer = self.serializer_class(
            past_bookings, many=True)

        cancel_booking_serializer = self.serializer_class(
            cancelled_bookings, many=True)

        response_data = {
            'user': user_serializer.data,
            'upcoming_bookings': upcoming_bookings_serializer.data,
            'upcoming_total_bookings': upcoming_total_bookings,
            'past_bookings': past_bookings_serializer.data,
            'past_total_bookings': past_total_bookings,
            "cancelled_bookings": cancel_booking_serializer.data,
            "total_bookings": past_total_bookings+upcoming_total_bookings
        }

        return Response(response_data)


class FeaturedRestaurantListView(generics.ListAPIView):
    authentication_classes = []
    queryset = Restaurant.objects.filter(is_featured=True)
    serializer_class = RestaurantViewSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_class = RestaurantFilter


class RestaurantLists(generics.ListAPIView):
    queryset = Restaurant.objects.all().filter(is_verified=True,)
    authentication_classes = []
    serializer_class = RestaurantViewSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_class = RestaurantFilter
    search_fields = ['name', 'cuisines__name', 'description',
                     'locality', 'city', 'address', "types__name", "tags__name"]
    ordering_fields = ["ratings"]


class RestaurantStatsView(View):
    def get(self, request):
        total_restaurants = Restaurant.objects.count()
        total_featured_restaurants = Restaurant.objects.filter(
            is_featured=True).count()

        data = {
            'total_restaurants': total_restaurants,
            'total_featured': total_featured_restaurants
        }

        return JsonResponse(data)


@api_view(['POST'])
def cancel_booking(request, booking_id):
    try:
        role = request.data.get('role')

        booking = Booking.objects.get(id=booking_id)
        # Check if the booking is cancelable
        current_time = datetime.now()
        start_time = datetime.combine(booking.date, booking.start_time)
        cancelation_limit = start_time - timedelta(hours=1)

        if current_time >= cancelation_limit:
            return Response({"error": "Booking cannot be canceled now."}, status=status.HTTP_403_FORBIDDEN)

        # Update the booking as canceled
        booking.is_cancelled = True
        booking.save()

        if role == 2:
            create_notification(booking.customer, "Booking Canceled",
                                f"Sorry, your booking with ID {booking_id} has been canceled by the {booking.restaurant.name}.", 2)

            create_notification(booking.restaurant.manager, "Booking Canceled",
                                f"The booking with ID {booking_id} adn of customer {booking.customer.first_name} has been canceled successfully.", 2)

        if role == 3:
            create_notification(booking.customer, "Booking Canceled",
                                f"Your booking with ID {booking_id} at {booking.restaurant.name} has been canceled successfully.", 2)

            create_notification(booking.restaurant.manager, "Booking Canceled",
                                f"Sorry, the booking with ID {booking_id}  has been canceled by the user.", 2)

        return Response({"message": "Booking canceled successfully."}, status=status.HTTP_200_OK)

    except Booking.DoesNotExist:
        return Response({"error": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)


class UserNotificationsView(APIView):
    def get(self, request, user_id):
        try:
            notifications = Notifications.objects.filter(recipient_id=user_id)
            serializer = NotificationsSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notifications.DoesNotExist:
            return Response({"error": "Notifications not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def mark_notifications_as_read(request, user_id):
    try:
        notifications = Notifications.objects.filter(
            recipient_id=user_id, is_read=False)
        for notification in notifications:
            notification.is_read = True
            notification.save()

        serializer = NotificationsSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Notifications.DoesNotExist:
        return Response({"error": "Notifications not found."}, status=status.HTTP_404_NOT_FOUND)
