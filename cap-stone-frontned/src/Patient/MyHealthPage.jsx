// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
// } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// const MyHealthPage = ({ patient, onViewMedicalRecords }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPatientAppointments = async () => {
//       if (!patient?.userId) {
//         setError("Patient ID is not available.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(`http://localhost:2010/api/appointments/patient/${patient.userId}`);
//         if (!res.ok) {
//           const errorText = await res.text();
//           throw new Error(`Failed to fetch appointments: ${res.status} - ${errorText}`);
//         }
//         const data = await res.json();
//         setAppointments(data);
//       } catch (err) {
//         setError(err.message || "Failed to load appointments.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPatientAppointments();
//   }, [patient.userId]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'success';
//       case 'Pending': return 'warning';
//       case 'Cancelled': return 'error';
//       case 'Scheduled': return 'info';
//       case 'Completed': return 'primary';
//       default: return 'default';
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Your Appointments
//       </Typography>

//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
//           <CircularProgress />
//           <Typography variant="h6" sx={{ ml: 2 }}>Loading Appointments...</Typography>
//         </Box>
//       )}

//       {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

//       {!loading && !error && appointments.length === 0 && (
//         <Alert severity="info" sx={{ mb: 3 }}>No appointments found.</Alert>
//       )}

//       {!loading && !error && appointments.length > 0 && (
//         <Grid container spacing={3}>
//           {appointments.map((appt) => (
//             <Grid item xs={12} sm={6} md={4} key={appt.id}>
//               <Card
//                 elevation={6}
//                 sx={{
//                   borderRadius: 3,
//                   background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
//                   boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   justifyContent: 'space-between',
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
//                     <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
//                     Patient ID: {appt.patientId || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
//                     <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
//                     Time: {appt.appointmentTime ? new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
//                     <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
//                     Type: {appt.reasonForVisit || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
//                     <MeetingRoomIcon fontSize="small" sx={{ mr: 1 }} />
//                     Room: {appt.roomNumber || 'N/A'}
//                   </Typography>
//                   <Chip label={appt.status || 'Unknown'} color={getStatusColor(appt.status)} size="small" sx={{ mt: 1 }} />
//                 </CardContent>

//                 <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
//                   {appt.medicalRecordId && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="secondary"
//                       onClick={() => onViewMedicalRecords(appt.medicalRecordId)}
//                     >
//                       View Medical Records
//                     </Button>
//                   )}
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           View and manage your upcoming appointments and their medical records.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// MyHealthPage.propTypes = {
//   patient: PropTypes.shape({
//     userId: PropTypes.string.isRequired,
//   }).isRequired,
//   onViewMedicalRecords: PropTypes.func.isRequired,
// };

