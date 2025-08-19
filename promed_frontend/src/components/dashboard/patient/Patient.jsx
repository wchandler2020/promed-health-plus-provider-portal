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

import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import FillablePdf from "../documemts/FillablePdf";
import Notes from "../documemts/Notes";

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

const PatientCard = ({ patient, onViewPdf }) => {
  // CORRECTED: Move formattedDate inside the component
  const formattedDate = patient.date_of_birth
    ? format(new Date(patient.date_of_birth), "M/d/yyyy")
    : "N/A";

  const formattedPhoneNumber = patient.phone_number
    ? formatPhoneNumber(patient.phone_number) || patient.phone_number
    : "N/A";

  const calculateAge = (dobString) => {
    // Check for a valid date string format.
    if (!dobString || !/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
      console.error("Invalid date of birth format. Please use 'YYYY-MM-DD'.");
      return null;
    }

    // Create Date objects for the date of birth and the current date.
    const dob = new Date(dobString);
    const now = new Date();

    // Calculate the difference in years.
    let age = now.getFullYear() - dob.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year.
    // This is a crucial step for accuracy.
    const monthDifference = now.getMonth() - dob.getMonth();
    const dayDifference = now.getDate() - dob.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  return (
    <div className="border p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{patient.name}</h3>
        <div className="flex items-center justify-between w-full">
          <p className="text-sm">
            <strong>Patient Name:</strong> {patient.first_name}{" "}
            {patient.last_name}, {patient.middle_initial}.
          </p>
          <strong className="text-sm">
            IVR Status: <IVRStatusBadge status={patient.ivrStatus} />
          </strong>
        </div>
      </div>
      <div
        className="text-xs text-gray-700 space-y-1"
        style={{ marginTop: -4 }}
      >
        <p className="text-xs flex" style={{ fontSize: 10 }}>
          <strong className="mr-1">Medical Record #:</strong>{" "}
          {patient.medical_record_number}
        </p>
      </div>
      <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 8 }}>
        <p className="text-xs flex">
          <strong className="mr-1">Address:</strong> {patient.address}{" "}
          {patient.city}, {patient.state} {patient.zip_code}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Phone Number:</strong> {formattedPhoneNumber}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Date of Birth:</strong> {formattedDate}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Age :</strong>{" "}
          {calculateAge(patient.date_of_birth)}
        </p>
      </div>
      <div
        className="h-[2px] w-[90%] bg-gray-200 flex m-auto opacity-550"
        style={{ marginTop: 25 }}
      ></div>
      <p className="text-sm font-semibold text-center">Insurance Information</p>
      <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 5 }}>
        <p className="text-xs flex">
          <strong className="mr-1">Primary Insurance Provider :</strong>{" "}
          {patient.primary_insurance}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Primary Insurance Number :</strong>{" "}
          {patient.primary_insurance_number}
        </p>
      </div>
      <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 3 }}>
        <p className="text-xs flex">
          <strong className="mr-1">Secondary Insurance Provider:</strong>{" "}
          {patient.secondary_insurance ? patient.secondary_insurance : "N/A"}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Secondary Insurance Number:</strong>{" "}
          {patient.secondary_insurance_number
            ? patient.secondary_insurance_number
            : "N/A"}
        </p>
      </div>
      <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 3 }}>
        <p className="text-xs flex">
          <strong className="mr-1">Secondary Insurance Provider:</strong>{" "}
          {patient.tertiary_insurance ? patient.tertiary_insurance : "N/A"}
        </p>
      </div>
      <div
        className="text-sm text-gray-700 space-y-1"
        style={{ marginTop: -0.5 }}
      >
        <p className="text-xs flex">
          <strong className="mr-1">Secondary Insurance Number:</strong>{" "}
          {patient.tertiary_insurance_number
            ? patient.tertiary_insurance_number
            : "N/A"}
        </p>
      </div>
      <div
        className="h-[2px] w-[90%] bg-gray-200 flex m-auto opacity-550"
        style={{ marginTop: 25 }}
      ></div>
      <p className="text-sm font-semibold text-center">Patient Documentation</p>
      
      <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 5 }}>
        <div className="flex items-center justify-between">
          <p className="text-xs flex">
            <strong>Promed Healthcare Plus IVR</strong>
          </p>
          <div className="flex space-x-2">
            <FaEye
              className="text-gray-500 hover:text-blue-500 cursor-pointer"
              onClick={() => onViewPdf(patient)}
            />
            <FaEdit className="text-gray-500 hover:text-green-500 cursor-pointer" />
            <FaTrashAlt className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
      <div
        className="h-[2px] w-[90%] bg-gray-200 flex m-auto opacity-550"
        style={{ marginTop: 25 }}
      ></div>
      <Notes key={patient.id} patientId={patient.id} />
    </div>
  );
};

