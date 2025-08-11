from onboarding_ops import models as api_models
from rest_framework import serializers
from onboarding_ops.pdf_utils import fill_pdf
from django.conf import settings
import uuid, os

from onboarding_ops.pdf_utils import fill_pdf
from django.core.files.base import File
from patients.models import Patient
from rest_framework import serializers
from .models import ProviderForm

print('does this working')

class ProviderFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.ProviderForm
        fields = '__all__'
        read_only_fields = ['user']
class ProviderDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = api_models.ProviderDocument
        fields = ['id', 'document_type', 'file', 'file_url', 'uploaded_at']
        read_only_fields = ['user']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else None

# This serializer now has the logic to fill the PDF and create the model instance
# onboarding_ops/serializers.py

from rest_framework import serializers
from .models import ProviderForm
from patients.models import Patient
import uuid, os
from django.conf import settings
from django.core.files.base import File
from .pdf_utils import fill_pdf

class ProviderFormFillSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField(write_only=True)
    form_type = serializers.CharField(write_only=True)
    completed_form_url = serializers.CharField(read_only=True) # Read-only field

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        print(user.full_name)
        patient_id = validated_data.get('patient_id')
        form_type = validated_data.get('form_type')

        try:
            patient = Patient.objects.get(id=patient_id, provider=user)
        except Patient.DoesNotExist:
            raise serializers.ValidationError({"error": "Patient not found or unauthorized."})

        form_data = {
            'Provider Name': user.full_name,
            'Text38': user.email,#patient email
            'Text56': patient.address,#patient address
            'Text59': str(patient.date_of_birth),#patient address
            'Text57': str(patient.phone_number),#patient phone number
            'Text62': patient.primary_insurance,#primary policy provider
            'Text63': patient.primary_insurance_number, #primary policy number
            'Text65': patient.secondary_insurance, #primary policy number
            'Text66': patient.secondary_insurance_number, #primary policy number
            'PATIENT ADDRESS': patient.address,
            'Text60': f'{patient.city}, {patient.state} {patient.zip_code}',
            'PATIENT PHONE': str(patient.phone_number),
            'PATIENT FAX/EMAIL': patient.email,
        }

        filename = f"{uuid.uuid4()}_{form_type}_filled.pdf"
        output_dir = os.path.join(settings.MEDIA_ROOT, 'completed_forms')
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, filename)

        try:
            fill_pdf(form_type, form_data, output_path)
        except Exception as e:
            # os.remove(output_path) # Clean up file on error
            raise serializers.ValidationError({"error": f"PDF generation failed: {str(e)}"})

        with open(output_path, 'rb') as f:
            provider_form = ProviderForm.objects.create(
                user=user,
                patient=patient,
                form_type=form_type,
                completed_form=File(f, name=filename),
                completed=True,
                form_data=form_data
            )
        
        # Clean up the temporary local file
        os.remove(output_path)
        
        # This is the key change!
        # The serializer should return the model instance
        return provider_form
    
    def to_representation(self, instance):
        # This method is called to serialize the model instance for the response.
        # We manually create the representation here.
        request = self.context.get('request')
        return {
            'form_id': instance.id,
            # Generate the absolute URL for the completed form
            'completed_form_url': request.build_absolute_uri(instance.completed_form.url)
        }        
class ProviderFormUploadPDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.ProviderForm
        fields = ['id', 'completed_form', 'form_data', 'date_created']
        read_only_fields = ['id', 'date_created']

    def create(self, validated_data):
        user = self.context['request'].user
        return api_models.ProviderForm.objects.create(user=user, **validated_data)

