# Generated by Django 3.2.9 on 2022-03-29 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0003_alter_reservation_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='confirmed',
            field=models.BooleanField(default=False),
        ),
    ]
