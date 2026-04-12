from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, StoreSetting
from .serializers import ProductSerializer, CategorySerializer, StoreSettingSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None

class StoreSettingViewSet(viewsets.ModelViewSet):
    queryset = StoreSetting.objects.all()
    serializer_class = StoreSettingSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    lookup_field = 'key'
