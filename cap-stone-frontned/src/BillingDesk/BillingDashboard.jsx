import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import AppointmentCard from './AppointmentCard';
import BillingDeskGenerateBill from './BillingDeskGenerateBill';
import BillInvoiceDisplay from './BillInvoiceDisplay';

const formatDateFromInstant = (instantString) => {
  if (!instantString) return 'N/A';
  try {
    const date = new Date(instantString);
    if (isNaN(date.getTime())) return 'Invalid';
    if (date.getFullYear() === 1970) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return 'Invalid';
  }
};

const formatTimeFromInstant = (instantString) => {
  if (!instantString || instantString.trim() === '') return 'Time not specified';
  try {
    const date = new Date(instantString);
    if (isNaN(date.getTime())) return 'Time not specified';
    if (date.getHours() === 0 && date.getMinutes() === 0) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Time not specified';
  }
};

const BillingDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [generatedBillData, setGeneratedBillData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [patientMap, setPatientMap] = useState({});

  useEffect(() => {
    const fetchAppointmentsAndDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments');
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const data = await response.json();

        // Extract unique doctor and patient IDs
        const doctorIds = [...new Set(data.map((app) => app.doctorId).filter(Boolean))];
        const patientIds = [...new Set(data.map((app) => app.patientId).filter(Boolean))];

        // Fetch doctor details in parallel
        const doctorsRes = await Promise.all(
          doctorIds.map((id) =>
            fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + id).then((res) =>
              res.ok ? res.json() : null
            )
          )
        );
        const doctorsMap = {};
        doctorsRes.forEach((doc) => {
          if (doc) {
            doctorsMap[doc.id || doc._id] = (doc.firstName || doc.first_name) + ' ' + (doc.lastName || doc.last_name);
          }
        });

        // Fetch patient details in parallel
        const patientsRes = await Promise.all(
          patientIds.map((id) =>
            fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + id).then((res) =>
              res.ok ? res.json() : null
            )
          )
        );
        const patientsMap = {};
        patientsRes.forEach((pat) => {
          if (pat) {
            patientsMap[pat.id || pat._id] = (pat.firstName || pat.first_name) + ' ' + (pat.lastName || pat.last_name);
          }
        });

        setDoctorMap(doctorsMap);
        setPatientMap(patientsMap);

        // Add formatted date and time to appointments
        const processedData = data.map((app) => ({
          ...app,
          formattedAppointmentDate: formatDateFromInstant(app.appointmentDate),
          formattedAppointmentTime: (() => {
            if (!app.appointmentTime) return 'Time not specified';
            const d = new Date(app.appointmentTime);
            if (d.getHours() === 0 && d.getMinutes() === 0) return '';
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          })(),
          formattedConsultationStartTime: formatTimeFromInstant(app.consultationStartTime),
          formattedConsultationEndTime: formatTimeFromInstant(app.consultationEndTime),
        }));

        setAppointments(processedData);
        setFilteredAppointments(processedData);
      } catch (err) {
        setError('Failed to load appointments: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndDetails();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAppointments(appointments);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = appointments.filter((app) => {
        const patientName = patientMap[app.patientId]?.toLowerCase() || '';
        const doctorName = doctorMap[app.doctorId]?.toLowerCase() || '';
        const reason = app.reasonForVisit?.toLowerCase() || '';

        return (
          patientName.includes(lowercasedQuery) ||
          doctorName.includes(lowercasedQuery) ||
          reason.includes(lowercasedQuery) ||
          app.id?.toString().toLowerCase().includes(lowercasedQuery) ||
          app.patientId?.toString().toLowerCase().includes(lowercasedQuery) ||
          app.doctorId?.toString().toLowerCase().includes(lowercasedQuery)
        );
      });
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments, doctorMap, patientMap]);

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setGeneratedBillData(null);
  };

  const handleBackToAppointments = () => {
    setSelectedAppointment(null);
    setGeneratedBillData(null);
  };

  const handleBillGenerated = (billData) => {
    setGeneratedBillData(billData);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" color="text.secondary">
          Loading Appointments...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2, fontSize: '1.1rem' }}>
          {error}
        </Alert>
        <Button
          onClick={handleBackToAppointments}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          fullWidth
          sx={{ fontWeight: 'bold' }}
        >
          Back to Appointments
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      {generatedBillData ? (
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #f9fafb, #e3eaf4)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          }}
        >
          <BillInvoiceDisplay bill={generatedBillData} />
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToAppointments}
              startIcon={<ArrowBackIcon />}
              sx={{ px: 5, py: 1.8, fontWeight: 'bold' }}
            >
              Generate Another Bill / View Appointments
            </Button>
          </Box>
        </Paper>
      ) : selectedAppointment ? (
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #f9fafb, #e3eaf4)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          }}
        >
          <Button
            onClick={handleBackToAppointments}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}
          >
            Back to Appointments
          </Button>
          <BillingDeskGenerateBill
            appointment={selectedAppointment}
            onBillGenerated={handleBillGenerated}
            onCancel={handleBackToAppointments}
          />
        </Paper>
      ) : (
        <>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              mb: 5,
              fontWeight: '900',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <EventAvailableIcon sx={{ fontSize: '2.2rem' }} /> Select Appointment for Billing
          </Typography>

          <Box
            sx={{
              mb: 5,
              width: { xs: '100%', md: '45%' },
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              label="Search by Patient Name, Doctor Name or Reason"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ style: { fontWeight: '600' } }}
              sx={{
                '& .MuiInputLabel-root': { fontWeight: 'bold' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgb(0 0 0 / 0.06)',
                },
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment}
                    onClick={handleAppointmentSelect}
                    doctorName={doctorMap[appointment.doctorId]}
                    patientName={patientMap[appointment.patientId]}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  align="center"
                  sx={{ fontStyle: 'italic', mt: 4 }}
                >
                  {searchQuery
                    ? 'No matching appointments found.'
                    : 'No upcoming appointments found.'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default BillingDashboard;
