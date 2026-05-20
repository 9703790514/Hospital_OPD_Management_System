import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, List, ListItem, ListItemText, Button, Paper, CircularProgress, Alert } from "@mui/material";

async function fetchData(url) {
  await new Promise((r) => setTimeout(r, 500));
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} - ${text}`);
  }
  return response.json();
}

function ConsultationBillAppointments({ onGenerateBillClick, billingUser, loading }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    async function loadAppointments() {
      try {
        const apptList = await fetchData("http://localhost:2010/api/appointments");
        const enriched = await Promise.all(
          apptList.map(async (appt) => {
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

            return {
              ...appt,
              patientName,
              doctorName,
              formattedDate: new Date(appt.appointmentDate).toLocaleDateString(),
              formattedTime: new Date(appt.appointmentTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          })
        );
        setAppointments(enriched);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load appointments.");
      }
    }
    loadAppointments();
  }, [loading]);

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

  if (!appointments.length)
    return (
      <Alert severity="info" sx={{ m: 4 }}>
        No appointments found.
      </Alert>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <List>
        {appointments.map((appt) => (
          <Paper key={appt.id} sx={{ mb: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <Button onClick={() => onGenerateBillClick(appt.id)} variant="contained">
                  Generate Bill
                </Button>
              }
            >
              <ListItemText
                primary={appt.patientName}
                secondary={
                  <>
                    Doctor: {appt.doctorName} <br />
                    Date: {appt.formattedDate} | Time: {appt.formattedTime} <br />
                    Reason: {appt.reasonVisit || "N/A"}
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}

ConsultationBillAppointments.propTypes = {
  onGenerateBillClick: PropTypes.func.isRequired,
  billingUser: PropTypes.object,
  loading: PropTypes.bool,
};

export default ConsultationBillAppointments;
