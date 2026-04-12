from rest_framework import status, response, views
from .services import generate_otp

class RequestOTPView(views.APIView):
    def post(self, request):
        phone = request.data.get('phone')
        if not phone or len(phone) != 9 or not phone.startswith('9'):
            return response.Response({"error": "Formato de teléfono peruano inválido (9 dígitos, empieza con 9)"}, 
                                     status=status.HTTP_400_BAD_REQUEST)
        
        code, error = generate_otp(phone)
        if error:
            return response.Response({"error": error}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        return response.Response({"message": "OTP enviado correctamente (MOCK)"}, status=status.HTTP_200_OK)
