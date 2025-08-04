from rest_framework import serializers
from notes import models as api_models

class NotesSerializers(serializers.ModelSerializer):
    class Meta:
        model = api_models.Notes
        fields = '__all__'
        read_only_fields = ['user']