const Patients = () => {
  const { getPatients, postPatient } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPdfModalOpen, setViewPdfModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ivrFilter, setIvrFilter] = useState("");
  const [patientsPerPage, setPatientsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // CORRECTED: Add date_of_birth field to initial state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    date_of_birth: "", // New field
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone_number: "",
    primary_insurance: "",
    primary_insurance_number: "",
    secondary_insurance: "",
    secondary_insurance_number: "",
    tertiary_insurance: "",
    tertiary_insurance_number: "",
    medical_record_number: "",
    ivrStatus: "Pending",
    date_created: "",
    date_updated: "",
  });

  const ValidateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "middle_initial" ? value.trim().charAt(0) : value }));
  };

  const handleAddPatient = async () => {
    setErrors({});
    if (!ValidateForm()) return;

    const newPatient = { ...formData };
    try {
      const res = await postPatient(newPatient);
      if (res.success) {
        console.log("Patient added successfully:", res.data);
        setPatients((prev) => [res.data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    }

    setOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      middle_initial: "",
      date_of_birth: "", // Reset this field
      email: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone_number: "",
      primary_insurance: "",
      primary_insurance_number: "",
      secondary_insurance: "",
      secondary_insurance_number: "",
      tertiary_insurance: "",
      tertiary_insurance_number: "",
      medical_record_number: "",
      ivrStatus: "Pending",
    });
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.first_name} ${patient.last_name} ${patient.middle_initial}`.toLowerCase();
    const medRecord = patient.medical_record_number?.toLowerCase() || "";
    const matchesFilter = ivrFilter ? patient.ivrStatus === ivrFilter : true;
    return (
      (fullName.includes(searchTerm.toLowerCase()) ||
      medRecord.includes(searchTerm.toLowerCase())) &&
      matchesFilter
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const active = (status) => ["Approved", "Pending"].includes(status);
    return active(b.ivrStatus) - active(a.ivrStatus);
  });

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);


  const handleViewPdf = (patient) => {
    setSelectedPatient(patient);
    setViewPdfModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Patient Applications</h2>
        <button
          className="border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-md transition-all sm:text-sm text-xs"
          onClick={() => setOpen(true)}
        >
          + New Patient
        </button>
      </div>
      <div className="relative flex items-center w-full max-w-md mb-5">
        <input
          type="text"
          placeholder="Search Patients by Name or Med Record No."
          className="w-full px-2 py-1 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaSearch />
        </div>
      </div>
      <div className="flex items-center mb-5">
        <label htmlFor="ivr-filter" className="mr-2 text-sm font-medium">Filter by IVR Status:</label>
          <select id="ivr-filter" value={ivrFilter} onChange={e => setIvrFilter(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Denied">Denied</option>
          </select>
        <div className="ml-auto flex items-center">
          <label htmlFor="patients-per-page" className="mr-2 text-sm font-medium">Patient per page:</label>
          <select id="patients-per-page" value={patientsPerPage} onChange={e => {
            setPatientsPerPage(Number (e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm" >
            {[5,10,15,25].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {currentPatients.map((patient) => (
          <PatientCard 
            key={patient.id}
            patient={patient}
            onViewPdf={handleViewPdf}
          />
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50">Prev</button>
        <span className="mx-2 text-sm">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50">Next</button>
      </div>

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
            {/* CORRECTED: Add Date of Birth field */}
            <TextField
              type="date"
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.date_of_birth}
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
              label="Primary Insurance Number"
              name="primary_insurance_number"
              value={formData.primary_insurance_number}
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
              label="Secondary Insurance Number"
              name="secondary_insurance_number"
              value={formData.secondary_insurance_number}
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
              label="Tertiary Insurance Number"
              name="tertiary_insurance_number"
              value={formData.tertiary_insurance_number}
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
      <Dialog
        open={viewPdfModalOpen}
        onClose={() => setViewPdfModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>📄 View IVR Form</DialogTitle>
        <DialogContent dividers>
          {selectedPatient && (
            <FillablePdf
              selectedPatientId={selectedPatient.id}
              formType="IVR_FORM"
              hidePatientSelect={true}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPdfModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Patients;
