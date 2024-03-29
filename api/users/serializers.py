from rest_framework import serializers
from utils.custom_validators import ProperEmail
from utils.response_error import ErrorType, get_error_dict
from utils.custom_validators import CustomUserValidation
from users.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from constants import GROUPS
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import APIException

class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        try:
            validated_data['groups'] = Group.objects.get(name=GROUPS[1])
        except Group.DoesNotExist:
            raise APIException(get_error_dict(errorType=ErrorType.GROUP_NOT_FOUND, msg='The group' + GROUPS[1] + 'does not exist. Contact administrator'))

        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(
                validated_data['password'])
        return super(UserSerializer, self).update(instance, validated_data)

    def validate_password(self, pswd):
        CustomUserValidation().validate_password(password=pswd)
        return pswd
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'email', 'password', 'username', 'groups', 'created', 'banned_till', 'perma_banned']
        extra_kwargs = {
            'password': {'write_only': True},
            'groups': {'required': False},
            'email': {
                'validators': [
                    ProperEmail(),
                    UniqueValidator(queryset=User.objects.all(), message=get_error_dict(errorType=ErrorType.EMAIL_TAKEN, msg='User with this email arleady exists'))
                ]
            },
            'username': {
                'validators': [
                    UniqueValidator(queryset=User.objects.all(), message=get_error_dict(errorType=ErrorType.USERNAME_TAKEN, msg='User with this username arleady exists'))
                ]
            },
        }