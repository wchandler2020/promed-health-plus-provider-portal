import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import hero_img from "../../../assets/images/bg_image_01.jpg";

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
  "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY"
];

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    question: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setOpen(false);
    // Optional: Add API call or form submission logic here
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <>
      <section className="bg-white text-gray-800 py-20 px-4 md:px-8 h-[75vh]">
        <div className="container mx-auto flex flex-col md:flex-row items-center h-[75%]">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Health is Our Priority
            </h1>
            <p className="mt-4 text-lg md:text-xl">
              Providing exceptional medical care with compassion and expertise.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-8 bg-white text-emerald-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Contact Us
            </button>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-64 w-full rounded-lg shadow-lg h-[70%]">
              <img
                src={hero_img}
                alt="Medical professional"
                className="h-full w-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Contact Form */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>Contact ProMed Health Plus</Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Provider Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="City"
              name="city"
              fullWidth
              value={formData.city}
              onChange={handleChange}
              required
            />
            <TextField
              select
              label="State"
              name="state"
              fullWidth
              value={formData.state}
              onChange={handleChange}
              required
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Zip Code"
              name="zip"
              fullWidth
              value={formData.zip}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Your Question"
              name="question"
              multiline
              rows={4}
              fullWidth
              value={formData.question}
              onChange={handleChange}
              required
            />
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Hero;
