from django.db import models
from django.conf import settings


choices = (
    ('pending', 'Pending'),
    ('completed', 'Completed'),
)
# Create your models here.
class Task(models.Model):
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.FileField(upload_to='task_docs/')
    status = models.CharField(max_length=50, choices=choices, default='pending')
    title = models.CharField(max_length=255, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title or 'Task'} for {self.provider}"