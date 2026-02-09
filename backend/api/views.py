import datetime
from django.db import transaction
from django.db.models import Avg, F, Count
from django.db.models.functions import ExtractYear
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import check_password
from .models import User, Parent, Child, Image
from .serializers import AdminChangePasswordSerializer, ChangeEmailSerializer, ChangePasswordSerializer, ChangeUsernameSerializer, CreateAdminSerializer, DeleteParentSerializer, ParentInfoSerializer, UserSerializer, ParentSerializer, ChildSerializer, ImageSerializer, RegistrationSerializer, MyTokenObtainPairSerializer

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
        data = request.data.copy()
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

class ParentInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        parent = Parent.objects.get(user_id=self.request.user.pk)
        serializer = ParentInfoSerializer(parent, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if self.request.user.is_staff:
            parents_count = Parent.objects.all().count()

            current_year = datetime.date.today().year
            average_age_query = Parent.objects.aggregate(
            average_age=Avg(current_year - ExtractYear('birthday')) 
            )

            admins_count = User.objects.filter(
                is_staff=True, 
                is_superuser=False
            ).count()

            most_single_parents_barangays = (
                Parent.objects.values('barangay')
                .annotate(count=Count('barangay'))
                .order_by('-count', 'barangay')
                [:5]
            )

            males_count = Parent.objects.filter(gender='male').count()
            females_count = Parent.objects.filter(gender='female').count()



            data = {
                'parents_count': parents_count,
                'average_age_query': average_age_query['average_age'],
                'most_single_parents_barangays': most_single_parents_barangays,
                'admins_count': admins_count,
            }
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(data, status=status.HTTP_200_OK)


class DeleteUserView(APIView, UserPassesTestMixin):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        user = get_object_or_404(User, pk=pk)
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class DeleteParentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if self.request.user.pk != pk:
            raise PermissionDenied('You are not this User.')

        serializer = DeleteParentSerializer(
            data=request.data,
            context={'pk': pk}
        )

        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.delete()
        else:
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != pk:
            raise PermissionDenied('You are not this User.')
            
        serializer = ChangeEmailSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')
            
        serializer = ChangeEmailSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')
            
        serializer = AdminChangePasswordSerializer(
            user, 
            data=request.data,
            context={'pk': self.request.user.pk}
        )

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class SuperadminChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if not self.request.user.is_superuser:
            raise PermissionDenied('Superuser only.')
            
        serializer = ChangeUsernameSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class ChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != pk:
            raise PermissionDenied('You are not this User.')
            
        serializer = ChangeUsernameSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != pk:
            raise PermissionDenied('You are not this User.')
            
        serializer = ChangePasswordSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not self.request.user.is_superuser:
            raise PermissionDenied('Superadmin only.')
        
        serializer = CreateAdminSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)