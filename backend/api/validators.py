from django.core.exceptions import ValidationError
from rest_framework import serializers

class PasswordValidator:
    def validate(self, password, password_confirmation, user=None):
        if password != password_confirmation:
            raise serializers.ValidationError({
                'password_confirmation': 'Passwords do not match.'
            })

        if any(char.isspace() for char in password):
            raise serializers.ValidationError({
                'password': 'Password cannot contain whitespace.'
            })
    
    def get_help_text(self) :
        return 'Password cannot contain whitespace.'