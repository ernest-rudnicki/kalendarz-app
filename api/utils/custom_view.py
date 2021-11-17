from rest_framework.viewsets import ModelViewSet
import json;
import importlib

acl_matrix = json.load(open("acl/acl.json"))

class CustomModelViewSet(ModelViewSet):
    """
    Extended Model view to load permissions from json file
    """
    acl_name = None

    def get_permission_from_acl(acls):
        permissions = []
        for acl in acls:
            PermissionClass = getattr(importlib.import_module("users.permission"), "is" + acl)
            permissions.append(PermissionClass)
        return permissions

    def get_permissions(self):
        if self.acl_name == None:
            return []
        acl_list = acl_matrix[self.acl_name]["permissions"][self.action]
        permission_classes = self.get_permission_from_acl(acl_list)
        return [permission() for permission in permission_classes]