from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, DashboardStatsView, SendOTPView, SendOrderConfirmationView

router = DefaultRouter()
router.register(r'', OrderViewSet)

urlpatterns = [
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('send-confirmation/', SendOrderConfirmationView.as_view(), name='send-confirmation'),
    path('', include(router.urls)),
]
