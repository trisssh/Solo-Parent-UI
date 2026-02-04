from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistrationView, DeleteUserView, DeleteAccountView, MyTokenObtainPairView

urlpatterns = [
    path('token', MyTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    # path('parents', ParentView.as_view(), name='show_parents'),
    path('parents/create', RegistrationView.as_view(), name='create_parent'),
    path(
        'parents/delete/<int:pk>', 
        DeleteUserView.as_view(), 
        name='delete_parent'
    ),
    path(
        'user/delete/<int:pk>',
        DeleteAccountView.as_view(),
        name='delte_user'
    )
]