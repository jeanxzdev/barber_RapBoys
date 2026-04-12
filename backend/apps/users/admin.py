from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Definimos qué campos se muestran en la lista
    list_display = ('email', 'phone', 'is_verified', 'is_staff')
    # Eliminamos la ordenación por 'username' y usamos 'email'
    ordering = ('email',)
    # Configuramos los campos para el formulario de edición
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('phone', 'is_verified')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('last_login', 'date_joined')}),
    )
    # Importante: No usar 'username' en ninguna parte
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )
    search_fields = ('email', 'phone')

admin.site.register(User, CustomUserAdmin)
