import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// Helper function for status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'error';
    case 'Scheduled':
      return 'info';
    case 'Completed':
      return 'primary';
    default:
      return 'default';
  }
};

// Helper function for status icons
const getStatusIcon = (status) => {
  switch (status) {
    case 'Confirmed':
      return <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />;
    case 'Pending':
      return <PendingActionsIcon fontSize="small" sx={{ color: 'warning.main' }} />;
    case 'Cancelled':
      return <CancelIcon fontSize="small" sx={{ color: 'error.main' }} />;
    case 'Scheduled':
      return <EventNoteIcon fontSize="small" sx={{ color: 'info.main' }} />;
    case 'Completed':
      return <DoneAllIcon fontSize="small" sx={{ color: 'primary.main' }} />;
    default:
      return null;
  }
};

const DoctorTodayAppointments = ({ doctorUser, onViewMedicalRecords }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formattedTodayDate, setFormattedTodayDate] = useState('');
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  const fetchDoctorAndAppointments = async () => {
    if (!doctorUser || !doctorUser.userId) {
      setError("Doctor user ID is not available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentFormattedDate = `${year}-${month}-${day}`;
    setFormattedTodayDate(currentFormattedDate);

    try {
      const doctorResponse = await fetch(`http://localhost:2005/api/doctors/customId/${doctorUser.userId}`);
      if (!doctorResponse.ok) {
        throw new Error(`Failed to fetch doctor details: ${doctorResponse.status}`);
      }
      const doctorDetails = await doctorResponse.json();
      const doctorMongoId = doctorDetails.id;

      const appointmentsResponse = await fetch(`http://localhost:2010/api/appointments/doctor/${doctorMongoId}/date/${currentFormattedDate}`);
      if (!appointmentsResponse.ok) {
        const errorText = await appointmentsResponse.text();
        throw new Error(`Failed to fetch today's appointments: ${appointmentsResponse.status} - ${errorText}`);
      }

      if (appointmentsResponse.status === 204) {
        setAppointments([]);
      } else {
        const data = await appointmentsResponse.json();
        setAppointments(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load today's appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAndAppointments();
  }, [doctorUser.userId]);

  // Pass both medicalRecordId and appointmentId
  const handleViewMedicalRecords = (medicalRecordId, appointmentId) => {
    onViewMedicalRecords({ medicalRecordId, appointmentId });
  };

  const handleCompleteAppointment = async (appointmentId) => {
    setUpdatingAppointmentId(appointmentId);
    try {
      const response = await fetch(`http://localhost:2010/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to complete appointment: ${response.status} - ${errorText}`);
      }
      await fetchDoctorAndAppointments();
    } catch (err) {
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.dark' }}>
        Today's Appointments
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        {formattedTodayDate}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading Today's Appointments...
          </Typography>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && appointments.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No appointments found for today.
        </Alert>
      )}

      {!loading && !error && appointments.length > 0 && (
        <Grid container spacing={3}>
          {appointments.map((row) => (
            <Grid item xs={12} sm={6} md={4} key={row.id}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #f9fbff, #e6f0ff)',
                  boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 14px 40px rgba(25,118,210,0.3)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#0d3c91' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                      Patient: {row.patientId || 'N/A'}
                    </Box>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Appointment ID:</strong> {row.id || 'N/A'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    Time: {row.appointmentTime ? new Date(row.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                    <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
                    Type: {row.reasonForVisit || 'N/A'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <MeetingRoomIcon fontSize="small" sx={{ mr: 1 }} />
                    Room: {row.roomNumber || 'N/A'}
                  </Typography>

                  <Chip label={row.status || 'Unknown'} color={getStatusColor(row.status)} size="small" icon={getStatusIcon(row.status)} />
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  {row.medicalRecordId && (
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => handleViewMedicalRecords(row.medicalRecordId, row.id)}
                      sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                      View Medical Records
                    </Button>
                  )}
                  {row.status !== 'Completed' && row.status !== 'Cancelled' && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleCompleteAppointment(row.id)}
                      disabled={updatingAppointmentId === row.id}
                      sx={{ ml: 1, fontWeight: 'bold', textTransform: 'none' }}
                    >
                      {updatingAppointmentId === row.id ? <CircularProgress size={24} /> : 'Complete'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 8, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Manage your appointments and patient visits efficiently with detailed information.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorTodayAppointments.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onViewMedicalRecords: PropTypes.func.isRequired, // function accepting {medicalRecordId, appointmentId}
};

export default DoctorTodayAppointments;
