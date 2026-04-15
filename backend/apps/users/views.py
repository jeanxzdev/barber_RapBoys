from rest_framework import viewsets, permissions, generics
from .serializers import UserSerializer
from .models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

# --- TRUCO TEMPORAL PARA CREAR ADMIN ---
from django.http import HttpResponse

def crear_admin_temporal(request):
    # Usamos tu modelo personalizado de la carpeta actual
    email = 'admin@rapboys.com'
    password = 'RapBoys2026'
    
    if not User.objects.filter(email=email).exists():
        # En modelos personalizados, el 'username' suele ser el email
        User.objects.create_superuser(username=email, email=email, password=password)
        return HttpResponse(f"<h1>✅ Éxito</h1><p>Superusuario '{email}' creado correctamente en Clever Cloud.</p>")
    else:
        return HttpResponse("<h1>⚠️ Aviso</h1><p>El usuario ya existe.</p>")