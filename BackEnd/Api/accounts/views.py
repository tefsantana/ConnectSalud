from django.shortcuts import get_object_or_404

# Create your views here.

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, CitasSerializer, ContactMessageSerializer, ListUserSerializer
from django.contrib.auth import login

from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


# Api Citas

from .models import Citas
from rest_framework import viewsets 

# Create your views here.

class CitasViewSet(viewsets.ModelViewSet):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer


class AdminCitasListAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = Citas.objects.all().order_by('fecha', 'hora')

        profesional = request.query_params.get('profesional')
        day = request.query_params.get('day')

        if profesional:
            queryset = queryset.filter(profesional__iexact=profesional)

        if day:
            try:
                day_number = int(day)
                if 1 <= day_number <= 31:
                    queryset = queryset.filter(fecha__day=day_number)
            except ValueError:
                return Response(
                    {'detail': 'El filtro day debe ser un numero entre 1 y 31.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = CitasSerializer(queryset, many=True)
        return Response(serializer.data)

# Lista de Usuarios

class ListUser(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk=None):
        if pk is not None:
            user = get_object_or_404(User, pk=pk)
            serializer = ListUserSerializer(user)
            return Response(serializer.data)
        else:
            users = User.objects.all()
            serializer = ListUserSerializer(users, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        serializer = ListUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = ListUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    
    def delete(self, request, pk):
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Perfil de Usuario

from rest_framework import generics, permissions
from .serializers import UserSerializer

class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Team API

class TeamListAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        team_data = [
            {
                "id": 1,
                "name": "Lic. Carla Gómez",
                "matricula": "4356",
                "image": "/assets/img/Lic. Carla Gomez.png"
            },
            {
                "id": 2,
                "name": "Lic. Marianela Flores",
                "matricula": "5623",
                "image": "/assets/img/Lic. Marianela Flores.jpg"
            },
            {
                "id": 3,
                "name": "Lic. Yanella Tobares",
                "matricula": "5986",
                "image": "/assets/img/Lic. Yanella Tobares.jpg"
            }
        ]
        return Response(team_data)


class PlanListAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        plans_data = [
            {
                "id": 1,
                "name": "Básico",
                "price": 8000,
                "period": "/mes",
                "featured": False,
                "features": [
                    "Acceso a la plataforma",
                    "10 consultas por mes",
                    "Comunicación por email",
                    "Acceso al centro de ayuda"
                ]
            },
            {
                "id": 2,
                "name": "Intermedio",
                "price": 15000,
                "period": "/mes",
                "featured": True,
                "badge": "Más elegido",
                "features": [
                    "Acceso a la plataforma",
                    "20 consultas por mes",
                    "Comunicación por email y mensajes",
                    "Acceso al centro de ayuda"
                ]
            },
            {
                "id": 3,
                "name": "Intensivo",
                "price": 30000,
                "period": "/mes",
                "featured": False,
                "features": [
                    "Acceso total a la plataforma",
                    "Consultas ilimitadas",
                    "Comunicación en tiempo real",
                    "Acceso al centro de ayuda 24 horas"
                ]
            }
        ]

        return Response(plans_data)


class ContactMessageAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Placeholder for persistence/email integration.
        return Response(
            {"detail": "Mensaje recibido correctamente."},
            status=status.HTTP_201_CREATED,
        )
