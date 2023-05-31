from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Liked_event(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='liked_events'
    )
    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=False)
    image = models.URLField(validators=[URLValidator()])