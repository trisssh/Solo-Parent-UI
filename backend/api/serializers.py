from django.db import transaction
from .models import User, Parent, Child, Image
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['id'] = user.id
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser

        return token
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'password', 
            'is_staff', 
            'is_superuser', 
            'created_at', 
            'updated_at',
        ]

class DeleteAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=180, write_only=True)
    password_confirmation = serializers.CharField(
        max_length=180, 
        write_only=True
    )

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })

        try:
            user = User.objects.get(id=data['pk'])
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'pk': 'User does not exist.'
            })

        if not user.email == data['email']:
            raise serializers.ValidationError({
                'email': 'Invalid email credential.'
            })

        if not user.check_password(data['password']):
            raise serializers.ValidationError({
                'password': 'Invalid password credential.'
            })

        data['user'] = user
        return data
        

class EmailPasswordSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(
        max_length=180, 
        write_only=True
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirmation']
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        return User.objects.create_user(**validated_data)

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

class RegistrationSerializer(serializers.Serializer):
    # only fields that are NOT model-backed
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context['request']
        errors = {}

        user_data = {
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            'password_confirmation': request.data.get('password_confirmation'),
        }

        parent_data = request.data
        images = request.FILES

        user_serializer = EmailPasswordSerializer(data=user_data)
        parent_serializer = ParentSerializer(data=parent_data)

        if not user_serializer.is_valid():
            errors['user'] = user_serializer.errors

        if not parent_serializer.is_valid():
            errors['parent'] = parent_serializer.errors

        if 'id' not in images or 'signature' not in images:
            errors['images'] = 'ID and signature are required.'

        if errors:
            raise serializers.ValidationError(errors)

        data['user_serializer'] = user_serializer
        data['parent_serializer'] = parent_serializer
        return data

    def create(self, validated_data):
        request = self.context['request']

        with transaction.atomic():
            user = validated_data['user_serializer'].save()
            parent = validated_data['parent_serializer'].save(user=user)

            Image.objects.create(
                parent=parent,
                image=request.FILES['id'],
                image_type='id'
            )
            Image.objects.create(
                parent=parent,
                image=request.FILES['signature'],
                image_type='signature'
            )

        return parent

class ChildSerializer(serializers.Serializer):
    class Meta:
        model = Child
        fields = [
            'id'
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'birthday',
            'age',
            'gender',
            'is_incapable',
            'parent',
        ]

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id',
            'image', 
            'image_type', 
            'created_at', 
            'updated_at', 
            'parent',
        ]
        extra_kwargs = {'parent': {'read_only': True}}