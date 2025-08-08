
from django.urls import path
from onboarding_ops import views as api_views

urlpatterns = [
    # Provider Forms
    path('onboarding/forms/', api_views.ProviderFormListCreate.as_view(), name='provider-form-list'),
    path('onboarding/forms/fill/', api_views.FillPreexistingPDF.as_view(), name='provider-form-list'),
    path('onboarding/forms/upload/', api_views.UploadFilledPDF.as_view(), name='upload-filled-pdf'),
    path('onboarding/forms/<int:pk>/', api_views.ProviderFormDetail.as_view(), name='provider-form-detail'),
    path('onboarding/forms/blank/<str:form_type>/', api_views.serve_blank_form, name='serve-blank-form'),
    # Provider Documents
    path('onboarding/documents/', api_views.ProviderDocumentListCreate.as_view(), name='provider-document-list'),
    path('onboarding/documents/<int:pk>/', api_views.ProviderDocumentDetail.as_view(), name='provider-document-detail'),
]