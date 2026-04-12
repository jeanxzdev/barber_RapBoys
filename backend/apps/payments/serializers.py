from rest_framework import serializers
from .models import PaymentProof

class PaymentProofSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentProof
        fields = '__all__'
        read_only_fields = ['is_verified', 'verified_at']
