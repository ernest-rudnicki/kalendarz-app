from django.contrib.auth.models import Group
from rest_framework import permissions

def _is_user_object(obj):
    return hasattr(obj, 'email')


def _is_in_group(user, group_name):
    """
    Takes a user and a group name, and returns `True` if the user is in that group.
    """
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None

def _has_group_permission(user, required_groups):
    return any([_is_in_group(user, group_name) for group_name in required_groups])
    
class IsLoggedInUserOrAdmin(permissions.BasePermission):
    """
        Action on the object that belongs to a user or any object for administrator
    """
    required_groups = ['administrator']

    def has_object_permission(self, request, view, obj):
        has_group_permission = _has_group_permission(request.user, self.required_groups)
        return ((hasattr(obj, 'user') and obj.user == request.user) or _is_user_object(obj) and obj.id == request.user.id) or has_group_permission

class IsAdminUser(permissions.BasePermission):
    """
        Action available only to the administrators
    """
    required_groups = ['administrator']

    def has_permission(self, request, view):
        has_group_permission = _has_group_permission(request.user, self.required_groups)
        return request.user and has_group_permission

    def has_object_permission(self, request, view, obj):
        has_group_permission = _has_group_permission(request.user, self.required_groups)
        return request.user and has_group_permission
