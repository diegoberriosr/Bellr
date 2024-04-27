# Generated by Django 4.0 on 2024-02-24 14:02

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('directmessages', '0002_alter_message_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='active_users',
            field=models.ManyToManyField(related_name='active_conversations', to=settings.AUTH_USER_MODEL),
        ),
    ]