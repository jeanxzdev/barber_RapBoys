import random
from .models import OTPRequest, FraudLimit
from django.utils import timezone
from datetime import timedelta

def generate_otp(phone):
    # Check limits
    limit, created = FraudLimit.objects.get_or_create(phone=phone)
    limit.reset_if_necessary()
    
    if limit.otp_requests_last_hour >= 3:
        return None, "Límite de solicitudes de OTP excedido (max 3 por hora)"
    
    code = f"{random.randint(100000, 999999)}"
    OTPRequest.objects.create(phone=phone, code=code)
    
    limit.otp_requests_last_hour += 1
    limit.save()
    
    # Mock sending SMS
    print(f"DEBUG: Enviando OTP {code} al teléfono {phone}")
    
    return code, None

def verify_otp(phone, code):
    otp = OTPRequest.objects.filter(phone=phone, code=code, is_used=False).last()
    if otp and otp.is_valid():
        otp.is_used = True
        otp.save()
        return True
    
    if otp:
        otp.attempts += 1
        otp.save()
    return False
