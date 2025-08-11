import React, { useState, useEffect } from "react";
import authRequest from "../../../utils/axios";
import toast from "react-hot-toast";

const FillablePdf = ({ selectedPatientId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading=true

  useEffect(() => {
    const fetchFilledPdf = async () => {
      if (!selectedPatientId) return;

      setLoading(true);

      try {
        const axiosInstance = authRequest();
        const response = await axiosInstance.post("/onboarding/forms/fill/", {
          patient_id: selectedPatientId,
          form_type: "IVR_FORM",
        });

        setPdfUrl(response.data.completed_form_url);
        toast.success("PDF generated successfully!");
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast.error("Failed to generate PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchFilledPdf();
  }, [selectedPatientId]);

  

  return (
    <div className="pdf-fill-container" style={{ padding: "2rem" }}>
      {loading && <p>Generating PDF...</p>}

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

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{ display: "block", marginTop: "1rem" }}
          >
            Download PDF
          </a>
        </>
      )}
    </div>
  );
};

export default FillablePdf;
