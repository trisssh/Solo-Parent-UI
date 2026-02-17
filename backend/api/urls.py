from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistrationView, DeleteUserView, DeleteParentView, MyTokenObtainPairView, ChangeEmailView, ChangePasswordView, CreateAdminView, ChangeUsernameView, AdminChangeEmailView, SuperadminChangeUsernameView, AdminChangePasswordView, ParentInfoView, AdminStatisticsView, ChangeInfoView, ParentListView, AdminListView, ChangeVerificationView, AdminChangeParentInfoView, PasswordResetEmailView, PasswordResetConfirmView

urlpatterns = [
    # login
    path('token', MyTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    # path('parents', ParentView.as_view(), name='show_parents'),
    # register
    path('parent/create', RegistrationView.as_view(), name='create_parent'),
    # parent change info (might delete)
    path(
        'parent/edit/<int:pk>', 
        ChangeInfoView.as_view(), 
        name='edit_parent'
    ),
    # parent delete own account
    path(
        'parent/delete/<int:pk>', 
        DeleteParentView.as_view(),
        name='delete_parent'
    ),
    # parent dashboard
    path('parent/info/<int:pk>', ParentInfoView.as_view(), name='info_parent'),
    # list/table of parents for admins
    path('parent/list', ParentListView.as_view(), name='list_parent'),
    # admin delete parent account
    path('user/delete/<int:pk>', DeleteUserView.as_view(), name='delete_user'),
    # parent change own email
    path('user/email/<int:pk>', ChangeEmailView.as_view(), name='change_email'),
    # admin change own username
    path(
        'user/username/<int:pk>', 
        ChangeUsernameView.as_view(), 
        name='change_username'
    ),
    # admins and parents change password
    path(
        'user/password/<int:pk>', 
        ChangePasswordView.as_view(), 
        name='change_password'
    ),
    # admins* and parents reset password email
    path(
        'user/reset-password-request', 
        PasswordResetEmailView.as_view(), 
        name='reset_password_request'
    ),
    # admins* and parents reset password confirm
    path(
        'user/reset-password-confirm/<str:uid>/<str:token>', 
        PasswordResetConfirmView.as_view(), 
        name='reset_password_confirm'
    ),
    # superadmin create admins
    path('admin/create', CreateAdminView.as_view(), name='create_admin'),
    # list/table of admins superadmin
    path('admin/list', AdminListView.as_view(), name='list_admin'),
    # admin and superadmin dashboard
    path(
        'admin/statistics', 
        AdminStatisticsView.as_view(), 
        name='statistics_admin'
    ),
    # admin change parent email
    path(
        'admin/parent/email/<int:pk>', 
        AdminChangeEmailView.as_view(), 
        name='admin_edit_email'
    ),
    # admin change parent info
    path(
        'admin/parent/info/<int:pk>', 
        AdminChangeParentInfoView.as_view(), 
        name='admin_edit_parent'
    ),
    # superadmin change admin username
    path(
        'superadmin/user/username/<int:pk>', 
        SuperadminChangeUsernameView.as_view(), 
        name='superadmin_edit_username'
    ),
    # admins change parent password
    path(
        'admin/user/password/<int:pk>', 
        AdminChangePasswordView.as_view(), 
        name='admin_edit_email'
    ),
    # send email when verifying/unverifying
    path(
        'admin/parent/send-email/<int:pk>',
        ChangeVerificationView.as_view(),
        name='admin_send_email'
    )
]