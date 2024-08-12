import os
from typing import List
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_email(template_name, subject, to: List, params):
    """
    Sends an email using a specified template.

    :param template_name: The base name of the template (without extension).
    :param subject: The subject of the email.
    :param to: The recipients' email address.
    :param params: A dictionary containing the parameters to be rendered in the template.
    """
    html_content = render_to_string(f'{template_name}.html', params)
    text_content = render_to_string(f'{template_name}.txt', params)

    email = EmailMultiAlternatives(
        subject, 
        text_content, 
        settings.DEFAULT_FROM_EMAIL, 
        to
    )
    email.attach_alternative(html_content, "text/html")

    email.send()
