from django.http import HttpResponse
from .models import User
import sys

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