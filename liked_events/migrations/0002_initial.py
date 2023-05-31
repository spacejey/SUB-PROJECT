# Generated by Django 4.2.1 on 2023-05-31 11:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('liked_events', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='liked_event',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liked_events', to=settings.AUTH_USER_MODEL),
        ),
    ]
