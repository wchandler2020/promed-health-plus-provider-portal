from onboarding_ops import models as api_models
from rest_framework import serializers
from onboarding_ops.pdf_utils import fill_pdf
from django.conf import settings
import uuid, os
from django.core.files.base import File
from patients.models import Patient
from .models import ProviderForm
from io import BytesIO
from datetime import datetime

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
class ProviderFormFillSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField(write_only=True)
    form_type = serializers.CharField(write_only=True)
    form_data = serializers.DictField(write_only=True, required=False)
    completed_form_url = serializers.CharField(read_only=True)

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        patient_id = validated_data.get('patient_id')
        form_type = validated_data.get('form_type')
        incoming_form_data = validated_data.get('form_data', {})

        try:
            patient = Patient.objects.get(id=patient_id, provider=user)
        except Patient.DoesNotExist:
            raise serializers.ValidationError({"error": "Patient not found or unauthorized."})

        default_form_data = {
            'Provider Name': user.full_name,
            'Text38': user.email,
            'Text56': patient.address,
            'Text59': str(patient.date_of_birth),
            'Text57': str(patient.phone_number),
            'Text62': patient.primary_insurance,
            'Text63': patient.primary_insurance_number,
            'Text65': patient.secondary_insurance,
            'Text66': patient.secondary_insurance_number,
            'PATIENT ADDRESS': patient.address,
            'Text60': f'{patient.city}, {patient.state} {patient.zip_code}',
            'PATIENT PHONE': str(patient.phone_number),
            'PATIENT FAX/EMAIL': patient.email,
        }

        form_data = {**default_form_data, **incoming_form_data}
        filename = (
            f"{user.full_name}/{patient.full_name}/"
            f"{uuid.uuid4()}_{form_type}_filled_{patient.first_name}_{patient.last_name}_{datetime.today().strftime('%m-%d-%Y')}.pdf"
        )
        
        output_buffer = BytesIO()

        try:
            fill_pdf(form_type, form_data, output_buffer)
            output_buffer.seek(0)
        except Exception as e:
            raise serializers.ValidationError({"error": f"PDF generation failed: {str(e)}"})

        provider_form = ProviderForm.objects.create(
            user=user,
            patient=patient,
            form_type=form_type,
            completed_form=File(output_buffer, name=filename),
            completed=True,
            form_data=form_data
        )

        return provider_form

    def to_representation(self, instance):
        request = self.context.get('request')
        full_blob_path = instance.completed_form.name

        return {
            'form_id': instance.id,
            'completed_form_url': request.build_absolute_uri(f"/api/v1/forms/serve/{full_blob_path}"),
            'form_data': instance.form_data,
        }

class ProviderFormUploadPDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.ProviderForm
        fields = ['id', 'completed_form', 'form_data', 'date_created']
        read_only_fields = ['id', 'date_created']

    def create(self, validated_data):
        user = self.context['request'].user
        return api_models.ProviderForm.objects.create(user=user, **validated_data)

