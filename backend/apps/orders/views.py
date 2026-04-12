from rest_framework import viewsets, permissions, filters, views, status
from rest_framework.response import Response
from django.db.models import Sum, F
from .models import Order, OrderItem
from apps.users.models import User
from .serializers import OrderSerializer
import json
import urllib.request

from rest_framework.pagination import PageNumberPagination

class OrderPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = OrderPagination

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 1. Ventas Totales
        total_sales = Order.objects.filter(status__in=['verificado', 'entregado']).aggregate(Sum('total_price'))['total_price__sum'] or 0
        
        # 2. CALCULO DE GANANCIAS (Utilidad)
        # Obtenemos todos los items de pedidos pagados/entregados
        items = OrderItem.objects.filter(order__status__in=['verificado', 'entregado'])
        
        # Utilidad = Sumatoria de (Precio Venta - Precio Costo) * Cantidad
        total_profit = 0
        for item in items:
            # Si el producto existe, restamos venta - costo
            margin = item.price - item.product.cost_price
            total_profit += (margin * item.quantity)
        
        # 3. Pedidos Pendientes
        new_orders = Order.objects.filter(status='pendiente').count()
        
        # 4. Total Clientes (FILTRAMOS AL ADMIN)
        total_clients = User.objects.filter(is_staff=False).count()

        return Response({
            'total_sales': float(total_sales),
            'total_profit': float(total_profit),
            'new_orders': new_orders,
            'total_clients': total_clients
        })

class SendOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')
        full_name = request.data.get('full_name', 'Cliente')
        
        if not email or not otp_code:
            return Response({'error': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

        # Configuración de Resend
        RESEND_API_KEY = "re_aMFmPYdf_5bhtjA4xN7gMaVndJTeAjbvy"
        url = "https://api.resend.com/emails"
        
        payload = {
            "from": "RapBoys Barber <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Código de Verificación RapBoys: {otp_code}",
            "html": f"""
            <div style="font-family: sans-serif; background-color: #020202; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto; border: 1px solid #333;">
                <h1 style="color: #ff6b00; font-family: 'Arial Black', sans-serif; font-style: italic; text-align: center; font-size: 32px; letter-spacing: -2px;">RAPBOYS BARBER</h1>
                <p style="text-align: center; opacity: 0.7; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">CÓDIGO DE VERIFICACIÓN</p>
                <div style="margin: 40px 0; text-align: center;">
                    <p style="font-size: 14px; opacity: 0.8;">Hola <strong>{full_name}</strong>,</p>
                    <p style="font-size: 14px; opacity: 0.8;">Ingresa el siguiente código para completar tu pedido:</p>
                    <div style="background-color: #111; padding: 30px; font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #ff6b00; border: 2px solid #ff6b00; border-radius: 20px; display: inline-block; margin: 20px 0;">
                        {otp_code}
                    </div>
                </div>
                <p style="font-size: 11px; text-align: center; color: #666;">Si no realizaste esta solicitud, puedes ignorar este correo.</p>
                <div style="border-top: 1px solid #222; margin-top: 40px; padding-top: 20px; text-align: center;">
                    <p style="font-size: 10px; opacity: 0.5;">Jr. Unión 271, Trujillo - Perú</p>
                </div>
            </div>
            """
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'))
            req.add_header('Authorization', f'Bearer {RESEND_API_KEY}')
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
            
            try:
                with urllib.request.urlopen(req) as response:
                    result = response.read().decode('utf-8')
                    return Response({'message': 'Email enviado', 'resend_id': json.loads(result)})
            except urllib.error.HTTPError as e:
                error_data = e.read().decode('utf-8')
                return Response({'error': f'Resend Error: {error_data}'}, status=e.code)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendOrderConfirmationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        order_id = request.data.get('order_id')
        full_name = request.data.get('full_name', 'Cliente')
        
        if not email or not order_id:
            return Response({'error': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

        # Usamos BarcodeAPI para generar la imagen
        barcode_value = f"RB{order_id.zfill(6)}"
        barcode_url = f"https://barcodeapi.org/api/128/{barcode_value}"

        RESEND_API_KEY = "re_aMFmPYdf_5bhtjA4xN7gMaVndJTeAjbvy"
        url = "https://api.resend.com/emails"
        
        payload = {
            "from": "RapBoys Barber <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Tu Ticket de Recojo RapBoys: {barcode_value}",
            "html": f"""
            <div style="font-family: sans-serif; background-color: #020202; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 500px; margin: auto; border: 1px solid #222; text-align: center;">
                <h1 style="color: #ff6b00; font-style: italic; font-weight: 900; margin-bottom: 5px;">RAPBOYS BARBER</h1>
                <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px; opacity: 0.5;">Ticket de Recojo Digital</p>
                
                <div style="background-color: #fff; padding: 20px; border-radius: 16px; margin: 30px 0;">
                    <img src="{barcode_url}" alt="Código de Barras" style="width: 100%; height: auto; max-width: 300px;">
                    <p style="color: #000; font-weight: bold; margin-top: 10px; font-family: monospace;">{barcode_value}</p>
                </div>
                
                <div style="text-align: left; padding: 0 20px;">
                    <p style="font-size: 14px;">Hola <strong>{full_name}</strong>,</p>
                    <p style="font-size: 14px; opacity: 0.8;">Tu compra ha sido procesada con éxito. Muestra este código de barras en nuestra tienda física para recoger tus productos.</p>
                </div>

                <div style="background-color: #111; padding: 20px; border-radius: 15px; margin-top: 30px;">
                    <p style="font-size: 12px; font-weight: bold; color: #ff6b00;">DIRECCIÓN DE RECOJO:</p>
                    <p style="font-size: 13px; opacity: 0.9;">Jr. Unión 271, Trujillo - Perú</p>
                </div>
            </div>
            """
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'))
            req.add_header('Authorization', f'Bearer {RESEND_API_KEY}')
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'Mozilla/5.0')
            
            with urllib.request.urlopen(req) as response:
                return Response({'message': 'Confirmación enviada'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
