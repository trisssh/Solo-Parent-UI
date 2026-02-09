from django.db.models import Q
from django.contrib.auth.backends import BaseBackend
from .models import User

class EmailOrUsernameBackend(BaseBackend):
    def authenticate(self, request, identifier=None, password=None, **kwargs):
        if not identifier or not password:
            return None
        
        user = User.objects.filter(
            Q(email=identifier) | Q(username=identifier)
        ).first()

        if user and user.check_password(password):
            return user
        return None