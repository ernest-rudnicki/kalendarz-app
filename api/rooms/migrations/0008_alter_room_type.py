# Generated by Django 3.2.9 on 2022-02-12 18:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0007_auto_20220203_1125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='rooms.roomtype'),
        ),
    ]
