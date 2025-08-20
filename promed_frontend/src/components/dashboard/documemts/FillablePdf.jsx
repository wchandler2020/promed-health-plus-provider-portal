
// Corrected FillablePdf.jsx
import React, { useState, useEffect } from "react";
import authRequest from "../../../utils/axios";
import toast from "react-hot-toast";
import EditPdfFormModal from "./EditPdfFormModal";

const FillablePdf = ({ selectedPatientId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

 // Extract blob name from URL for SAS requests
  const getBlobNameFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  const handleSavePatientIVR = async () => {
    if (!selectedPatientId) {
      toast.error("No patient selected.");
      return;
    }

    try {
      const axiosInstance = authRequest();
      const response = await axiosInstance.post("/onboarding/forms/fill/", {
        patient_id: selectedPatientId,
        form_type: "IVR_FORM",
        form_data: formData || {},
      });

      const newUrl = response.data.completed_form_url;
      const blobName = getBlobNameFromUrl(newUrl);
      const sasUrl = await fetchSasUrl(blobName);

      setPdfUrl(sasUrl);
      toast.success("Patient IVR form saved to cloud!");
    } catch (error) {
      console.error("Failed to save form:", error);
      toast.error("Error saving form.");
    }
  };

  // Fetch secure SAS URL for blob access
  const fetchSasUrl = async (blobName) => {
    try {
      const axiosInstance = authRequest();
      const res = await axiosInstance.get(`/forms/sas-url/${blobName}/`);
      return res.data.sas_url;
    } catch (error) {
      console.error("Failed to fetch SAS URL:", error);
      toast.error("Could not get secure link to PDF.");
      return null;
    }
  };

  // Load blank form PDF served locally
  const loadBlankPdf = () => {
    // Adjust this URL to match your blank form endpoint and form type
    const blankPdfUrl = `${process.env.REACT_APP_API_URL}/onboarding/forms/blank/IVR_FORM/`;
    setPdfUrl(blankPdfUrl);
    setFormData(null);
    setLoading(false);
  };

  const handleGeneratePdf = async () => {
    if (!selectedPatientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const axiosInstance = authRequest();

      // Step 1: Fetch the pre-populated form data
      const dataResponse = await axiosInstance.get(
        `/onboarding/forms/prepopulate-data/`,
        {
          params: {
            patient_id: selectedPatientId,
            form_type: "IVR_FORM",
          },
        }
      );
      setFormData(dataResponse.data); // Set the form data state

      // Step 2: Fetch the PDF blob
      const pdfResponse = await axiosInstance.get(
        `/onboarding/forms/prepopulate/`,
        {
          params: {
            patient_id: selectedPatientId,
            form_type: "IVR_FORM",
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);

      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };
  const handleEditorSuccess = async (newPdfUrl, updatedData) => {
    // 1. Update the formData state with the changes from the modal
    setFormData(updatedData);

    // 2. Set the new PDF URL for the iframe preview
    setPdfUrl(newPdfUrl);
    
    // 3. We can now stop loading and close the modal
    setLoading(false);
    setShowEditor(false);
    toast.success("PDF preview re-generated successfully!");
  };

  useEffect(() => {
    handleGeneratePdf();
  }, [selectedPatientId]);

  return (
    <div className="pdf-fill-container" style={{ padding: "2rem" }}>
      {loading && <p>Loading PDF...</p>}

      {!loading && pdfUrl && (
        <>
          <h3>Preview:</h3>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Preview"
            style={{ border: "1px solid #ccc" }}
          ></iframe>

          <div className="mt-4 flex gap-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Download PDF
            </a>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowEditor(true)}
            >
              Edit PDF Fields
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleSavePatientIVR}
            >
              Save Patient IVR
            </button>
          </div>
        </>
      )}

      {showEditor && (
        <EditPdfFormModal
          formData={formData || {}}
          patientId={selectedPatientId}
          onClose={() => setShowEditor(false)}
          onSuccess={handleEditorSuccess} // Pass the new, correct handler
        />
      )}
    </div>
  );
};

export default FillablePdf;
