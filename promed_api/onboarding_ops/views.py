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

    # def create(self, request, *args, **kwargs):
    #     print('>>> View create() called')

    #     patient_id = request.data.get("patient_id")
    #     form_type = request.data.get("form_type")

    #     if not patient_id or not form_type:
    #         return Response({"error": "Missing 'patient_id' or 'form_type'."}, status=400)

    #     # 1. Get patient and ensure provider owns them
    #     try:
    #         patient = Patient.objects.get(id=patient_id, provider=request.user)
    #     except Patient.DoesNotExist:
    #         return Response({"error": "Patient not found or unauthorized."}, status=404)

    #     # 2. Build form data from patient and provider info
    #     form_data = {
    #         'PHYSICIAN NAME:': request.user.full_name,
    #         'PATIENT NAME:': f'{patient.first_name} {patient.last_name}',
    #         'PATIENT ADDRESS:': patient.address,
    #         'CITY, STATE, ZIP:': f'{patient.city}, {patient.state} {patient.zip_code}',
    #         'PATIENT PHONE:': patient.phone_number,
    #         'PATIENT FAX/EMAIL:': patient.email,
    #     }

    #     # 3. Generate filled PDF
    #     filename = f"{uuid.uuid4()}_{form_type}_filled.pdf"
    #     output_dir = os.path.join(settings.MEDIA_ROOT, 'completed_forms')
    #     os.makedirs(output_dir, exist_ok=True)
    #     output_path = os.path.join(output_dir, filename)

    #     try:
    #         fill_pdf(form_type, form_data, output_path)
    #     except Exception as e:
    #         return Response({"error": f"PDF generation failed: {str(e)}"}, status=500)

    #     # 4. Save form record to DB
    #     with open(output_path, 'rb') as f:
    #         provider_form = ProviderForm.objects.create(
    #             user=request.user,
    #             patient=patient,
    #             form_type=form_type,
    #             completed_form=File(f, name=filename),
    #             completed=True,
    #             form_data=form_data
    #         )

    #     return Response({
    #         "message": "Form filled successfully",
    #         "form_id": provider_form.id,
    #         "completed_form_url": provider_form.completed_form.url
    #     }, status=201)

@xframe_options_exempt
def serve_blank_form(request, form_type):
    template_path = TEMPLATES.get(form_type)
    if not template_path or not os.path.exists(template_path):
        return HttpResponseNotFound("Form not found.")
    return FileResponse(open(template_path, 'rb'), content_type='application/pdf')

