import environ
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

env = environ.Env()
environ.Env.read_env()

def emailer(
    reason, 
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

    match reason:
        case 'unverified':
            text = 'emails/unverified_email.txt'
            email = 'emails/unverified_email.html'
            subject = 'Unsuccessful solo parent registration'
        case 'verified':
            text = 'emails/verified_email.txt'
            email = 'emails/verified_email.html'
            subject = 'Successful solo parent registration'
        case 'deleted':
            text = 'emails/deleted_email.txt'
            email = 'emails/deleted_email.html'
            subject = 'Account deleted, insufficient information'

    text_content = render_to_string(text, context=context)
    html_content = render_to_string(email, context=context)

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