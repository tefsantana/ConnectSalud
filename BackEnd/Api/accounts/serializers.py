from rest_framework import serializers
from .models import Citas
from django.contrib.auth import get_user_model

User = get_user_model()


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user

# Api Citas

from accounts.models import Citas

class CitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citas
        fields = ['id_paciente','dni', 'nombre', 'apellido', 'telefono', 'correo', 'profesional', 'fecha', 'hora', 'mensaje', 'fecha_registro']

    def validate(self, attrs):
        fecha = attrs.get('fecha')
        hora = attrs.get('hora')
        profesional = attrs.get('profesional')

        queryset = Citas.objects.filter(fecha=fecha, hora=hora, profesional=profesional)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError({'hora': 'El horario seleccionado ya fue reservado para esa profesional en esa fecha.'})

        return attrs

# Lista de Usuarios 

class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_superuser', 'is_staff', 'date_joined', 'last_login']

# Perfil de Usuario

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_staff', 'is_superuser']


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=150)
    message = serializers.CharField(max_length=2000)