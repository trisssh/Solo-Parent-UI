from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistrationView, DeleteUserView, DeleteParentView, MyTokenObtainPairView, ChangeEmailView, ChangePasswordView, CreateAdminView, ChangeUsernameView, AdminChangeEmailView, SuperadminChangeUsernameView, AdminChangePasswordView, ParentInfoView, AdminStatisticsView, ChangeInfoView

urlpatterns = [
    path('token', MyTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    # path('parents', ParentView.as_view(), name='show_parents'),
    path('parent/create', RegistrationView.as_view(), name='create_parent'),
    path(
        'parent/edit/<int:pk>', 
        ChangeInfoView.as_view(), 
        name='edit_parent'
    ),
    path(
        'parent/delete/<int:pk>', 
        DeleteParentView.as_view(),
        name='delete_parent'
    ),
    path('parent/info', ParentInfoView.as_view(), name='info_parent'),
    path('user/delete/<int:pk>', DeleteUserView.as_view(), name='delete_user'),
    path('user/email/<int:pk>', ChangeEmailView.as_view(), name='change_email'),
    path(
        'user/username/<int:pk>', 
        ChangeUsernameView.as_view(), 
        name='change_username'
    ),
    path(
        'user/password/<int:pk>', 
        ChangePasswordView.as_view(), 
        name='change_password'
    ),
    path('admin/create', CreateAdminView.as_view(), name='create_admin'),
    path(
        'admin/statistics', 
        AdminStatisticsView.as_view(), 
        name='statistics_admin'
    ),
    path(
        'admin/parent/email/<int:pk>', 
        AdminChangeEmailView.as_view(), 
        name='admin_edit_email'
    ),
    path(
        'superadmin/user/username/<int:pk>', 
        SuperadminChangeUsernameView.as_view(), 
        name='superadmin_edit_username'
    ),
    path(
        'admin/user/password/<int:pk>', 
        AdminChangePasswordView.as_view(), 
        name='admin_edit_email'
    ),
]