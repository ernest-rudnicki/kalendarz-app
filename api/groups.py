import os
from constants import GROUPS

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
import django

# seed database with groups
django.setup()

from django.contrib.auth.models import Group

MODELS = ['user']

for group in GROUPS:
    new_group, created = Group.objects.get_or_create(name=group)
