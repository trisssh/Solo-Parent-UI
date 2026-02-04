from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import check_password
from .models import User, Parent, Child, Image
from .serializers import UserSerializer, ParentSerializer, ChildSerializer, ImageSerializer, RegistrationSerializer, DeleteAccountSerializer, MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
# class ParentView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def get(self, request):
#         parents = Parent.objects.all()
#         serializer = ParentSerializer(
#             parents, 
#             many=True
#         ).data
#         return Response(serializer, status=status.HTTP_200_OK)

#     def post(self, request):
#         data = request.data
#         email = data.get('email')
#         password = data.get('password')
#         password_confirmation = data.get('password_confirmation')

#         if password != password_confirmation:
#             errors = {'password_confirmation': ['Passwords are not similar.']}
#             return Response(
#                 errors,
#                 status=status.HTTP_400_BAD_REQUEST                
#             )

#         user_serializer = UserSerializer(data={
#             'email': email,
#             'password': password
#         })
#         if not user_serializer.is_valid():
#             return Response(
#                 user_serializer.errors, 
#                 status=status.HTTP_400_BAD_REQUEST
#         )

#         parent_serializer = ParentSerializer(data=data)
#         if parent_serializer.is_valid():
#             user = user_serializer.save()
#             parent = parent_serializer.save(user=user)
#             print(parent, type(parent), getattr(parent, "pk", None))

#             id_data = {
#                 'image': request.FILES.get('id'),
#                 'image_type': 'id',
#                 'parent': parent.id,
#             }
#             image_serializer = ImageSerializer(data=id_data)

#             if image_serializer.is_valid():
#                 image_serializer.save()
#             else:
#                 return Response(
#                     image_serializer.errors, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             signature_data = {
#                 'image': request.FILES.get('signature'),
#                 'image_type': 'signature',
#                 'parent': parent.id,
#             }
#             image_serializer = ImageSerializer(data=signature_data)

#             if image_serializer.is_valid():
#                 image_serializer.save()
#             else:
#                 return Response(
#                     image_serializer.errors, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             return Response(
#                 parent_serializer.data, 
#                 status=status.HTTP_201_CREATED
#             )
#         else:
#             return Response(
#                 parent_serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
# class LoginView(APIView):
#     def post(self, request):
#         data = request.data
#         email = data['email']
#         password = data['password']

#         try:
#             User.objects.get(email=email)
            
#             if check_password(password, )
#         except User.DoesNotExist:
#             return Response(email, status=status.HTTP_400_BAD_REQUEST)

class RegistrationView(GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        data = request.data
        images = []

        if 'id' in request.FILES:
            images.append({
                'image': request.FILES['id'], 
                'image_type': 'id'
            })
        if 'signature' in request.FILES:
            images.append({
                'image': request.FILES['signature'], 
                'image_type': 'signature'
            })

        data['images'] = images

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                parent = serializer.save()
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        response_data = {
            "user": {
                "id": parent.user.id,
                "email": parent.user.email,
            },
            "parent": {
                "id": parent.id,
                "first_name": parent.first_name,
                "last_name": parent.last_name,
            },
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

class DeleteUserView(APIView):
    def delete(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeleteAccountView(GenericAPIView):
    serializer_class = DeleteAccountSerializer
    
    def post(self, request, pk):
        data = request.data
        data['pk'] = pk
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        try:
            user.delete()
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(status=status.HTTP_204_NO_CONTENT)