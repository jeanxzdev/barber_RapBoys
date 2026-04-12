from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('verificado', 'Verificado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    
    # Datos de Validación
    otp_code_sent = models.CharField(max_length=6, blank=True, null=True)
    otp_code_entered = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    # Registro de auditoria
    observation = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

# --- SEÑAL AUTOMÁTICA PARA VERIFICAR CLIENTES ---
@receiver(post_save, sender=Order)
def auto_verify_user(sender, instance, **kwargs):
    # Si el estado es Verificado o Entregado, y hay un usuario asociado...
    if instance.status in ['verificado', 'entregado'] and instance.user:
        if not instance.user.is_verified:
            instance.user.is_verified = True
            instance.user.save()
