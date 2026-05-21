import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Button,
  Chip,
  Paper,
  Container,
  Stack,
} from '@mui/material';

import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  AccessTime as AccessTimeIcon,
  Paid as PaidIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AssignmentInd as AssignmentIndIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  LocalHospital as HospitalIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

import { DoctorDetailsPage } from './DoctorDetailsPage';

// Utility: generate consistent color from string for avatar background
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Utility to create Avatar props with initials fallback
function stringAvatar(name) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'DR';
  return {
    sx: { bgcolor: stringToColor(name || 'Doctor') },
    children: initials,
  };
}

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 650 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    subtitle1: { fontWeight: 500, lineHeight: 1.4 },
  },
  palette: {
    primary: { 
      main: '#2563eb', 
      light: '#60a5fa', 
      dark: '#1d4ed8',
      contrastText: '#ffffff' 
    },
    secondary: { 
      main: '#10b981', 
      light: '#34d399',
      dark: '#059669' 
    },
    background: { 
      default: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      paper: '#ffffff' 
    },
    text: { 
      primary: '#1e293b', 
      secondary: '#64748b' 
    },
    error: { main: '#ef4444' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    info: { main: '#3b82f6' },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 10px 15px rgba(0, 0, 0, 0.1)',
    '0px 20px 25px rgba(0, 0, 0, 0.1)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 3px 6px rgba(0, 0, 0, 0.1)',
    '0px 10px 20px rgba(0, 0, 0, 0.15)',
    '0px 15px 25px rgba(0, 0, 0, 0.15)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    ...Array(14).fill('0px 25px 50px rgba(0, 0, 0, 0.25)')
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 25px 50px rgba(37, 99, 235, 0.25)',
            borderColor: 'rgba(37, 99, 235, 0.3)',
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '4px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#ffffff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
              transform: 'translateY(-2px)',
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#2563eb',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': { 
            color: '#64748b',
            fontWeight: 500,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#ffffff',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            transform: 'translateY(-2px)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
            borderColor: '#2563eb',
            borderWidth: 2,
          },
        },
        icon: { color: '#64748b' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.75rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
        },
      },
    },
  },
});

