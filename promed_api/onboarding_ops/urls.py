
from django.urls import path
from onboarding_ops import views as api_views

urlpatterns = [
    # Provider Forms
    path('onboarding/forms/', api_views.ProviderFormListCreate.as_view(), name='provider-form-list'),
    path('onboarding/forms/<int:pk>/', api_views.ProviderFormDetail.as_view(), name='provider-form-detail'),
    # Provider Documents
    path('onboarding/documents/', api_views.ProviderDocumentListCreate.as_view(), name='provider-document-list'),
    path('onboarding/documents/<int:pk>/', api_views.ProviderDocumentDetail.as_view(), name='provider-document-detail'),
]