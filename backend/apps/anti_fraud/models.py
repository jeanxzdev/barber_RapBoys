from django.db import models
from django.utils import timezone
from datetime import timedelta

class OTPRequest(models.Model):
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

    def is_valid(self):
        # Valid for 10 minutes
        return not self.is_used and self.created_at >= timezone.now() - timedelta(minutes=10)

class FraudLimit(models.Model):
    phone = models.CharField(max_length=15, unique=True)
    otp_requests_last_hour = models.IntegerField(default=0)
    orders_last_hour = models.IntegerField(default=0)
    last_reset = models.DateTimeField(auto_now=True)

    def reset_if_necessary(self):
        if self.last_reset < timezone.now() - timedelta(hours=1):
            self.otp_requests_last_hour = 0
            self.orders_last_hour = 0
            self.save()
