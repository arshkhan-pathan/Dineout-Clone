# Generated by Django 4.2.1 on 2023-07-05 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0015_booking_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='is_Pending',
            field=models.BooleanField(default=False),
        ),
    ]