const HomePage = ({ patient }) => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorAppointments, setErrorAppointments] = useState(null);
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
  const [sortAppointmentsBy, setSortAppointmentsBy] = useState('appointmentDate');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setErrorDoctors(null);

        const res = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/all');
        if (!res.ok) throw new Error('Failed to fetch doctors: ' + res.status + ' ' + res.statusText);
        const doctorsData = await res.json();

        const doctorsWithImages = await Promise.all(
          doctorsData.map(async (doctor) => {
            if (doctor.image) {
              return doctor;
            }
            try {
              const userRes = await fetch(`http://localhost:2002/api/users/${doctor.customId}`);
              if (userRes.ok) {
                const userData = await userRes.json();
                const profilePicBase64 = userData.image || null;
                return { ...doctor, image: profilePicBase64 };
              }
            } catch (fetchError) {
            }
            return { ...doctor, image: null };
          }),
        );
        setDoctors(doctorsWithImages);
      } catch (err) {
        setErrorDoctors(err.message);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

useEffect(() => {
  const fetchAppointments = async () => {
    if (!patient?.userId) return;

    try {
      // Step 1: Get patient record by userId
      const patientRes = await fetch(`http://localhost:2008/api/patients/user/${patient.userId}`);
      if (!patientRes.ok) throw new Error('Failed to fetch patient details');
      const patientData = await patientRes.json();
      const patientRecord = patientData[0];

      if (!patientRecord?._id) throw new Error('Patient _id not found');

      // Step 2: Fetch appointments using the patient _id
      const apptRes = await fetch(`http://localhost:2010/api/appointments/patient/${patientRecord._id}`);
      if (!apptRes.ok) throw new Error('Failed to fetch appointments');
      const appointments = await apptRes.json();

      setAppointments(appointments);
    } catch (err) {
      setErrorAppointments(err.message);
    } finally {
      setLoadingAppointments(false);
    }
  };

  fetchAppointments();
}, [patient?.userId]);


  const uniqueSpecializations = doctors.length > 0
    ? [...new Set(doctors.map((d) => d.specialization))].sort()
    : [];

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch =
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const specMatch = filterSpecialization === '' || doctor.specialization === filterSpecialization;
    const expMatch = filterExperience === '' || (doctor.experience !== undefined && doctor.experience >= parseInt(filterExperience, 10));
    return (searchTerm === '' || nameMatch) && specMatch && expMatch;
  });

  // Filter and sort appointments
  const filteredAndSortedAppointments = appointments
    .filter((appt) => {
      const searchMatch =
        appointmentSearchTerm === '' ||
        appt.reasonForVisit?.toLowerCase().includes(appointmentSearchTerm.toLowerCase()) ||
        appt.status?.toLowerCase().includes(appointmentSearchTerm.toLowerCase()) ||
        (appt.notes && appt.notes.toLowerCase().includes(appointmentSearchTerm.toLowerCase()));
      return searchMatch;
    })
    .sort((a, b) => {
      if (sortAppointmentsBy === 'appointmentDate') {
        return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      }
      if (sortAppointmentsBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      // Add more sorting options as needed
      return 0;
    });

  const handleDoctorClick = (doc) => setSelectedDoctor(doc);
  const handleBack = () => setSelectedDoctor(null);

  const formatDate = (dt) => {
    if (!dt) return 'N/A';
    try {
      return new Date(dt).toLocaleDateString();
    } catch {
      return dt;
    }
  };

  const formatTime = (dt) => {
    if (!dt) return 'N/A';
    try {
      return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dt;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  if (loadingDoctors) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            }}
          >
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{
                color: '#667eea',
                mb: 3,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
              Loading Healthcare Professionals
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we gather the best doctors for you...
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (errorDoctors) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
            px: 2,
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              maxWidth: 500,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#dc2626' }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Error: {errorDoctors}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try refreshing the page or contact our support team for assistance.
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflow: 'auto',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
          {!selectedDoctor ? (
            <>
              {/* Hero Section */}
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <HospitalIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{ 
                      fontWeight: 900, 
                      background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Sarvotham's Spine Care
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ 
                    color: 'text.secondary', 
                    maxWidth: 600, 
                    mx: 'auto', 
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Connect with world-class spine specialists and healthcare professionals
                </Typography>
              </Box>

              {/* Search and Filters */}
              <Paper
                elevation={12}
                sx={{
                  mb: 6,
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                >
                  <TextField
                    label="Search Doctors"
                    placeholder="Search by name or specialization..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ 
                      startAdornment: <SearchIcon sx={{ color: 'primary.main', mr: 1 }} /> 
                    }}
                    sx={{ flex: 1, maxWidth: 400 }}
                  />
                  <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                      label="Specialization"
                      startAdornment={<FilterListIcon sx={{ color: 'primary.main', mr: 1 }} />}
                    >
                      <MenuItem value="">
                        <em>All Specializations</em>
                      </MenuItem>
                      {uniqueSpecializations.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Min. Experience"
                    placeholder="Years"
                    variant="outlined"
                    type="number"
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    inputProps={{ min: '0' }}
                    InputProps={{ 
                      startAdornment: <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} /> 
                    }}
                    sx={{ minWidth: 160 }}
                  />
                </Stack>
              </Paper>

              {/* Doctors Grid */}
              <Box sx={{ mb: 8 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 4, 
                    textAlign: 'center',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  Our Medical Experts ({filteredDoctors.length})
                </Typography>
                
                <Grid container spacing={4}>
                  {filteredDoctors.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 6,
                          textAlign: 'center',
                          borderRadius: 4,
                          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        }}
                      >
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                          No doctors found matching your criteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search filters to find more results
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    filteredDoctors.map((doctor) => {
                      const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Unnamed Doctor';
                      return (
                        <Grid item key={doctor.id || doctor._id} xs={12} sm={6} lg={4}>
                          <Card

                        
                            elevation={16}
                            onClick={() => handleDoctorClick(doctor)}
                            sx={{
                              cursor: 'pointer',
                              height: '100%',
                              display: 'flex',
                              width : "400px",
                              height : "350px",
                              flexDirection: 'column',
                              position: 'relative',
                              overflow: 'visible',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                borderRadius: 'inherit',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              },
                              '&:hover::before': {
                                opacity: 1,
                              },
                            }}
                          >
                            {/* Header with Avatar */}
                            <Box 
                              sx={{ 
                                p: 3, 
                                pb: 2,
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 3,
                                width : "350px",
                                height : "250px",
                                position: 'relative',
                                zIndex: 1,
                              }}
                            >
                              {doctor.image ? (
                                <Avatar
                                  alt={`Dr. ${fullName}`}
                                  src={`data:image/jpeg;base64,${doctor.image}`}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    border: '4px solid rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                  }}
                                />
                              ) : (
                                <Avatar
                                  {...stringAvatar(fullName)}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      fontWeight: 700,
                                      color: 'text.primary',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    Dr. {fullName}
                                  </Typography>
                                  <VerifiedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                </Stack>
                                <Chip
                                  label={doctor.specialization || 'General Medicine'}
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                            </Box>

                            <Divider sx={{ mx: 2, borderColor: 'rgba(148, 163, 184, 0.12)' }} />

                            {/* Content */}
                            <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
                              <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Experience:</strong> {doctor.experience ? `${doctor.experience} Years` : 'N/A'}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <SchoolIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <strong>Education:</strong> {doctor.education || 'N/A'}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Contact:</strong> {doctor.contactNumber || 'N/A'}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <PaidIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'success.main',
                                      fontWeight: 600,
                                    }}
                                  >
                                    <strong>Fee:</strong> {doctor.consultationFee ? `â‚¹${doctor.consultationFee}` : 'Contact for pricing'}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>

                            {/* Footer */}
                            <Box 
                              sx={{ 
                                p: 2, 
                                pt: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Stack direction="row" spacing={0.5}>
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon 
                                    key={i}
                                    sx={{ 
                                      color: i < 4 ? '#fbbf24' : '#e5e7eb',
                                      fontSize: 16,
                                    }} 
                                  />
                                ))}
                              </Stack>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                View Details â†’
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </Box>

              {/* Appointments Section */}
              <Paper
                elevation={12}
                sx={{
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Appointments Header */}
                <Box
                  sx={{
                    p: 4,
                    pb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <CalendarIcon sx={{ fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
                      Your Appointments
                    </Typography>
                    <Chip
                      label={`${appointments.length} Total`}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  {/* Appointment Search and Sort */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Search Appointments"
                      placeholder="Search by reason, status, or notes..."
                      variant="outlined"
                      value={appointmentSearchTerm}
                      onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                      InputProps={{ 
                        startAdornment: <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} /> 
                      }}
                      sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'black',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'rgba(13, 12, 12, 0.83)' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(11, 7, 7, 1)' },
                        '& .MuiInputBase-input::placeholder': { color: 'rgba(9, 9, 9, 0.87)' },
                      }}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                      <InputLabel sx={{ color: 'rgba(7, 6, 6, 1)' }}>Sort By</InputLabel>
                      <Select
                        value={sortAppointmentsBy}
                        onChange={(e) => setSortAppointmentsBy(e.target.value)}
                        label="Sort By"
                        startAdornment={<FilterListIcon sx={{ color: 'rgba(9, 9, 9, 0.93)', mr: 1 }} />}
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(12, 10, 10, 0.89)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(12, 10, 10, 0.89)' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(12, 10, 10, 0.89)' },
                          '& .MuiSelect-icon': { color: 'rgba(12, 10, 10, 0.89)' },
                        }}
                      >
                        <MenuItem value="appointmentDate">Appointment Date</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>

                {/* Appointments Content */}
                <Box sx={{ p: 4 }}>
                  {loadingAppointments ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                      <CircularProgress sx={{ mr: 2 }} />
                      <Typography color="text.secondary">Loading your appointments...</Typography>
                    </Box>
                  ) : errorAppointments ? (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        
                        borderRadius: 3,
                      }}
                    >
                      <Typography color="error.main" variant="h6" sx={{ mb: 1 }}>
                        Unable to load appointments
                      </Typography>
                      <Typography color="text.secondary">
                        {errorAppointments}
                      </Typography>
                    </Paper>
                  ) : filteredAndSortedAppointments.length === 0 ? (
                    <Paper
                      sx={{
                        p: 6,
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        border: '2px dashed #cbd5e1',
                        borderRadius: 3,
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No appointments found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointments.length === 0 
                          ? "You don't have any appointments scheduled yet." 
                          : "No appointments match your search criteria."}
                      </Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredAndSortedAppointments.map((appt) => (
                        <Grid item xs={12} md={6} lg={4} key={appt.id}>
                          <Card
                            elevation={4}
                            sx={{
                              borderRadius: 3,
                              width : "300px",
                              height : "300px",
                              border: `2px solid ${
                                appt.status?.toLowerCase() === 'confirmed' ? '#10b981' :
                                appt.status?.toLowerCase() === 'pending' ? '#f59e0b' :
                                appt.status?.toLowerCase() === 'cancelled' ? '#ef4444' : '#6b7280'
                              }`,
                              background: `linear-gradient(135deg, ${
                                appt.status?.toLowerCase() === 'confirmed' ? 'rgba(16, 185, 129, 0.05)' :
                                appt.status?.toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.05)' :
                                appt.status?.toLowerCase() === 'cancelled' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(107, 114, 128, 0.05)'
                              }, rgba(255, 255, 255, 0.9))`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {/* Status Chip */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Chip
                                  label={appt.status || 'Unknown'}
                                  color={getStatusColor(appt.status)}
                                  variant="filled"
                                  size="small"
                                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  ID: {appt.id}
                                </Typography>
                              </Box>

                              {/* Date & Time */}
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                  {formatDate(appt.appointmentDate)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                                  {formatTime(appt.appointmentTime)}
                                </Typography>
                              </Box>

                              {/* Details */}
                              <Stack spacing={1.5}>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                    Reason for Visit
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {appt.reasonForVisit || 'Not specified'}
                                  </Typography>
                                </Box>

                                {appt.roomNumber && (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                      Room Number
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {appt.roomNumber}
                                    </Typography>
                                  </Box>
                                )}

                                {appt.notes && (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                      Notes
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary"
                                      sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                    >
                                      {appt.notes}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Paper>
            </>
          ) : (
            <DoctorDetailsPage doctor={selectedDoctor} onBack={handleBack} patient={patient} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

HomePage.propTypes = {
  patient: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default HomePage;
// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Divider,
//   Avatar,
//   CircularProgress,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   createTheme,
//   ThemeProvider,
//   CssBaseline,
//   Button,
//   Chip,
//   Fade,
//   Container,
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   FilterList as FilterListIcon,
//   AccessTime as AccessTimeIcon,
//   Paid as PaidIcon,
//   Phone as PhoneIcon,
//   Email as EmailIcon,
//   School as SchoolIcon,
//   ChevronLeft as ChevronLeftIcon,
//   CalendarToday as CalendarTodayIcon,
//   PermContactCalendar as PermContactCalendarIcon,
//   EventNote as EventNoteIcon,
//   LocationOn as LocationOnIcon,
//   Add as AddIcon,
// } from '@mui/icons-material';
// import {
//   deepOrange, deepPurple, blue, green,
// } from '@mui/material/colors';

// // =================================================================
// // THEME CUSTOMIZATION
// // This theme object provides a consistent look and feel using MUI.
// // It includes a custom color palette, typography settings, and
// // style overrides for components like Card, Avatar, and Button.
// // =================================================================
// const theme = createTheme({
//   typography: {
//     fontFamily: 'Inter, sans-serif',
//     h4: { fontWeight: 700 },
//     h5: { fontWeight: 600 },
//     h6: { fontWeight: 600, fontSize: '1.25rem' },
//     body1: { fontSize: '1rem' },
//     body2: { fontSize: '0.875rem' },
//   },
//   palette: {
//     primary: {
//       main: '#1a73e8', // A more vibrant blue
//       light: '#42a5f5',
//       dark: '#0e4a9e',
//     },
//     secondary: {
//       main: '#ffb300', // A warm gold for accents
//     },
//     background: {
//       default: '#f5f7fa', // Light gray background
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#1f2937', // Darker text for readability
//       secondary: '#6b7280', // Soft gray for secondary text
//     },
//     success: { main: '#4caf50' },
//     info: { main: '#2196f3' },
//     warning: { main: '#ff9800' },
//     error: { main: '#f44336' },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
//           transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-10px)',
//             boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
//           },
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           border: '4px solid',
//           borderColor: 'rgba(26, 115, 232, 0.2)',
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 12,
//             backgroundColor: '#ffffff',
//             transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
//             '&.Mui-focused fieldset': {
//               borderColor: '#1a73e8',
//               boxShadow: '0 0 0 4px rgba(26, 115, 232, 0.2)',
//             },
//             '&:hover fieldset': {
//               borderColor: '#1a73e8',
//             },
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           backgroundColor: '#ffffff',
//           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#1a73e8',
//             boxShadow: '0 0 0 4px rgba(26, 115, 232, 0.2)',
//           },
//         },
//         icon: {
//           color: '#6b7280',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           textTransform: 'none',
//           fontWeight: 600,
//           padding: '10px 24px',
//         },
//         containedPrimary: {
//           '&:hover': {
//             backgroundColor: '#0e4a9e',
//           },
//         },
//       },
//     },
//   },
// });

// // =================================================================
// // HELPER FUNCTIONS
// // These functions are used for creating unique avatars and formatting dates.
// // =================================================================

// /**
//  * Generates a color hash from a string.
//  * @param {string} string - The input string, e.g., a doctor's name.
//  * @returns {string} The hex color code.
//  */
// function stringToColor(string) {
//   let hash = 0;
//   for (let i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// /**
//  * Creates an avatar object with background color and initials.
//  * @param {string} name - The full name of the person.
//  * @returns {object} The avatar properties.
//  */
// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
//     : 'DR';
//   return {
//     sx: { bgcolor: stringToColor(name || 'Doctor') },
//     children: initials,
//   };
// }

// /**
//  * Formats a date string into a user-friendly format.
//  * @param {string} dt - The date string.
//  * @returns {string} The formatted date or 'N/A'.
//  */
// const formatDate = (dt) => {
//   if (!dt) return 'N/A';
//   try {
//     return new Date(dt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   } catch {
//     return dt;
//   }
// };

// /**
//  * Formats a time string into a user-friendly format.
//  * @param {string} dt - The time string.
//  * @returns {string} The formatted time or 'N/A'.
//  */
// const formatTime = (dt) => {
//   if (!dt) return 'N/A';
//   try {
//     return new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//   } catch {
//     return dt;
//   }
// };

// /**
//  * Determines the color of the status chip based on the status text.
//  * @param {string} status - The appointment status.
//  * @returns {string} The MUI color string.
//  */
// const getStatusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'scheduled':
//       return 'primary';
//     case 'completed':
//       return 'success';
//     case 'cancelled':
//       return 'error';
//     default:
//       return 'default';
//   }
// };

// // =================================================================
// // DOCTOR DETAILS PAGE COMPONENT
// // This component displays a detailed view of a selected doctor.
// // It includes the doctor's profile, contact information, and a button
// // to simulate booking an appointment.
// // =================================================================

// const DoctorDetailsPage = ({ doctor, onBack, patient }) => {
//   if (!doctor) {
//     return null;
//   }

//   const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Unnamed Doctor';

//   const handleBookAppointment = () => {
//     // This is a placeholder for the booking logic.
//     // In a real application, this would open a form or a booking modal.
//     console.log(`Booking an appointment with Dr. ${fullName} for patient ${patient.name}`);
//     alert(`Booking an appointment with Dr. ${fullName}. (This is a placeholder action)`);
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4, my: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3 }}>
//       <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
//         <Button
//           onClick={onBack}
//           variant="outlined"
//           startIcon={<ChevronLeftIcon />}
//           sx={{ textTransform: 'none', borderRadius: 8 }}
//         >
//           Back to all doctors
//         </Button>
//       </Box>

//       <Grid container spacing={4}>
//         <Grid item xs={12} md={5}>
//           <Card elevation={0} sx={{ p: 2, textAlign: 'center' }}>
//             {doctor.image ? (
//               <Avatar
//                 alt={`Dr. ${fullName}`}
//                 src={`data:image/png;base64,${doctor.image}`}
//                 sx={{
//                   width: 160,
//                   height: 160,
//                   mb: 2,
//                   mx: 'auto',
//                   boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
//                   border: '5px solid',
//                   borderColor: blue[500],
//                 }}
//               />
//             ) : (
//               <Avatar
//                 {...stringAvatar(fullName)}
//                 sx={{
//                   width: 160,
//                   height: 160,
//                   mb: 2,
//                   mx: 'auto',
//                   fontSize: '4rem',
//                   fontWeight: 700,
//                   boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
//                   border: '5px solid',
//                   borderColor: blue[500],
//                 }}
//               />
//             )}
//             <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
//               {fullName}
//             </Typography>
//             <Chip
//               label={doctor.specialization || 'Specialization not listed'}
//               color="secondary"
//               size="large"
//               sx={{ mt: 1, fontWeight: 600, letterSpacing: '0.03em' }}
//             />
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={7}>
//           <Card elevation={0} sx={{ p: 2, height: '100%' }}>
//             <Typography variant="h6" color="primary.dark" sx={{ mb: 2 }}>
//               About
//             </Typography>
//             <Typography variant="body1" color="text.secondary" paragraph>
//               {doctor.bio || 'This doctor has not provided a biography yet. They are a dedicated professional committed to patient care.'}
//             </Typography>

//             <Divider sx={{ my: 2 }} />

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <SchoolIcon fontSize="small" color="primary" /> <strong>Education:</strong> {doctor.education || 'N/A'}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <AccessTimeIcon fontSize="small" color="primary" /> <strong>Experience:</strong> {doctor.experience ? `${doctor.experience} Years` : 'N/A'}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <LocationOnIcon fontSize="small" color="primary" /> <strong>Location:</strong> {doctor.clinicLocation || 'N/A'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <PhoneIcon fontSize="small" color="primary" /> <strong>Contact:</strong> {doctor.contactNumber || 'N/A'}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <EmailIcon fontSize="small" color="primary" /> <strong>Email:</strong> {doctor.email || 'N/A'}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <PaidIcon fontSize="small" color="primary" /> <strong>Consultation Fee:</strong> {doctor.consultationFee ? `â‚¹${doctor.consultationFee}` : 'N/A'}
//                 </Typography>
//               </Grid>
//             </Grid>
            
//             <Box sx={{ mt: 3, textAlign: 'center' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleBookAppointment}
//                 startIcon={<AddIcon />}
//                 size="large"
//                 sx={{
//                   boxShadow: '0 4px 12px rgba(26, 115, 232, 0.25)',
//                   '&:hover': {
//                     boxShadow: '0 6px 18px rgba(26, 115, 232, 0.4)',
//                   },
//                 }}
//               >
//                 Book Appointment
//               </Button>
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// // =================================================================
// // HOME PAGE COMPONENT
// // This is the main page that lists doctors and patient appointments.
// // It includes search and filter functionality for doctors and appointments.
// // =================================================================

// const HomePage = ({ patient, onDoctorClick, selectedDoctor, onBack }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [errorDoctors, setErrorDoctors] = useState(null);

//   const [appointments, setAppointments] = useState([]);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);
//   const [errorAppointments, setErrorAppointments] = useState(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterSpecialization, setFilterSpecialization] = useState('');
//   const [filterExperience, setFilterExperience] = useState('');

//   const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
//   const [sortAppointmentsBy, setSortAppointmentsBy] = useState('appointmentDate');

//   // Fetch doctors data on component mount.
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         setErrorDoctors(null);

//         const res = await fetch(`${import.meta.env.VITE_DOCTOR_SERVICE_URL}/api/doctors/all');
//         if (!res.ok) throw new Error(`Failed to fetch doctors: ${res.status} ${res.statusText}`);
//         const doctorsData = await res.json();

//         // Fetch user images for doctors who don't have one.
//         const doctorsWithImages = await Promise.all(
//           doctorsData.map(async (doctor) => {
//             if (doctor.image) {
//               return doctor;
//             }
//             try {
//               const userRes = await fetch(`http://localhost:2002/api/users/${doctor.customId}`);
//               if (userRes.ok) {
//                 const userData = await userRes.json();
//                 const profilePicBase64 = userData.image || null;
//                 return { ...doctor, image: profilePicBase64 };
//               }
//             } catch (fetchError) {
//               console.error(`Failed to fetch user image for doctor ${doctor.customId}:`, fetchError);
//             }
//             return { ...doctor, image: null };
//           }),
//         );
//         setDoctors(doctorsWithImages);
//       } catch (err) {
//         setErrorDoctors(err.message);
//         console.error("Error fetching doctors:", err);
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // Fetch patient appointments on component mount.
//   useEffect(() => {
//     const fetchPatientAndAppointments = async () => {
//       setLoadingAppointments(true);
//       setErrorAppointments(null);
//       try {
//         const patientRes = await fetch(`http://localhost:2008/api/patients/${patientId}`);
//         if (!patientRes.ok) {
//           throw new Error(`Failed to fetch patient details: ${patientRes.status} ${patientRes.statusText}`);
//         }
//         const patientData = await patientRes.json();
//         const patientId = patientData._id;

//         if (!patientId) {
//           throw new Error('Patient ID not found in the fetched data.');
//         }

//         const appointmentsRes = await fetch(`http://localhost:2010/api/appointments/patient/${patientId}`);
//         if (!appointmentsRes.ok) {
//           throw new Error(`Failed to fetch appointments: ${appointmentsRes.status} ${appointmentsRes.statusText}`);
//         }
//         const data = await appointmentsRes.json();
//         setAppointments(data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setErrorAppointments(err.message);
//       } finally {
//         setLoadingAppointments(false);
//       }
//     };
//     fetchPatientAndAppointments();
//   }, []);
  
//   // Memoized lists for performance
//   const uniqueSpecializations = useMemo(() => doctors.length > 0
//     ? [...new Set(doctors.map((d) => d.specialization))].sort()
//     : [], [doctors]);

//   const filteredDoctors = useMemo(() => doctors.filter((doctor) => {
//     const nameMatch =
//       doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
//     const specMatch = filterSpecialization === '' || doctor.specialization === filterSpecialization;
//     const expMatch = filterExperience === '' || (doctor.experience !== undefined && doctor.experience >= parseInt(filterExperience, 10));
//     return (searchTerm === '' || nameMatch) && specMatch && expMatch;
//   }), [doctors, searchTerm, filterSpecialization, filterExperience]);

//   const filteredAndSortedAppointments = useMemo(() => appointments
//     .filter((appt) => {
//       const searchMatch =
//         appointmentSearchTerm === '' ||
//         appt.reasonForVisit?.toLowerCase().includes(appointmentSearchTerm.toLowerCase()) ||
//         appt.status?.toLowerCase().includes(appointmentSearchTerm.toLowerCase()) ||
//         (appt.notes && appt.notes.toLowerCase().includes(appointmentSearchTerm.toLowerCase()));
//       return searchMatch;
//     })
//     .sort((a, b) => {
//       if (sortAppointmentsBy === 'appointmentDate') {
//         return new Date(b.appointmentDate) - new Date(a.appointmentDate);
//       }
//       if (sortAppointmentsBy === 'status') {
//         return a.status.localeCompare(b.status);
//       }
//       return 0;
//     }), [appointments, appointmentSearchTerm, sortAppointmentsBy]);

//   // Loading state for doctors
//   if (loadingDoctors) {
//     return (
//       <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh' }}>
//         <CircularProgress color="primary" size={60} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
//           Loading Doctors...
//         </Typography>
//       </Box>
//     );
//   }

//   // Error state for doctors
//   if (errorDoctors) {
//     return (
//       <Box sx={{ mt: 8, textAlign: 'center', color: 'error.main' }}>
//         <Typography variant="h6">Error: {errorDoctors}</Typography>
//         <Typography variant="body2">Please try again later or contact support.</Typography>
//       </Box>
//     );
//   }

//   // The main layout with search, filter, and the list of doctors/appointments
//   return (
//     <Box sx={{ width: '100%' }}>
//       {/* Search and Filter Section */}
//       <Typography
//         variant="h4"
//         component="h1"
//         gutterBottom
//         sx={{
//           fontWeight: 'bold',
//           color: 'primary.dark',
//           mb: 4,
//           pt: 2,
//           textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
//           textAlign: 'center',
//         }}
//       >
//         Find Your Doctor at Sarvotham's Spine Care
//       </Typography>

//       <Box
//         sx={{
//           mb: 5,
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'row' },
//           gap: 2,
//           justifyContent: 'center',
//           alignItems: 'center',
//           width: '100%',
//           maxWidth: 1100,
//           p: 3,
//           bgcolor: 'background.paper',
//           borderRadius: 4,
//           boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
//           mx: 'auto',
//         }}
//       >
//         <TextField
//           label="Search by Name"
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
//           }}
//           sx={{ flexGrow: 1 }}
//         />
//         <FormControl variant="outlined" sx={{ minWidth: 200, flexGrow: 1 }}>
//           <InputLabel>Specialization</InputLabel>
//           <Select
//             value={filterSpecialization}
//             onChange={(e) => setFilterSpecialization(e.target.value)}
//             label="Specialization"
//             startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
//           >
//             <MenuItem value="">
//               <em>All</em>
//             </MenuItem>
//             {uniqueSpecializations.map((spec) => (
//               <MenuItem key={spec} value={spec}>
//                 {spec}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           label="Min. Experience"
//           variant="outlined"
//           type="number"
//           value={filterExperience}
//           onChange={(e) => setFilterExperience(e.target.value)}
//           inputProps={{ min: '0' }}
//           InputProps={{
//             startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} />,
//           }}
//           sx={{ minWidth: 180, flexGrow: 0.5 }}
//         />
//       </Box>

//       {/* Doctor Cards Grid */}
//       <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
//         {filteredDoctors.length === 0 ? (
//           <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
//             No doctors found matching your criteria.
//           </Typography>
//         ) : (
//           filteredDoctors.map((doctor) => {
//             const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Unnamed Doctor';
//             return (
//               <Grid
//                 item
//                 key={doctor.id || doctor._id}
//                 xs={12}
//                 sm={10}
//                 md={6}
//                 lg={4}
//                 onClick={() => onDoctorClick(doctor)}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
//                       {doctor.image ? (
//                         <Avatar
//                           alt={`Dr. ${fullName}`}
//                           src={`data:image/png;base64,${doctor.image}`}
//                           sx={{ width: 96, height: 96, mb: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
//                         />
//                       ) : (
//                         <Avatar
//                           {...stringAvatar(fullName)}
//                           sx={{
//                             width: 96,
//                             height: 96,
//                             mb: 2,
//                             fontSize: '2.5rem',
//                             fontWeight: 700,
//                             boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
//                           }}
//                         />
//                       )}
//                       <Typography variant="h5" color="primary.dark" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
//                         {fullName}
//                       </Typography>
//                       <Chip
//                         label={doctor.specialization || 'Specialization not listed'}
//                         color="secondary"
//                         size="small"
//                         sx={{ mt: 1, fontWeight: 600, letterSpacing: '0.03em' }}
//                       />
//                     </Box>
//                     <Divider sx={{ my: 2 }} />
//                     <Box textAlign="left">
//                       <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                         <PhoneIcon fontSize="small" color="action" /> <strong>Contact:</strong> {doctor.contactNumber || 'N/A'}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                         <EmailIcon fontSize="small" color="action" /> <strong>Email:</strong> {doctor.email || 'N/A'}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                         <SchoolIcon fontSize="small" color="action" /> <strong>Education:</strong> {doctor.education || 'N/A'}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                         <AccessTimeIcon fontSize="small" color="action" /> <strong>Experience:</strong> {doctor.experience ? `${doctor.experience} Years` : 'N/A'}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <PaidIcon fontSize="small" color="primary" /> <strong>Consultation Fee:</strong> {doctor.consultationFee ? `â‚¹${doctor.consultationFee}` : 'N/A'}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             );
//           })
//         )}
//       </Grid>

//       {/* Appointments Section */}
//       <Box sx={{ mt: 8, width: '100%', maxWidth: 1000, mx: 'auto', textAlign: 'left' }}>
//         <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 700, mb: 3 }}>
//           <PermContactCalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Your Appointments
//         </Typography>
//         <Box
//           sx={{
//             mb: 3,
//             display: 'flex',
//             flexDirection: { xs: 'column', sm: 'row' },
//             gap: 2,
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             width: '100%',
//             p: 2,
//             bgcolor: 'background.paper',
//             borderRadius: 2,
//             boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//           }}
//         >
//           <TextField
//             label="Search Appointments"
//             variant="outlined"
//             value={appointmentSearchTerm}
//             onChange={(e) => setAppointmentSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
//             }}
//             sx={{ flexGrow: 1 }}
//           />
//           <FormControl variant="outlined" sx={{ minWidth: 180 }}>
//             <InputLabel>Sort By</InputLabel>
//             <Select
//               value={sortAppointmentsBy}
//               onChange={(e) => setSortAppointmentsBy(e.target.value)}
//               label="Sort By"
//               startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
//             >
//               <MenuItem value="appointmentDate">Appointment Date</MenuItem>
//               <MenuItem value="status">Status</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {loadingAppointments ? (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
//             <CircularProgress size={30} />
//             <Typography>Loading appointments...</Typography>
//           </Box>
//         ) : errorAppointments ? (
//           <Typography color="error">{errorAppointments}</Typography>
//         ) : filteredAndSortedAppointments.length === 0 ? (
//           <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
//             No appointments found.
//           </Typography>
//         ) : (
//           filteredAndSortedAppointments.map((appt) => (
//             <Card key={appt._id} sx={{ mb: 2, boxShadow: 3 }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                   <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <CalendarTodayIcon fontSize="small" />
//                     {formatDate(appt.appointmentDate)} at {formatTime(appt.appointmentTime)}
//                   </Typography>
//                   <Chip
//                     label={appt.status}
//                     color={getStatusColor(appt.status)}
//                     size="small"
//                     sx={{ textTransform: 'capitalize', fontWeight: 600 }}
//                   />
//                 </Box>
//                 <Divider sx={{ my: 1 }} />
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <EventNoteIcon fontSize="small" color="action" />
//                   <strong>Reason:</strong> {appt.reasonForVisit || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                   <strong>Notes:</strong> {appt.notes || 'N/A'}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </Box>
//     </Box>
//   );
// };

// // =================================================================
// // MAIN APP COMPONENT
// // This is the root component that manages the page state (Home vs. Doctor Details).
// // =================================================================

// export default function App() {
//   const [selectedDoctor, setSelectedDoctor] = useState(null);

//   // Placeholder for patient data. In a real app, this would be fetched
//   // or passed in from a parent component.
//   const patient = {
//     userId: "68827cfc64d9b4574f963f52",
//     _id: "68827cfc64d9b4574f963f52",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     profilePic: null,
//   };

//   const handleDoctorClick = (doc) => setSelectedDoctor(doc);
//   const handleBack = () => setSelectedDoctor(null);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           mt: 4,
//           px: { xs: 2, md: 4 },
//           pb: 6,
//           bgcolor: 'background.default',
//           minHeight: 'calc(100vh - 64px)',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: '100%',
//         }}
//       >
//         <Fade in={!selectedDoctor} timeout={500}>
//           <Box sx={{ width: '100%', display: selectedDoctor ? 'none' : 'block' }}>
//             <HomePage
//               patient={patient}
//               onDoctorClick={handleDoctorClick}
//               selectedDoctor={selectedDoctor}
//               onBack={handleBack}
//             />
//           </Box>
//         </Fade>

//         <Fade in={!!selectedDoctor} timeout={500}>
//           <Box sx={{ width: '100%', display: selectedDoctor ? 'block' : 'none' }}>
//             {selectedDoctor && (
//               <DoctorDetailsPage doctor={selectedDoctor} onBack={handleBack} patient={patient} />
//             )}
//           </Box>
//         </Fade>
//       </Box>
//     </ThemeProvider>
//   );
// }
