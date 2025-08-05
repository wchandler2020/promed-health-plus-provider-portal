import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../utils/auth";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

// Sample image for demo purposes
import woundImage from "../../../assets/images/default_item.png"; // Replace with actual image(s)

const defaultPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 57,
    location: "Los Angeles, CA",
    ivrStatus: "Approved",
    grafts: [{ type: "Dermal", size: "2cm x 4cm" }],
    tissueId: "TX-123456",
    qCode: "Q1234",
    date: "2025-07-10",
    reimbursement: 1200,
    invoiced: 950,
    estimatedProfit: 250,
    woundImages: [woundImage, woundImage, woundImage, woundImage, ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    age: 62,
    location: "Dallas, TX",
    ivrStatus: "Denied",
    grafts: [{ type: "Amniotic", size: "1cm x 2cm" }],
    tissueId: "TX-987654",
    qCode: "Q4321",
    date: "2025-06-15",
    reimbursement: 0,
    invoiced: 700,
    estimatedProfit: -700,
    woundImages: [],
  },
  {
    id: 3,
    name: "Tammy Weddle",
    age: 51,
    location: "Louisville, KY",
    ivrStatus: "Approved",
    grafts: [{ type: "Amniotic", size: "1cm x 2cm" }],
    tissueId: "KY-987654",
    qCode: "Q4321",
    date: "2025-07-01",
    reimbursement: 0,
    invoiced: 700,
    estimatedProfit: -700,
    woundImages: [],
  },
];

