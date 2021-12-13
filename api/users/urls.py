from users.views import LoginView, LogoutView, UserViewSet
from django.urls import path
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register('users', UserViewSet, basename='User Routes')
router.register('login', LoginView, basename='Login')
router.register('logout', LogoutView, basename='Logout')
