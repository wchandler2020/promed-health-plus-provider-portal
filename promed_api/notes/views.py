from django.shortcuts import render
from rest_framework import generics, permissions
from notes import serializers as api_serializers
from notes import models as api_models

class NotesView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = api_serializers.NotesSerializers
    
    def get_queryset(self):
        return api_models.Notes.objects.filter(user=self.request.user)
    
    
        
        
