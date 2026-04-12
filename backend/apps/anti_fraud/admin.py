from django.contrib import admin
from .models import OTPRequest, FraudLimit

@admin.register(OTPRequest)
class OTPRequestAdmin(admin.ModelAdmin):
    list_display = ('phone', 'code', 'created_at', 'is_used', 'attempts')
    list_filter = ('is_used',)
    search_fields = ('phone',)

@admin.register(FraudLimit)
class FraudLimitAdmin(admin.ModelAdmin):
    list_display = ('phone', 'otp_requests_last_hour', 'orders_last_hour', 'last_reset')
    search_fields = ('phone',)
