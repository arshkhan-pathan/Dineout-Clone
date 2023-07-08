from django.contrib import admin
from .models import Restaurant, MenuImage, ResImage, Review, Table, Booking, Invoice, PricingRule, Notifications
# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Invoice)
admin.site.register(PricingRule)
admin.site.register(ResImage)
admin.site.register(MenuImage)
admin.site.register(Review)
admin.site.register(Table)
admin.site.register(Booking)
admin.site.register(Notifications)
