from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    technical_features = models.TextField(blank=True, null=True, help_text="List of technical features")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Venta")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Costo")
    stock = models.IntegerField(default=0, help_text="Current stock")
    initial_stock = models.IntegerField(default=0, help_text="Initial stock for tracking")
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class StoreSetting(models.Model):
    key = models.CharField(max_length=50, unique=True)
    value = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='settings/', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key
