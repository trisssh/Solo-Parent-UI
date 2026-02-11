import environ
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

env = environ.Env()
environ.Env.read_env()

def emailer(
    is_verified, 
    email, 
    last_name, 
    first_name, 
    middle_name, 
    city, 
    province,
    suffix=None,
    remarks=None,
):
    context={
        'last_name': last_name,
        'first_name': first_name,
        'middle_name': middle_name,
        'suffix': suffix,
        'city': city,
        'province': province,
        'remarks': remarks,
    }

    text_content = render_to_string(
        is_verified and 
            'templates/emails/verified_email.txt' or 
            'templates/emails/unverified_email.txt',
        context=context
    )
    html_content = render_to_string(
        is_verified and 
            'templates/emails/verified_email.html' or 
            'templates/emails/unverified_email.html',
        context=context
    )
    subject = is_verified and \
        'Successful solo parent registration' or \
        'Unsuccessful solo parent registration'

    message = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email=env('EMAIL_HOST_USER'),
        to=[email],
        headers={
            'Solo-Parent-System-Email': f"<mailto:{env('EMAIL_HOST_USER')}"
        }
    )

    message.attach_alternative(html_content, 'text/html')
    message.send()