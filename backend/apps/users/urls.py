from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import crear_admin_temporal
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()

urlpatterns = [
    path('setup-admin-2026/', crear_admin_temporal), 
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),  # COMENTADAS POR AHORA
    path('profile/', UserDetailView.as_view(), name='profile'),  # COMENTADAS POR AHORA
    path('', include(router.urls)),
]