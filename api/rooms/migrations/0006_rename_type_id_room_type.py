# Generated by Django 3.2.9 on 2022-02-02 19:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0005_rename_typeid_room_type_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='type_id',
            new_name='type',
        ),
    ]