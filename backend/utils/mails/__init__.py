import os
from typing import List, Dict, Any
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_email(template_name: str, subject: str, to: List[str], params: Dict[str, Any]) -> None:
    """
    Sends an email using a specified template.

    :param template_name: The base name of the template (without extension).
    :param subject: The subject of the email.
    :param to: The recipients' email address.
    :param params: A dictionary containing the parameters to be rendered in the template.
    """
    use_html = os.path.exists(os.path.join('templates', f'{template_name}.html'))
    if not os.path.exists(os.path.join('templates', f'{template_name}.txt')):
        return  # return silently
    html_content = render_to_string(f'{template_name}.html', params)
    text_content = render_to_string(f'{template_name}.txt', params)

    email = EmailMultiAlternatives(
        subject, 
        text_content, 
        settings.DEFAULT_FROM_EMAIL, 
        to
    )
    if use_html:
        email.attach_alternative(html_content, "text/html")

    email.send()
