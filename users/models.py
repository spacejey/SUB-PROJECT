from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

# Create your models here.
class User(AbstractUser):
    email = models.CharField(max_length=50)
    profile_image = models.URLField(validators=[URLValidator()])
    bought = models.ManyToManyField('bought_events.Bought_event', related_name='user', blank=True)
    liked = models.ManyToManyField('liked_events.Liked_event', related_name='user', blank=True)