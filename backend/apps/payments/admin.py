from django.contrib import admin
from .models import PaymentProof

@admin.register(PaymentProof)
class PaymentProofAdmin(admin.ModelAdmin):
    list_display = ('order', 'uploaded_at', 'is_verified')
    list_filter = ('is_verified',)
    readonly_fields = ('proof_image_display',)

    def proof_image_display(self, obj):
        from django.utils.html import format_html
        if obj.proof_image:
            return format_html('<img src="{}" width="300" />', obj.proof_image.url)
        return "No image"
    proof_image_display.short_description = "Comprobante"
