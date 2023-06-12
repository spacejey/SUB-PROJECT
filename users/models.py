from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

# Create your models here.
class User(AbstractUser):
    #liked_event(manyToMany)
    
    #bought_event(manyToMany)

    email = models.CharField(max_length=50)
    profile_image = models.URLField(validators=[URLValidator()])