const IVRStatusBadge = ({ status }) => {
  const colors = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Denied: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const PatientCard = ({ patient }) => (
  <div className="border p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm space-y-2">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{patient.name}</h3>
      <div>
        <strong className="text-xs">IVR Status: </strong>
        <IVRStatusBadge status={patient.ivrStatus} />
      </div>
      
    </div>
    {/* <p className="text-sm text-gray-600">
      Age: {patient.age} • Location: {patient.location}
    </p> */}

    {/* <div className="text-sm text-gray-700">
      <strong>Grafts Used:</strong>
      <ul className="list-disc list-inside ml-4 mt-1">
        {patient.grafts.map((g, i) => (
          <li key={i}>
            {g.type} — {g.size}
          </li>
        ))}
      </ul>
    </div> */}

    <div className="text-sm text-gray-700 space-y-1">
      <p>
        <strong>First Name:</strong> {patient.first_name}
      </p>
      <p>
        <strong>Last Name:</strong> {patient.last_name}
      </p>
    </div>
      {/* <p>
        <strong>Tissue ID:</strong> {patient.tissueId}
      </p>
      <p>
        <strong>Q-Code:</strong> {patient.qCode}
      </p>
      <p>
        <strong>Date of Application:</strong> {patient.date}
      </p>
      <p>
        <strong>Reimbursement:</strong> ${patient.reimbursement.toFixed(2)}
      </p>
      <p>
        <strong>Invoiced:</strong> ${patient.invoiced.toFixed(2)}
      </p>
      <p>
        <strong>Estimated Profit:</strong> ${patient.estimatedProfit.toFixed(2)}
      </p>
    </div> */}

    {/* {patient.woundImages?.length > 0 && (
      <div className="pt-3">
        <p className="text-sm font-medium text-gray-700">Wound Assessment Images:</p>
        <div className="flex flex-wrap gap-3 mt-2">
          {patient.woundImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Wound"
              className="w-24 h-24 rounded border object-cover"
            />
          ))}
        </div>
      </div>
    )} */}
  </div>
);

const Patients = () => {
   
  const { getPatients } = useContext(AuthContext);
  const { postPatient } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);

  // Form Validation
  const [errors, setErrors] = useState({}); 
  const ValidateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required"; 
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required"; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      if (getPatients) {
        
        const result = await getPatients();
        if (result.success) {
          setPatients(result.data);
        } else {
          console.error("Failed to fetch patients:", result.error);
        }
      }
    };
    fetchPatients();
  }, [getPatients]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone_number: "",
    primary_insurance: "",
    secondary_insurance: "",
    tertiary_insurance: "",
    medical_record_number: "",
    date_created: "",
    date_updated: "",
    // name: "",
    // age: "",
    // location: "",
    ivrStatus: "Pending",
    // grafts: "",
    // tissueId: "",
    // qCode: "",
    // date: "",
    // reimbursement: "",
    // invoiced: "",
    // estimatedProfit: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    // Clear previous errors and Validate form
    setErrors({});
    if (!ValidateForm()) return;

    // const graftList = formData.grafts.split(",").map((g) => {
    //   const [type, size] = g.trim().split(":");
    //   return { type: type?.trim(), size: size?.trim() };
    // });

    const newPatient = {
      ...formData,
      id: Date.now(),
      // grafts: graftList,
      // age: parseInt(formData.age),
      // reimbursement: parseFloat(formData.reimbursement),
      // invoiced: parseFloat(formData.invoiced),
      // estimatedProfit: parseFloat(formData.estimatedProfit),
      // woundImages: [woundImage], // for demo, could use upload
    };
    
     try {
      // Call API to post new patient
      const res = await postPatient(newPatient);
      if (res.success) {
        console.log("Patient added successfully:", res.data);
        setPatients((prev) => [res.data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    }

    // setPatients((prev) => [newPatient, ...prev]);
    setOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      middle_initial: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone_number: "",
      primary_insurance: "",
      secondary_insurance: "",
      tertiary_insurance: "",
      medical_record_number: "",
      date_created: "",
      date_updated: "",
      // name: "",
      // age: "",
      // location: "",
      ivrStatus: "Pending",
      // grafts: "",
      // tissueId: "",
      // qCode: "",
      // date: "",
      // reimbursement: "",
      // invoiced: "",
      // estimatedProfit: "",
    });
  };

  // Sort patients: active first
  const sortedPatients = [...patients].sort((a, b) => {
    const active = (status) => ["Approved", "Pending"].includes(status);
    return active(b.ivrStatus) - active(a.ivrStatus);
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Patient Applications</h2>
        <button
          className="border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-md transition-all sm:text-base text-sm"
          onClick={() => setOpen(true)}
        >
          + New Patient
        </button>
      </div>

       <div className="space-y-6">
        {sortedPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>➕ Add New Patient</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4">
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              fullWidth
            />
            <TextField
              label="Middle Initial"
              name="middle_initial"
              value={formData.middle_initial}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Zip Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Primary Insurance"
              name="primary_insurance"
              value={formData.primary_insurance}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Secondary Insurance"
              name="secondary_insurance"
              value={formData.secondary_insurance}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Tertiary Insurance"
              name="tertiary_insurance"
              value={formData.tertiary_insurance}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Medical Record Number"
              name="medical_record_number"
              value={formData.medical_record_number}
              onChange={handleInputChange}
              fullWidth
            />
            {/* <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
            /> */}
            <TextField
              select
              label="IVR Status"
              name="ivrStatus"
              value={formData.ivrStatus}
              onChange={handleInputChange}
              fullWidth
            >
              {["Approved", "Pending", "Denied"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            {/* <TextField
              label="Grafts (type:size, comma separated)"
              name="grafts"
              value={formData.grafts}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Tissue ID"
              name="tissueId"
              value={formData.tissueId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Q-Code"
              name="qCode"
              value={formData.qCode}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Reimbursement"
              name="reimbursement"
              type="number"
              value={formData.reimbursement}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Invoiced"
              name="invoiced"
              type="number"
              value={formData.invoiced}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Estimated Profit"
              name="estimatedProfit"
              type="number"
              value={formData.estimatedProfit}
              onChange={handleInputChange}
              fullWidth */}
            {/* /> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddPatient}
            variant="contained"
            color="primary"
          >
            Add Patient
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Patients;