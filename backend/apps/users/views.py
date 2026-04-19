from django.http import HttpResponse
from .models import User
import sys
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

def crear_admin_temporal(request):
    try:
        email = 'admin@rapboys.com'
        password = 'RapBoys2026ahi'
        
        # Verificamos si ya existe para no chocar
        user_exists = User.objects.filter(email=email).exists()
        
        if not user_exists:
            # Usamos create_superuser pero manejando el modelo de forma flexible
            User.objects.create_superuser(
                email=email,
                username=email, # Algunos modelos usan username, otros no
                password=password
            )
            return HttpResponse(f"<h1>✅ Éxito</h1><p>Admin {email} creado.</p>")
        else:
            return HttpResponse("<h1>⚠️ Aviso</h1><p>El usuario ya existe.</p>")
            
    except Exception as e:
        # Esto nos dirá EXACTAMENTE por qué falló en la pantalla
        error_type, error_obj, error_tb = sys.exc_info()
        return HttpResponse(f"<h1>❌ Error Crítico</h1><p>{str(e)}</p><p>Línea: {error_tb.tb_lineno}</p>")


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email y password son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email ya registrado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(email=email, password=password)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'id': user.id, 'email': user.email}
        }, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'No autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })