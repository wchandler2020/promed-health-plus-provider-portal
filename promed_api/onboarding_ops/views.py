# onboarding_ops/views.py

from rest_framework import generics, permissions
from onboarding_ops import models as api_models
from onboarding_ops import serializers as api_serializers
from rest_framework.response import Response
from django.http import FileResponse, HttpResponseNotFound
from django.core.files.base import File
from django.views.decorators.clickjacking import xframe_options_exempt
from .pdf_utils import fill_pdf, TEMPLATES
from patients.models import Patient
from .models import ProviderForm
from .pdf_utils import fill_pdf
from django.conf import settings
import uuid
import os

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ProviderFormListCreate(generics.ListCreateAPIView):
    serializer_class = api_serializers.ProviderFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return api_models.ProviderForm.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProviderFormDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializers.ProviderFormSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return api_models.ProviderForm.objects.filter(user=self.request.user)

class ProviderDocumentListCreate(generics.ListCreateAPIView):
    serializer_class = api_serializers.ProviderDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return api_models.ProviderDocument.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProviderDocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializers.ProviderDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return api_models.ProviderDocument.objects.filter(user=self.request.user) 
class ProviderFormComplete(generics.UpdateAPIView):
    serializer_class = api_serializers.ProviderFormSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    http_method_names = ['patch'] # Only allow PATCH requests for partial updates

    def get_queryset(self):
        return api_models.ProviderForm.objects.filter(user=self.request.user)
    
    def partial_update(self, request, *args, **kwargs):
        # We only expect the 'completed' field to be updated
        request.data['completed'] = True
        return super().partial_update(request, *args, **kwargs)
class UploadFilledPDF(generics.CreateAPIView):
    serializer_class = api_serializers.ProviderFormUploadPDFSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return api_models.ProviderForm.objects.filter(user=self.request.user)
    
# views.py

class FillPreexistingPDF(generics.CreateAPIView):
    serializer_class = api_serializers.ProviderFormFillSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Add this method to pass the request to the serializer context
    def get_serializer_context(self):
        return {'request': self.request}

@xframe_options_exempt
def serve_blank_form(request, form_type):
    template_path = TEMPLATES.get(form_type)
    if not template_path or not os.path.exists(template_path):
        return HttpResponseNotFound("Form not found.")
    return FileResponse(open(template_path, 'rb'), content_type='application/pdf')

