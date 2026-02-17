import environ
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

env = environ.Env()
env.read_env()

def send_password_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"{env('FRONTEND_URL')}api/user/reset-password-confirm/{uid}/{token}"

    context = {'email': user.email, 'reset_url': reset_url}

    text_content = render_to_string(
        'emails/password_reset_email.txt', 
        context=context
    )
    html_content = render_to_string(
        'emails/password_reset_email.txt', 
        context=context
    )
    subject = 'Password Reset'

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=env('EMAIL_HOST_USER'),
        to=[user.email],
        headers={
            'Solo-Parent-System-Email': f"<mailto:{env('EMAIL_HOST_USER')}"
        }
    )

    message.attach_alternative(html_content, 'text/html')
    message.send()