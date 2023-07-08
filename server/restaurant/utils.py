from django.utils import timezone
from .models import Notifications
from datetime import datetime
from datetime import datetime, timedelta
from django.db.models import Q
from .models import Booking, Table, Restaurant, PricingRule


def check_table_availability(restaurantid, date, start_time, end_time, capacity):
    start_time = datetime.strptime(start_time, '%H:%M').time()
    end_time = datetime.strptime(end_time, '%H:%M').time()

    restaurant = Restaurant.objects.get(id=restaurantid)

    bookings = Booking.objects.filter(
        restaurant=restaurant,
        date=date,
        start_time=start_time,
        end_time=end_time,
        is_cancelled=False,
    )

    # Get all tables of the restaurant with capacity
    tables = Table.objects.filter(
        restaurant=restaurant,
        capacity__gte=capacity
    )

    booked_tables = bookings.values_list('table_id', flat=True)

    available_tables = []

    # Iterate over tables and check availability
    for table in tables:
        if table.id not in booked_tables:
            available_tables.append(table.id)

    print(bookings, "Availll", start_time, "tables", available_tables)
    if len(bookings) > 0:
        print(bookings[0].start_time)
    return available_tables


def generate_time_slots(start_time, end_time):
    time_slots = []

    duration = timedelta(hours=1)
    current_time = datetime.combine(datetime.today().date(), start_time)
    end = datetime.combine(datetime.today().date(), end_time)

    while current_time < end:
        end_time = current_time + duration
        time_slots.append([current_time.strftime(
            '%H:%M'), end_time.strftime('%H:%M')])
        current_time += duration

    return time_slots


def round_to_next_hour(dt):
    return (dt.replace(second=0, microsecond=0) + timedelta(hours=2)).replace(minute=0)


def checkAll(restaurantId, date, num_guests):

    restaurant = Restaurant.objects.get(id=restaurantId)
    if date == datetime.today().date():
        # Check if date is today
        # Round current time to next full hour
        start_time = round_to_next_hour(datetime.now()).time()
    else:
        start_time = restaurant.opening_time
    close_time = restaurant.closing_time
    timeslots = generate_time_slots(start_time, close_time)
    availables = []
    for slot in timeslots:

        tables = check_table_availability(
            restaurantId, date, slot[0], slot[1], num_guests)
        #
        if len(tables) >= 1:
            availables.append([slot, tables])

    return availables
# http://127.0.0.1:8000/api/restaurant/availibility/?date=2023-05-26&num_guests=2&restaurant_id=1


def calculate_price(restaurant, base_price, date, start_time, end_time):
    date = datetime.strptime(date, "%Y-%m-%d")

    pricing_rules = PricingRule.objects.filter(
        Q(restaurant=restaurant) & Q(day_of_week=date.weekday()) &
        Q(start_time__lte=start_time) & Q(end_time__gte=end_time)
    ).order_by('-price_multiplier')
    final_price = base_price

    for rule in pricing_rules:
        final_price *= rule.price_multiplier
        final_price += rule.price_offset

    return final_price


def create_notification(recipient, subject, body, type):

    notification = Notifications(
        recipient=recipient,
        subject=subject,
        body=body,
        is_read=False,
        type=type,
        created=timezone.now()
    )
    notification.save()


def get_table(restaurantid, date, start_time, end_time, capacity):

    start_time = datetime.strptime(start_time, '%H:%M').time()
    end_time = datetime.strptime(end_time, '%H:%M').time()
    print(restaurantid, date, start_time, end_time, capacity)
    restaurant = Restaurant.objects.get(id=restaurantid)

    bookings = Booking.objects.filter(

        restaurant=restaurant,
        date=date,
        start_time=start_time,
        end_time=end_time,
        is_cancelled=False,
    )

    print(bookings, "Bookings")

    # Get all tables of the restaurant with capacity
    tables = Table.objects.filter(
        restaurant=restaurant,
        capacity__gte=capacity
    )

    booked_tables = bookings.values_list('table_id', flat=True)
    print("BOOKED TABLES", booked_tables)
    available_tables = []

    # Iterate over tables and check availability
    for table in tables:
        if table.id not in booked_tables:
            available_tables.append(table.id)

    # Sort the available tables by their capacity difference with the requested capacity
    available_tables.sort(key=lambda table_id: abs(
        Table.objects.get(id=table_id).capacity - capacity))
    print(available_tables, "Available tables")
    if available_tables:
        # Return the table with the nearest capacity
        nearest_capacity_table_id = available_tables[0]
        print(nearest_capacity_table_id, "Talbe returned")
        return nearest_capacity_table_id
    else:
        return None
