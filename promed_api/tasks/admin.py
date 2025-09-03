from django.contrib import admin
from .models import Task

# Register your models here.
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    display = ('id', 'provider', 'title', 'status')
    filter = ('status', 'provider')
    search_fields = ('title', 'provider_email')