// export default MyHealthPage;
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  MeetingRoom as MeetingRoomIcon,
  MedicalInformation as MedicalInformationIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  CalendarToday as CalendarTodayIcon,
  Wc as WcIcon,
  Cake as CakeIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Warning as WarningIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Create a modern, fresh theme with smooth transitions and softer shadows
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', dark: '#115293', contrastText: '#fff' },
    secondary: { main: '#4dabf5', dark: '#1e88e5' },
    background: { default: '#f9fbfd', paper: '#fff' },
    text: { primary: '#263238', secondary: '#546e7a' },
    success: { main: '#43a047' },
    error: { main: '#e53935' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)' },
    h5: { fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    body1: { fontSize: '1.05rem', lineHeight: 1.8 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(25, 118, 210, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 25px 60px rgba(25, 118, 210, 0.18)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700,
          padding: '12px 32px',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(25,118,210,0.3)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
          fontSize: '0.85rem',
          padding: '6px 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
        },
      },
    },
  },
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(4),
  borderBottom: `3px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  fontSize: 'clamp(1.7rem, 4vw, 2.2rem)',
}));

const AppointmentCard = styled(Card)(({ theme, statuscolor }) => ({
  borderLeft: `6px solid ${statuscolor}`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  cursor: 'pointer',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#e8f0fe',
    boxShadow: '0 20px 50px rgba(25, 118, 210, 0.2)',
    transform: 'translateY(-5px)',
  },
}));

const MyHealthPage = ({ patient, onViewMedicalRecords }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorPatient, setErrorPatient] = useState(null);
  const [errorAppointments, setErrorAppointments] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patient?.userId) {
        setErrorPatient('Patient User ID is not available.');
        setLoadingPatient(false);
        return;
      }
      setLoadingPatient(true);
      setErrorPatient(null);

      try {
        const res = await fetch(`http://localhost:2008/api/patients/user/${patient.userId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch patient details: ${res.status} - ${text}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatientDetails(data[0]);
        } else {
          setErrorPatient('Patient details not found.');
        }
      } catch (err) {
        setErrorPatient(err.message || 'Failed to load patient details.');
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatientDetails();
  }, [patient?.userId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientDetails?._id) {
        setAppointments([]);
        return;
      }
      setLoadingAppointments(true);
      setErrorAppointments(null);

      try {
        const res = await fetch(`http://localhost:2010/api/appointments/patient/${patientDetails._id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch appointments: ${res.status} - ${text}`);
        }
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        setErrorAppointments(err.message || 'Failed to load appointments.');
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [patientDetails?._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return theme.palette.success.main;
      case 'Pending':
      case 'Scheduled':
        return theme.palette.info.main;
      case 'Cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[400];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (instantString) => {
    if (!instantString) return 'N/A';
    try {
      const date = new Date(instantString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return instantString;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: 1300, mx: 'auto', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 900, color: 'primary.dark' }}>
          <HealthAndSafetyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your Health Dashboard
        </Typography>

        {/* Patient Details */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 4, mb: 8, boxShadow: 3 }}>
          {loadingPatient ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={50} />
            </Box>
          ) : errorPatient ? (
            <Alert severity="error">{errorPatient}</Alert>
          ) : patientDetails ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 64, height: 64, mr: 3 }}>
                  <PersonIcon sx={{ fontSize: 36 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.dark' }}>
                  {patientDetails.first_name} {patientDetails.last_name}
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <CakeIcon />
                    <Typography>Date of Birth:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{formatDate(patientDetails.date_of_birth)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <WcIcon />
                    <Typography>Gender:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{patientDetails.gender}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <LocalPharmacyIcon />
                    <Typography>Blood Group:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{patientDetails.blood_group}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <PhoneIcon />
                    <Typography>Contact Number:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{patientDetails.contact_number}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                    <LocationOnIcon />
                    <Typography>Address:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{patientDetails.address}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'error.main' }}>
                    <WarningIcon />
                    <Typography>Allergies:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{patientDetails.allergies || 'None'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Box>

        {/* Appointments */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, color: 'primary.dark' }}>
            Upcoming Appointments
          </Typography>
          {loadingAppointments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={50} />
            </Box>
          ) : errorAppointments ? (
            <Alert severity="error">{errorAppointments}</Alert>
          ) : appointments.length === 0 ? (
            <Alert severity="info">No appointments found.</Alert>
          ) : (
            <Grid container spacing={4}>
              {appointments.map((appt) => (
                <Grid item xs={12} sm={6} md={4} key={appt.id}>
                  <AppointmentCard statuscolor={getStatusColor(appt.status)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 700 }}>
                          Appointment
                        </Typography>
                        <Chip label={appt.status || 'Unknown'} color={getStatusColor(appt.status)} size="small" />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <CalendarTodayIcon fontSize="small" color="secondary" sx={{ mr: 1.5 }} />
                          <Box component="span">
                            <strong>Date:</strong> {formatDate(appt.appointmentDate)}
                          </Box>
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <AccessTimeIcon fontSize="small" color="secondary" sx={{ mr: 1.5 }} />
                          <Box component="span">
                            <strong>Time:</strong> {formatTime(appt.appointmentTime)}
                          </Box>
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <EventNoteIcon fontSize="small" color="secondary" sx={{ mr: 1.5 }} />
                          <Box component="span">
                            <strong>Reason:</strong> {appt.reasonForVisit || 'N/A'}
                          </Box>
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <MeetingRoomIcon fontSize="small" color="secondary" sx={{ mr: 1.5 }} />
                          <Box component="span">
                            <strong>Room:</strong> {appt.roomNumber || 'N/A'}
                          </Box>
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                      {appt.medicalRecordId && (
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIosIcon />}
                          onClick={() => onViewMedicalRecords(appt.medicalRecordId, appt.id)}
                          sx={{
                            bgcolor: 'secondary.main',
                            color: '#fff',
                            '&:hover': { bgcolor: 'primary.main' },
                            fontWeight: 700,
                            borderRadius: 2,
                          }}
                        >
                          View Medical Record
                        </Button>
                      )}
                    </CardActions>
                  </AppointmentCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

MyHealthPage.propTypes = {
  patient: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
  onViewMedicalRecords: PropTypes.func.isRequired,
};

export default MyHealthPage;
