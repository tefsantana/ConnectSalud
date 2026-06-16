from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import mercadopago


TEST_ACCESS_TOKEN = (
    "TEST-2305067427866064-060706-744e487be3993329908278932d8490bb-12163859"
)

sdk = mercadopago.SDK(TEST_ACCESS_TOKEN)


class CreatePaymentAPIView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.data or {}
        title = payload.get("title") or "Mi plan de salud"

        try:
            unit_price = int(payload.get("unit_price", 1000))
        except (TypeError, ValueError):
            return Response(
                {"detail": "unit_price debe ser un numero entero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if unit_price <= 0:
            return Response(
                {"detail": "unit_price debe ser mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quantity = 1

        preference_data = {
            "back_urls": {
                "success": "http://localhost:4200/#/carrito",
                "failure": "http://localhost:4200/#/carrito",
                "pending": "http://localhost:4200/#/carrito",
            },
            "items": [
                {
                    "title": title,
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "currency_id": "ARS",
                }
            ],
        }

        try:
            preference_response = sdk.preference().create(preference_data)
            response_data = preference_response.get("response", {})
            preference_url = response_data.get("sandbox_init_point") or response_data.get("init_point")

            if not preference_url:
                return Response(
                    {
                        "detail": "MercadoPago no devolvio una URL de pago.",
                        "mercadopago_response": response_data,
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            return Response({"payment_url": preference_url}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"detail": "Error al crear la preferencia de pago.", "error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
