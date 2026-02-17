from django.db import transaction
from django.contrib.auth import authenticate
from .models import User, Parent, Child, Image, Contact
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['pk'] = user.pk
        token['email'] = user.email
        # token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser

        return token

    # username_field = 'identifier'
    # def validate(self, attrs):
    #     identifier = attrs.get('identifier')
    #     password = attrs.get('password')

    #     user = authenticate(
    #         identifier=identifier,
    #         password=password
    #     )

    #     if not user:
    #         raise AuthenticationFailed('Invalid credentials.')

    #     refresh = self.get_token(user)

    #     return {
    #         'refresh': str(refresh),
    #         'access': str(refresh.access_token),
    #     }
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'is_staff', 
            'is_superuser', 
        ]

class ParentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = [
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'birthday',
            'phone',
            'gender',
            'house',
            'street',
            'barangay',
            'subdivision',
            'city',
            'province',
            'reason',
            'is_verified',
        ]

class CreateAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'is_superuser']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if any(char.isspace() for char in data['password']):
            raise serializers.ValidationError({
                'password': 'Password cannot contain whitespace.'
            })

        return data

    def create(self, validated_data):
        is_superuser = validated_data.pop('is_superuser', False)
        if is_superuser:
            return User.objects.create_superuser(**validated_data)

        return User.objects.create_staff(**validated_data)

class DeleteParentSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=180, 
        write_only=True
    )
    password_confirmation = serializers.CharField(
        max_length=180, 
        write_only=True
    )

    def validate(self, data):
        pk = self.context.get('pk')

        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'pk': 'User does not exist.'
            })

        if not user.check_password(data['password']):
            raise serializers.ValidationError({
                'password': 'Invalid password.'
            })

        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })

        data['user'] = user
        return data

class EmailPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password_confirmation = serializers.CharField(
        max_length=180, 
        write_only=True
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirmation']
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirmation': {'write_only': True},
        }
    
    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })

        if any(char.isspace() for char in data['password']):
            raise serializers.ValidationError({
                'password': 'Password cannot contain whitespace.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        return User.objects.create_user(**validated_data)

class ChangeEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

    def validate(self, data):
        instance = self.instance

        if User.objects.filter(username=data['email']).exists():
            raise serializers.ValidationError({
                'email': 'Email already exists.'
            })

        if instance.is_staff:
            raise serializers.ValidationError({
                'is_staff': 'User is admin.'
            })

        return data

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class ChangeUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

    def validate(self, data):
        instance = self.instance

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({
                'username': 'Username already exists.'
            })

        if instance.email:
            raise serializers.ValidationError({
                'email': 'User is parent.'
            })

        if any(char.isspace() for char in data['username']):
            raise serializers.ValidationError({
                'username': 'Username cannot contain whitespace.'
            })

        return data

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class ChangePasswordSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(
        max_length=180, 
        write_only=True
    )

    class Meta:
        model = User
        fields = ['password', 'password_confirmation']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })

        if any(char.isspace() for char in data['password']):
            raise serializers.ValidationError({
                'password': 'Password cannot contain whitespace.'
            })

        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.set_password(password)
        instance.save()
        return instance

class AdminChangePasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        pk = self.context.get('pk')
        instance = self.instance

        user = User.objects.get(pk=pk)

        if user.is_superuser:
            ...
        elif instance.is_staff:
            raise serializers.ValidationError({
                'is_superuser': 'Not enough privelege.'
            })

        if any(char.isspace() for char in data['password']):
            raise serializers.ValidationError({
                'password': 'Password cannot contain whitespace.'
            })

        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.set_password(password)
        instance.save()
        return instance

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image', 'image_type', 'parent']

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = [
            'id',
            'first_name', 
            'middle_name',
            'last_name',
            'suffix',
            'birthday',
            'phone',
            'gender',
            'house',
            'street',
            'barangay',
            'subdivision',
            'city',
            'province',
            'reason',
            'user',
            'uuid',
            'is_verified'
        ]
        extra_kwargs = {'user': {'read_only': True}}

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'phone',
            'parent',
        ]
        extra_kwargs = {'parent': {'read_only': True}}

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
        
        contact_data = {
            'first_name': request.data.get('contact_first_name'),
            'middle_name': request.data.get('contact_middle_name'),
            'last_name': request.data.get('contact_last_name'),
            'suffix': request.data.get('contact_suffix'),
            'phone': request.data.get('contact_phone'),
        }

        parent_data = request.data
        images = request.FILES

        user_serializer = EmailPasswordSerializer(data=user_data)
        parent_serializer = ParentSerializer(data=parent_data)
        contact_serializer = ContactSerializer(data=contact_data)

        if not user_serializer.is_valid():
            errors['user'] = user_serializer.errors

        if not parent_serializer.is_valid():
            errors['parent'] = parent_serializer.errors

        if not contact_serializer.is_valid():
            errors['contact'] = contact_serializer.errors

        if 'id' not in images or 'signature' not in images:
            errors['images'] = 'ID and signature are required.'

        if errors:
            raise serializers.ValidationError(errors)

        data['user_serializer'] = user_serializer
        data['parent_serializer'] = parent_serializer
        data['contact_serializer'] = contact_serializer
        return data

    def create(self, validated_data):
        request = self.context['request']

        with transaction.atomic():
            user = validated_data['user_serializer'].save()
            parent = validated_data['parent_serializer'].save(user=user)
            contact = validated_data['contact_serializer'].save(parent=parent)

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

        response = {
            'user': {
                'id': user.id,
                'email': user.email,
            },
            'parent': {
                'id': parent.id,
                'first_name': parent.first_name,
                'middle_name': parent.middle_name,
                'last_name': parent.last_name,
                'suffix': parent.suffix,
                'birthday': parent.birthday,
                'phone': str(parent.phone),
                'gender': parent.gender,
                'house': parent.house,
                'street': parent.street,
                'barangay': parent.barangay,
                'subdivision': parent.subdivision,
                'city': parent.city,
                'province': parent.province,
                'reason': parent.reason,
                'uuid': parent.uuid,
            },
            'contact': {
                'first_name': contact.first_name,
                'middle_name': contact.middle_name,
                'last_name': contact.last_name,
                'suffix': contact.suffix,
                'phone': str(contact.phone),
            }
        }

        return response

class ChangeInfoSerializer(serializers.Serializer):
    def validate(self, data):
        request = self.context['request']
        errors = {}

        parent_data = request.data
        # images = request.FILES

        parent_serializer = ParentSerializer(data=parent_data)

        if not parent_serializer.is_valid():
            errors['parent'] = parent_serializer.errors

        # if 'id' not in images or 'signature' not in images:
        #     errors['images'] = 'ID and signature are required.'

        if errors:
            raise serializers.ValidationError(errors)

        data['parent_serializer'] = parent_serializer
        return data

    def update(self, instance, validated_data):
        request = self.context['request']
        parent_serializer = validated_data['parent_serializer']

        with transaction.atomic():
            parent_serializer.instance = instance
            parent = parent_serializer.save()

            files = request.FILES
            if 'id' in files:
                Image.objects.update_or_create(
                    parent=parent,
                    image_type='id',
                    image=files['id']
                )

            if 'signature' in files:
                Image.objects.update_or_create(
                    parent=parent,
                    image_type='id',
                    image=files['signature']
                )

        return parent

class ChangeVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ['is_verified']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class ChildSerializer(serializers.Serializer):
    class Meta:
        model = Child
        fields = [
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'birthday',
            'gender',
            'is_incapable',
            'parent',
        ]
