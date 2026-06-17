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
        extra_kwargs = {
            'dni': {
                'error_messages': {
                    'max_length': 'El DNI debe tener como maximo 8 digitos.',
                    'blank': 'El DNI es obligatorio.',
                }
            },
            'telefono': {
                'error_messages': {
                    'max_length': 'El telefono debe tener como maximo 10 digitos.',
                    'blank': 'El telefono es obligatorio.',
                }
            }
        }

    def validate_dni(self, value):
        dni = (value or '').strip()

        if not dni.isdigit() or len(dni) < 7 or len(dni) > 8:
            raise serializers.ValidationError('El DNI debe tener 7 u 8 digitos numericos.')

        return dni

    def validate_telefono(self, value):
        telefono = (value or '').strip()

        if not telefono.isdigit() or len(telefono) > 10:
            raise serializers.ValidationError('El telefono debe tener hasta 10 digitos numericos.')

        return telefono

    def validate(self, attrs):
        fecha = attrs.get('fecha', getattr(self.instance, 'fecha', None))
        hora = attrs.get('hora', getattr(self.instance, 'hora', None))
        profesional = (attrs.get('profesional', getattr(self.instance, 'profesional', '')) or '').strip()

        if not fecha or not hora or not profesional:
            return attrs

        hora_normalizada = hora.replace(second=0, microsecond=0)
        attrs['hora'] = hora_normalizada
        attrs['profesional'] = profesional

        queryset = Citas.objects.filter(
            fecha=fecha,
            hora=hora_normalizada,
        )
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError({'hora': 'El horario seleccionado ya fue reservado para esa fecha.'})

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