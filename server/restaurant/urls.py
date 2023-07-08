from django.urls import path
from . import views
from .views import (
    ReviewCreateAPIView,
    RestaurantListAPIView,
    RestaurantCreateAPIView,
    CreateTableByManagerView,
    TableRetrieveUpdateDestroyView,
    BookingCreateAPIView,
    RestaurantRetrieveUpdateDestroyAPIView,
    PricingRuleListCreateView, PricingRuleListByManagerView, PricingRuleRetrieveUpdateDestroyView,
    RestaurantTablesByManagerView, RestaurantReviewsByManagerView, BookingStatsView, RestaurantBookingsView, RestaurantEarningsAPIView,
    get_invoice,  PricingRuleRetrieveUpdateDestroyView, FeaturedRestaurantListView, RestaurantLists,
    RestaurantRetrieveAPIView, UserBookingsAPIView, RestaurantStatsView, UserNotificationsView, mark_notifications_as_read,
)


urlpatterns = [
    # Restaurants
    path('restaurants/', RestaurantListAPIView.as_view(), name='restaurant-list'),
    path('restaurants/all', RestaurantLists.as_view(),
         name='restaurant-featured'),
    path('restaurants/create/', RestaurantCreateAPIView.as_view(),
         name='restaurant-create'),

    # Restaurant By MnagerId
    path('restaurants/<int:id>/',
         RestaurantRetrieveUpdateDestroyAPIView.as_view(), name='restaurant-Update'),

    # Restauarnt By Restauarnt Id
    path('restaurants/id/<int:id>/',
         RestaurantRetrieveAPIView.as_view(), name='restaurant-retrieve-id'),


    # Featured
    path('restaurants/featured',  FeaturedRestaurantListView.as_view(),
         name='restaurant-featured'),
    path('restaurant-stats/', RestaurantStatsView.as_view(),
         name='restaurant_stats_featured'),

    # Bookings
    path("restaurants/<int:id>/bookings/data",  BookingStatsView.as_view(),
         name="bookings-data"),
    path("restaurants/<int:id>/bookings/stats",  RestaurantBookingsView.as_view(),
         name="bookings-stats"),
    path('bookings/<int:booking_id>/cancel/',
         views.cancel_booking, name='cancel-booking'),


    # User with Restauarnt Data
    path('users/<int:user_id>/',
         UserBookingsAPIView.as_view(), name='user-bookings'),



    # Pricing Rules
    path('restaurants/<int:manager_id>/pricingrules/', PricingRuleListCreateView.as_view(),
         name='pricing-rule-list-create'),
    path('restaurants/<int:manager_id>/pricingrules/all', PricingRuleListByManagerView.as_view(),
         name='pricing-rule-list-create'),
    path('restaurants/<int:manager_id>/pricingrules/<int:id>', PricingRuleRetrieveUpdateDestroyView.as_view(),
         name='pricing-rule-list-create'),


    # Tables
    path("restaurants/<int:manager_id>/tables/",
         CreateTableByManagerView.as_view(), name="tables-Create"),
    path("restaurants/<int:manager_id>/tables/<int:id>",
         TableRetrieveUpdateDestroyView.as_view(), name="table-retireve-update"),
    path("restaurants/<int:manager_id>/tables/all",
         RestaurantTablesByManagerView.as_view(), name="tables"),





    # Reviews
    path('restaurants/<int:manager_id>/reviews',
         RestaurantReviewsByManagerView.as_view(), name='restaurant-review'),
    path('addreview/', ReviewCreateAPIView.as_view(), name='review'),


    # Booking Create + Payement
    path('pay/',  BookingCreateAPIView.as_view(), name="payment"),
    path('payment/success/', views.handle_payment_success, name="payment_success"),




    # Checking Table + Slot booking API
    path("availibility/", views.check_table_availability, name="availibility"),


    # Invoice By Booking Id
    path('invoice/<int:booking_id>/', get_invoice, name='get_invoice'),


    # Earnings Graph

    path('restaurants/<int:id>/earnings/',
         RestaurantEarningsAPIView.as_view(), name='restaurant-earnings'),


    # Notifications
    path('notifications/<int:user_id>/',
         UserNotificationsView.as_view(), name='user-notifications'),
    path('notifications/<int:user_id>/mark-as-read/',
         mark_notifications_as_read, name='mark_notifications_as_read'),




]
