# Generated by Django 4.2.1 on 2023-06-05 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bought_events', '0003_remove_bought_event_user'),
        ('liked_events', '0003_remove_liked_event_user'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bought',
            field=models.ManyToManyField(blank=True, related_name='user', to='bought_events.bought_event'),
        ),
        migrations.AddField(
            model_name='user',
            name='liked',
            field=models.ManyToManyField(blank=True, related_name='user', to='liked_events.liked_event'),
        ),
    ]
