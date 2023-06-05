from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Bought_event(models.Model):

    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=False)
    image = models.URLField(validators=[URLValidator()])
    text = models.CharField(max_length=2000)