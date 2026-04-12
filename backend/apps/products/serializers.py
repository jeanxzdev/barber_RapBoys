from rest_framework import serializers
from .models import Product, Category, StoreSetting

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 
            'technical_features', 'price', 'cost_price', 
            'stock', 'initial_stock', 'image', 
            'category', 'category_name'
        ]

class StoreSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSetting
        fields = '__all__'
