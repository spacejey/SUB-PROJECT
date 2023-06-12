from django.db import models

# Create your models here.
class Memoir(models.Model):
    owner = models.ForeignKey('users.User' , on_delete=models.CASCADE , related_name='memoirs')
    event = models.ManyToManyField('events.Event' , related_name='memoir')
    text = models.CharField(max_length=2000)
