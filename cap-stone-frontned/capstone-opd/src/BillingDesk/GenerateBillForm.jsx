import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Modal,
} from "@mui/material";

async function fetchData(url) {
  await new Promise((r) => setTimeout(r, 500));
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} - ${text}`);
  }
  return response.json();
}

function GenerateBillForm({ appointmentId, onBack }) {
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultationFee, setConsultationFee] = useState("250.00");
  const [additionalCharges, setAdditionalCharges] = useState("0.00");
  const [notes, setNotes] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadAppointmentDetails() {
      try {
        const appt = await fetchData(`http://localhost:2010/api/appointments/${appointmentId}`);

        let patientName = "Unknown Patient";
        let doctorName = "Unknown Doctor";
        try {
          const patient = await fetchData(`http://localhost:2010/api/patients/${appt.patientId}`);
          patientName = patient.name;
        } catch {}
        try {
          const doctor = await fetchData(`http://localhost:2010/api/doctors/${appt.doctorId}`);
          doctorName = doctor.name;
        } catch {}

        setAppointment({
          ...appt,
          patientName,
          doctorName,
          formattedDate: new Date(appt.appointmentDate).toLocaleDateString(),
          formattedTime: new Date(appt.appointmentTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    }
    loadAppointmentDetails();
  }, [appointmentId]);

  const handleCreateBill = () => {
    // Save bill logic here - simulated by tooltip
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onBack();
  };

  if (loading)
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );

  if (!appointment)
    return (
      <Alert severity="info" sx={{ m: 4 }}>
        No appointment data available.
      </Alert>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Generate Bill
      </Typography>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
        &larr; Back to Appointments
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appointment Details
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Patient: {appointment.patientName}</Typography>
          <Typography>Doctor: {appointment.doctorName}</Typography>
          <Typography>Date: {appointment.formattedDate}</Typography>
          <Typography>Time: {appointment.formattedTime}</Typography>
          <Typography>Reason: {appointment.reasonVisit || "N/A"}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Billing Details
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Consultation Fee"
                fullWidth
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Additional Charges"
                fullWidth
                value={additionalCharges}
                onChange={(e) => setAdditionalCharges(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button variant="contained" onClick={handleCreateBill}>
              Create Bill
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="success-modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            outline: "none",
            width: 400,
          }}
        >
          <Typography id="success-modal-title" variant="h6" gutterBottom>
            Success!
          </Typography>
          <Typography>Your bill was created successfully.</Typography>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button variant="contained" onClick={handleCloseModal}>
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

GenerateBillForm.propTypes = {
  appointmentId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default GenerateBillForm;
