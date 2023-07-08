import uuid
from django.db import models
from moderator.models import Tags, Cuisines, Types
from django.contrib.auth import get_user_model


User = get_user_model()


class Restaurant(models.Model):
    manager = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, default=1)

    name = models.CharField(max_length=100)
    locality = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=50, blank=True)
    tags = models.ManyToManyField(Tags, blank=True)
    avg_cost = models.IntegerField(blank=True, default=2)
    coordinates = models.CharField(max_length=300, blank=True)
    types = models.ManyToManyField(Types, blank=True)
    cuisines = models.ManyToManyField(Cuisines, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    description = models.TextField(blank=True)
    opening_time = models.TimeField(blank=True, null=True)
    closing_time = models.TimeField(blank=True, null=True)
    extras = models.JSONField(blank=True, null=True)
    ratings = models.FloatField(default=0)
    unit_charge = models.IntegerField(default=50)
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        auto_now_add=True, )
    is_Pending = models.BooleanField(default=False)

    def update_ratings(self):
        reviews = Review.objects.filter(restaurant=self)
        rating_sum = reviews.aggregate(models.Sum('rating')).get('rating__sum')
        review_count = reviews.count()

        if rating_sum is not None and review_count > 0:
            self.ratings = round(rating_sum / review_count, 2)

        else:
            self.ratings = 0

        self.save()

    def __str__(self):
        return self.name


class ResImage(models.Model):
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="images", default="1")
    image = models.URLField(
        max_length=250, default="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80")


class MenuImage(models.Model):
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="menuImages", default="1")
    image = models.URLField(
        max_length=200, default="https://lh3.googleusercontent.com/rJ1grb0qDv7Q0nVuU1hIu4BclOz_MsNent80GS2SSCc8gFtJiKfn9mhLoM3CFS1Z3TwDXIwZHecQNPwxuByzxYs0RkPx10olzBruars=w1000-rw")


class Review(models.Model):
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=(
        (1, '1 star'), (2, '2 stars'), (3, '3 stars'), (4, '4 stars'), (5, '5 stars')), default=5)
    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    # Also Add unique together constraint

    class Meta:
        unique_together = ['restaurant', 'user']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.restaurant.update_ratings()


class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    table_number = models.CharField(max_length=50)
    capacity = models.IntegerField()

    def __str__(self):
        return f"Table {self.table_number} - {self.restaurant.name}"


class Booking(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, default="1")
    amount = models.IntegerField(default=100)
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, default="1")
    table = models.ForeignKey(Table, on_delete=models.CASCADE, default="1")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    guests = models.IntegerField()
    additional_details = models.TextField(blank=True)
    isPaid = models.BooleanField(default=False)
    order_payment_id = models.CharField(max_length=100, default="pay_default")
    is_cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.pk} - {self.customer.username}"

    class Meta:
        verbose_name_plural = 'Bookings'


class PricingRule(models.Model):
    DAY_CHOICES = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    price_multiplier = models.FloatField(default=1.0)
    price_offset = models.FloatField(default=0.0)


class Invoice(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice #{self.pk} - {self.customer.username}"

    @property
    def restaurant(self):
        return self.booking.restaurant

    @property
    def booking_details(self):
        return {
            'booking_id': self.booking.id,
            'date': str(self.booking.date),
            'start_time': str(self.booking.start_time),
            'end_time': str(self.booking.end_time),
            'guests': self.booking.guests,
            'additional_details': self.booking.additional_details,
            "table": self.booking.table.table_number
        }

    @property
    def restaurant_details(self):
        return {
            'name': self.booking.restaurant.name,
            'locality': self.booking.restaurant.locality,
            'address': self.booking.restaurant.address,
            'city': self.booking.restaurant.city,
            'phone': self.booking.restaurant.phone_number,
            'coordinates': self.booking.restaurant.coordinates
        }


class Notifications(models.Model):
    TYPE_CHOICES = (
        ('success', 'Success'),
        ('alert', 'Alert'),
        ('warning', 'Warning'),
    )

    recipient = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="notifications"
    )
    subject = models.CharField(max_length=200, null=True, blank=True)
    body = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_read = models.BooleanField(default=False, null=True)
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return self.subject

    class Meta:
        ordering = ['is_read', '-created']
