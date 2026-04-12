from django.db import models
from apps.orders.models import Order

class PaymentProof(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment_proof')
    proof_image = models.ImageField(upload_to='payment_proofs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Proof for Order {self.order.id}"
