# Generated by Django 4.2.1 on 2023-05-15 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_customuser_created_date_customuser_is_deleted_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'admin'), (2, 'manager'), (3, 'user')], default=3, null=True),
        ),
    ]
