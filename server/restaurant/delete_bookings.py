import threading
import time
from django.utils import timezone
from .models import Booking


def delete_unpaid_bookings():
    seven_minutes_ago = timezone.now() - timezone.timedelta(minutes=1)
    unpaid_bookings = Booking.objects.filter(
        isPaid=False, created_at__lt=seven_minutes_ago)
    print(len(unpaid_bookings), "deleted")
    unpaid_bookings.delete()


def run_booking_cleanup():
    delete_unpaid_bookings()

    # Schedule the cleanup process to run every minute
    while True:
        time.sleep(60)
        # Run the cleanup process
        delete_unpaid_bookings()


def start_booking_cleanup_thread():
    cleanup_thread = threading.Thread(target=run_booking_cleanup)
    cleanup_thread.daemon = True
    cleanup_thread.start()
