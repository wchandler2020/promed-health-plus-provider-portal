# onboarding_ops/views.py

from rest_framework import generics, permissions
from onboarding_ops import models as api_models
from onboarding_ops import serializers as api_serializers

# Custom permission to ensure users only access their own objects
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

# ----------- Provider Form Views -----------

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

# ----------- Provider Document Views -----------

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
