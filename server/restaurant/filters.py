import django_filters
from .models import Restaurant, Review


class RestaurantFilter(django_filters.FilterSet):
    tags = django_filters.CharFilter(
        field_name='tags__name', lookup_expr='icontains', method='filter_tags'
    )
    cuisines = django_filters.CharFilter(
        field_name='cuisines__name', lookup_expr='icontains', method='filter_cuisines'
    )
    types = django_filters.CharFilter(
        field_name='types__name', lookup_expr='icontains'
    )
    locality = django_filters.CharFilter(lookup_expr='icontains')
    avg_cost__gt = django_filters.NumberFilter(
        field_name='avg_cost', lookup_expr='gt'
    )
    avg_cost__lt = django_filters.NumberFilter(
        field_name='avg_cost', lookup_expr='lt'
    )

    def filter_tags(self, queryset, name, value):
        tags = value.split(',')
        for tag in tags:
            queryset = queryset.filter(tags__name=tag)
        return queryset.distinct()

    def filter_cuisines(self, queryset, name, value):
        cuisines = value.split(',')
        for cuisine in cuisines:
            queryset = queryset.filter(cuisines__name=cuisine)
        return queryset.distinct()

    class Meta:
        model = Restaurant
        fields = ['tags', 'cuisines', 'types', 'locality', 'avg_cost']


class ReviewFilter(django_filters.FilterSet):
    ordering = django_filters.OrderingFilter(
        fields=(
            ('rating', 'ratings'),
            ('created_at', 'date'),
        )
    )

    class Meta:
        model = Review
        fields = ['rating', 'created_at']
