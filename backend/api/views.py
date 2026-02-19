import datetime
from django.db import transaction
from django.db.models import Avg, Q, F, Count, Sum, FloatField, ExpressionWrapper
from django.db.models.functions import ExtractYear
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import UserPassesTestMixin
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status, filters
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import check_password
from .models import User, Parent, Child, Image
from .serializers import AdminChangePasswordSerializer, ChangeEmailSerializer, ChangeInfoSerializer, ChangePasswordSerializer, ChangeUsernameSerializer, ChangeVerificationSerializer, ChildInfoSerializer, CreateAdminSerializer, DeleteParentSerializer, ParentInfoSerializer, UserSerializer, ParentSerializer, ChildSerializer, ImageSerializer, RegistrationSerializer, MyTokenObtainPairSerializer
from .utils.emailer import emailer
from .utils.send_password_reset_email import send_password_reset_email

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

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
                response = serializer.save()
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )


        return Response(response, status=status.HTTP_201_CREATED)

class ChangeInfoView(GenericAPIView):
    serializer_class = ChangeInfoSerializer
    permission_classes = [IsAuthenticated]
    
    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != user.pk:
            raise PermissionDenied('You are not this User.')

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

        parent = get_object_or_404(Parent, user_id=self.request.user.pk)
        serializer = self.get_serializer(parent, data=data)
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
            "parent": {
                "id": parent.id,
                "first_name": parent.first_name,
                "last_name": parent.last_name,
            },
        }

        return Response(response_data, status=status.HTTP_200_OK)

# class AdminChangeInfoView()

class ParentInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != user.pk:
            raise PermissionDenied('You are not this User.')
        
        parent = get_object_or_404(Parent, user_id=self.request.user.pk)
        parent_serializer = ParentSerializer(parent, many=False)
        image = Image.objects.filter(parent_id=parent_serializer.data['id'])
        image_serializer = ImageSerializer(image, many=True) 

        data = {
            'parent': parent_serializer.data,
            'image': image_serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)

class ParentListView(ListAPIView):
    queryset = Parent.objects.all().order_by('last_name')
    permission_classes = [IsAuthenticated]
    serializer_class = ParentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['uuid', 'last_name']

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        else:
            raise PermissionDenied('Admins only.')

class AdminListView(ListAPIView):
    queryset = User.objects.filter(is_staff=True)
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['email']

    def get_queryset(self):
        if self.request.user.is_superuser:
            excluded_queryset = self.queryset.exclude(
                username=self.request.user.username
            ).order_by('id')
            return excluded_queryset
        else:
            raise PermissionDenied('Superadmin only.')

class AdminStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        if self.request.user.is_staff:
            current_year = datetime.date.today().year
            single_parents = Parent.objects.aggregate(
                male_count=Count('id', filter=Q(gender='male')),
                female_count=Count('id', filter=Q(gender='female')),
                parents_count=Count('id'),
                average_age=Avg(current_year - ExtractYear('birthday')),
            )

            single_parents_by_barangay = (
                Parent.objects.values('barangay')
                .annotate(count=Count('id'))
            )
            total_single_parents = (single_parents_by_barangay.aggregate(
                total=Sum('count')
            ))['total']
            single_parents_by_barangay = (
                single_parents_by_barangay.annotate(
                    male_count=Count('id', filter=Q(gender='male')),
                    female_count=Count('id', filter=Q(gender='female')),
                    average_age=Avg(current_year - ExtractYear('birthday')),
                    share_of_total=ExpressionWrapper(
                        F('count') / total_single_parents,
                        output_field=FloatField(),
                    ),
                )
            ) 

        if self.request.user.is_superuser:
            admins = User.objects.filter(
                is_staff=True, 
                is_superuser=False
            ).count()

            superadmins = User.objects.filter(
                is_staff=True,
                is_superuser=True
            ).count()

        data = {
            'single_parents': single_parents,
            'single_parents_by_barangay': single_parents_by_barangay,
        }

        if self.request.user.is_superuser:
            data.update({'admins': admins, 'superadmins': superadmins})

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
        user = get_object_or_404(User, pk=pk)

        if self.request.user.pk != user.pk:
            raise PermissionDenied('You are not this User.')

        serializer = DeleteParentSerializer(
            data=request.data,
            context={'pk': self.request.user.pk}
        )

        if serializer.is_valid():
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

        if self.request.user.pk != user.pk:
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

class ChangeVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        parent = get_object_or_404(Parent, user_id=pk)
        serializer = ChangeVerificationSerializer(parent, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            parent = serializer.instance
            
            emailer(
                parent.is_verified,
                parent,
                request.data.get('remarks'),
            )
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

        if user.is_superuser:
            raise PermissionDenied('Admins may only change user passwords.')
            
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

class AdminChangeParentInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        parent = get_object_or_404(Parent, pk=pk)

        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        serializer = ParentInfoSerializer(
            parent,
            data=request.data
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

        if self.request.user.pk != user.pk:
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

        if self.request.user.pk != user.pk:
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

class PasswordResetEmailView(APIView):
    def post(self, request):
        user = get_object_or_404(User, email=request.data.get('email'))

        if user:
            send_password_reset_email(user)

        return Response(status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    def post(self, request, uid, token):
        try:
            uid = urlsafe_base64_decode(uid).decode()
        except Exception as e:
            return Response({'uid': e}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, pk=uid)

        if not default_token_generator.check_token(user, token):
            return Response(
                {'token': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChangePasswordSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateChildView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if self.request.user.is_staff:
            raise PermissionDenied('Parents only.')

        parent = get_object_or_404(Parent, user_id=self.request.user.pk)
        serializer = ChildSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(parent=parent)
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ChangeChildView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        child = get_object_or_404(Child, pk=pk)
        parent = get_object_or_404(Parent, pk=child.parent_id)

        if self.request.user.pk != parent.user_id:
            raise PermissionDenied('You are not the Parent.')

        if self.request.user.is_staff:
            raise PermissionDenied('Parents only.')

        serializer = ChildSerializer(child, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteChildView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        child = get_object_or_404(Child, pk=pk)
        parent = get_object_or_404(Parent, pk=child.parent_id)

        if self.request.user.pk != parent.user_id:
            raise PermissionDenied('You are not the Parent.')

        if self.request.user.is_staff:
            raise PermissionDenied('Parents only.')

        child.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminChangeChildView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        child = get_object_or_404(Child, pk=pk)

        serializer = ChildInfoSerializer(child, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminDeleteChildView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if not self.request.user.is_staff:
            raise PermissionDenied('Admins only.')

        child = get_object_or_404(Child, pk=pk)

        child.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChildListView(ListAPIView):
    queryset = Child.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChildInfoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['last_name', 'first_name', 'middle_name']

    def get_queryset(self):
        parent = get_object_or_404(Parent, user_id=self.request.user.pk)

        if not self.request.user.is_staff:
            excluded_queryset = self.queryset.filter(
                parent_id=parent.pk
            ).order_by('id')
            return excluded_queryset
        else:
            raise PermissionDenied('Parents only.')

class AdminChildListView(ListAPIView):
    queryset = Child.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChildInfoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['last_name', 'first_name', 'middle_name']

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        parent = get_object_or_404(Parent, user_id=pk)

        if self.request.user.is_staff:
            excluded_queryset = self.queryset.filter(
                parent_id=parent.pk
            ).order_by('id')
            return excluded_queryset
        else:
            raise PermissionDenied('Admins only.')