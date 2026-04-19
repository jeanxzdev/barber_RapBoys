from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from django.http import JsonResponse

# ====== TEMPORARY: Remove after creating superuser ======
def create_temp_superuser(request):
    import traceback
    try:
        from apps.users.models import User
        email = 'admin@rapboys.com'
        password = 'RapBoys2026'
        user = User.objects.filter(email=email).first()
        if user:
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
            return JsonResponse({'status': 'ok', 'message': f'User {email} updated as superuser'})
        else:
            user = User.objects.create_superuser(email=email, password=password)
            return JsonResponse({'status': 'ok', 'message': f'Superuser {email} created with id={user.id}'})
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }, status=500)
def db_check(request):
    from django.db import connection
    try:
        connection.ensure_connection()
        return JsonResponse({'status': 'ok', 'database': 'connected'})
    except Exception as e:
        import traceback
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }, status=500)

# ====== END TEMPORARY ======

urlpatterns = [
    path('db-test/', db_check),
    # TEMPORARY: Remove after use
    path('setup-admin-rapboys-2026/', create_temp_superuser),
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/anti-fraud/', include('apps.anti_fraud.urls')),
]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
