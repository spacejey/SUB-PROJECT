from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Event(models.Model):

    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=False)
    image = models.URLField(validators=[URLValidator()], blank = True)
    liked_by = models.ManyToManyField('users.User', related_name= 'liked' , blank = True)
    bought_by = models.ManyToManyField('users.User', related_name= 'bought' , blank = True)
    link = models.URLField(validators=[URLValidator()], blank = True)