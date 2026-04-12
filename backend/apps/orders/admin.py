from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Mostramos los campos nuevos: otp_verified y status
    list_display = ('id', 'full_name', 'total_price', 'status', 'otp_verified', 'created_at')
    list_filter = ('status', 'otp_verified', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'id')
    inlines = [OrderItemInline]
    
    # Quitamos 'expires_at' de aquí porque ya no existe en el modelo
    readonly_fields = ('created_at', 'updated_at', 'otp_code_sent', 'otp_code_entered')
    
    fieldsets = (
        (None, {'fields': ('user', 'full_name', 'email', 'phone', 'total_price', 'status')}),
        ('Seguridad Anti-Fraude', {'fields': ('otp_code_sent', 'otp_code_entered', 'otp_verified')}),
        ('Logística y Notas', {'fields': ('observation',)}),
        ('Fechas de Registro', {'fields': ('created_at', 'updated_at')}),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
