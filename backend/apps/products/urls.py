from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, StoreSettingViewSet

router = DefaultRouter()
router.register('items', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('settings', StoreSettingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
