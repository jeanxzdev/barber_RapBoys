from django.urls import path
from .views import RequestOTPView

urlpatterns = [
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
]
