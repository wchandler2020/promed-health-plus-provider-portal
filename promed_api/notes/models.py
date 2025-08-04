from django.db import models
from provider_auth.models import User

# Create your models here.
class Notes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    body = models.TextField(name='text_body')
    date_create = models.DateTimeField(auto_now_add=True)
    data_updated = models.DateTimeField(auto_now=True)

    
    def __str__(self):
        return str(f'{self.user} | {self.title}')
