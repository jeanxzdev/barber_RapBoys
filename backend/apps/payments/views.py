from rest_framework import viewsets, permissions
from .models import PaymentProof
from .serializers import PaymentProofSerializer

class PaymentProofViewSet(viewsets.ModelViewSet):
    queryset = PaymentProof.objects.all()
    serializer_class = PaymentProofSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Additional logic could go here (e.g., updating order status to 'processing')
        serializer.save()
