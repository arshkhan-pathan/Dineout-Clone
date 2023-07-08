from django.urls import path

from .views import (
    TagsListCreateView, TagsRetrieveUpdateDeleteView,
    TypeListCreateView,
    TypeRetrieveUpdateDeleteView,
    CuisinesListCreateView,
    CuisinesRetrieveUpdateDeleteView,
    RestaurantListAPIView,
    getRestaurant,
    getRestaurantApprove,
    getRestaurantDelete, StatsAPIView, RestaurantDetailView, removeRestaurantFromFeatured, addRestaurantToFeatured, TagsTypesCuisinesListAPIView, RequestsStatsAPIView


)


urlpatterns = [
    # Tags
    path('tags/', TagsListCreateView.as_view(), name='tags-list'),
    path('tags/<int:pk>/', TagsRetrieveUpdateDeleteView.as_view(), name='tags-detail'),

    # Types
    path('types/', TypeListCreateView.as_view(), name='types-list'),
    path('types/<int:pk>/', TypeRetrieveUpdateDeleteView.as_view(),
         name='types-detail'),
    # Cuinises
    path('cuisines/', CuisinesListCreateView.as_view(), name='cuisines-list'),
    path('cuisines/<int:pk>/', CuisinesRetrieveUpdateDeleteView.as_view(),
         name='cuisines-detail'),

    # Pending Restaurants
    path('pendingrestaurants/', RestaurantListAPIView.as_view(),
         name='pending-restaurant'),
    path('pendingrestaurants/<int:id>/',
         getRestaurant, name='restaurant-approve'),
    path('pendingrestaurants/<int:id>/approve',
         getRestaurantApprove, name='restaurant-approve'),
    path('pendingrestaurants/<int:id>/delete',
         getRestaurantDelete, name='restaurant-delete'),

    # Stats
    path('stats',
         StatsAPIView.as_view(), name='stats'),
    path('restaurant/stats/<int:id>/',
         RestaurantDetailView.as_view(), name='cuisines-list'),
    path('cusinetagstypes/',
         TagsTypesCuisinesListAPIView.as_view(), name='cuisnie-tags-types'),
    path("requeststats", RequestsStatsAPIView.as_view()),

    # Featured
    path('restaurant/featured/add/<int:id>/',
         addRestaurantToFeatured, name='restaurant-featured-add'),
    path('restaurant/featured/remove/<int:id>/',
         removeRestaurantFromFeatured, name='restaurant-featured-remove'),

]
