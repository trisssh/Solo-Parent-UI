import environ
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

env = environ.Env()
environ.Env.read_env()

def emailer(
    is_verified, 
    parent,
    remarks=None,
):
    context={
        'last_name': parent.last_name,
        'first_name': parent.first_name,
        'middle_name': parent.middle_name,
        'suffix': parent.suffix,
        'city': parent.city,
        'province': parent.province,
        'remarks': remarks,
    }

    text_content = render_to_string(
        is_verified and 
            'emails/verified_email.txt' or 
            'emails/unverified_email.txt',
        context=context
    )
    html_content = render_to_string(
        is_verified and 
            'emails/verified_email.html' or 
            'emails/unverified_email.html',
        context=context
    )
    subject = is_verified and \
        'Successful solo parent registration' or \
        'Unsuccessful solo parent registration'

    message = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email=env('EMAIL_HOST_USER'),
        to=[parent.user.email],
        headers={
            'Solo-Parent-System-Email': f"<mailto:{env('EMAIL_HOST_USER')}"
        }
    )

    message.attach_alternative(html_content, 'text/html')
    message.send()