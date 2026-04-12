from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentProofViewSet

router = DefaultRouter()
router.register('proofs', PaymentProofViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
