# Generated by Django 4.2.1 on 2023-06-28 06:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('restaurant', '0013_notifications'),
    ]

    operations = [
        migrations.AddField(
            model_name='notifications',
            name='type',
            field=models.CharField(choices=[('success', 'Success'), ('alert', 'Alert'), ('warning', 'Warning')], default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='notifications',
            name='recipient',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='notifications', to=settings.AUTH_USER_MODEL),
        ),
    ]