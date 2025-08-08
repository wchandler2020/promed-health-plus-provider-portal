from pdfrw import PdfReader, PdfWriter, PdfDict, PdfString
import os
from django.conf import settings

ANNOT_KEY = '/Annots'
ANNOT_FIELD_KEY = '/T'
ANNOT_VAL_KEY = '/V'
SUBTYPE_KEY = '/Subtype'
WIDGET_SUBTYPE_KEY = '/Widget'

TEMPLATES = {
    'IVR_FORM': os.path.join(settings.MEDIA_ROOT, 'pdf_templates/promed_healthcare_plus_ivr_blank.pdf'),
}

def fill_pdf(template_type, data_dict, output_path):
    template_path = TEMPLATES.get(template_type)

    if not template_path or not os.path.exists(template_path):
        raise FileNotFoundError(f"Template not found for type: {template_type}")

    pdf = PdfReader(template_path)

    for page in pdf.pages:
        annotations = page.get(ANNOT_KEY)
        if annotations:
            for annotation in annotations:
                if annotation.get(SUBTYPE_KEY) == WIDGET_SUBTYPE_KEY:
                    key = annotation.get(ANNOT_FIELD_KEY)
                    if key:
                        key_name = key.to_unicode().strip('()')

                        if key_name in data_dict:
                            value = data_dict[key_name]
                            annotation.update(
                                PdfDict(V=PdfString.encode(value))  # Leave editable
                            )

                            # Ensure the field appearance is regenerated
                            if '/AP' in annotation:
                                del annotation['/AP']

    PdfWriter().write(output_path, pdf)
