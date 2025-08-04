from onboarding_ops import models as api_models
from rest_framework import serializers

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
