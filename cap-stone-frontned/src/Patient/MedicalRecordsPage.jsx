import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Grid,
  Fade,
  Zoom,
  CssBaseline,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BiotechIcon from '@mui/icons-material/Biotech';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  MonitorHeartOutlined as HeartIcon,
  ThermostatOutlined as TemperatureIcon,
  CompressOutlined as BpIcon,
  LocalHospitalOutlined as HospitalIcon,
  BloodtypeOutlined as BloodIcon,
  MonitorWeightOutlined as WeightIcon,
  HeightOutlined as HeightIcon
} from '@mui/icons-material';

// Custom Material-UI theme
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.05em' },
    h5: { fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)' },
    h6: { fontWeight: 600, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' },
    body1: { fontSize: '1.05rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
  },
  palette: {
    primary: { main: '#0077b6', dark: '#005f93' },
    secondary: { main: '#48cae4', dark: '#37a5be' },
    success: { main: '#2ecc71', dark: '#27ae60' },
    error: { main: '#e74c3c' },
    info: { main: '#3498db' },
    background: { default: '#f0f4f8', paper: '#ffffff' },
    text: { primary: '#2c3e50', secondary: '#7f8c8d' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s',
          '&:hover': {
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

// A custom styled header with an animated underline effect
const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  letterSpacing: '-0.05em',
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
  mb: 3,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
    animation: 'underline-fade 1s ease-out forwards',
  },
  '@keyframes underline-fade': {
    '0%': { width: '0%' },
    '100%': { width: '60%' },
  },
}));

// Styled component for a vital sign card, with a hover effect
const VitalCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[8],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: 16,
}));

// Component to display a vital sign with an icon
const VitalSignDisplay = ({ icon, label, value, unit, color }) => (
  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ mb: 1, color: color }}>
      {icon}
    </Box>
    <Typography variant="h6" color="text.secondary" noWrap>
      {label}
    </Typography>
    <Typography variant="h5" component="div" sx={{ fontWeight: 700, mt: 0.5 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {unit}
    </Typography>
  </CardContent>
);

const MedicalRecordsPage = ({ medicalRecordId, appointmentId, onBack, onNavigate }) => {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nurseCheckup, setNurseCheckup] = useState(null);
  const [loadingCheckup, setLoadingCheckup] = useState(false);
  const [errorCheckup, setErrorCheckup] = useState(null);

  useEffect(() => {
    // This is a placeholder for a real API call.
    // The fetch calls are kept as they were in the original code.
    const fetchMedicalRecord = async () => {
      if (!medicalRecordId) {
        setError('Medical Record ID is not available.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(import.meta.env.VITE_MEDICAL_RECORD_SERVICE_URL + '/api/medical-records/' + medicalRecordId);
        if (!response.ok) {
          if (response.status === 404) {
            setMedicalRecord(null);
            return;
          }
          const errorText = await response.text();
          throw new Error('Failed to fetch medical record: ' + response.status + ' - ' + errorText);
        }
        const data = await response.json();
        setMedicalRecord(data);
      } catch (err) {
        setError(err.message || 'Failed to load medical record.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNurseCheckup = async () => {
      if (!appointmentId) {
        setErrorCheckup('Appointment ID is not available.');
        return;
      }
      setLoadingCheckup(true);
      setErrorCheckup(null);
      try {
        const res = await fetch(import.meta.env.VITE_NURSE_CHECKUP_SERVICE_URL + '/api/nurse-checkups/appointment/' + appointmentId);
        if (!res.ok) {
          const text = await res.text();
          throw new Error('Failed to fetch nurse checkup info: ' + res.status + ' - ' + text);
        }
        const data = await res.json();
        setNurseCheckup(data);
      } catch (err) {
        setErrorCheckup(err.message || 'Failed to load nurse checkup info.');
      } finally {
        setLoadingCheckup(false);
      }
    };

    fetchMedicalRecord();
    fetchNurseCheckup();
  }, [medicalRecordId, appointmentId]);

  const handleViewPrescription = () => {
    if (onNavigate) {
      onNavigate(`prescriptions/${medicalRecordId}`);
    }
  };

  const handleViewLabReports = () => {
    if (onNavigate) {
      onNavigate(`lab-reports/${medicalRecordId}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, sm: 4, md: 6 },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%' }}>
         <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
  <Button
    variant="contained"
    color="primary"
    startIcon={<ArrowBackIcon />}
    onClick={onBack}
    sx={{
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateX(-4px)' },
      px: 3,
      py: 1.5,
      textTransform: 'none',
      fontWeight: 600,
    }}
  >
    Back to Appointments
  </Button>
</Box>

          <StyledHeader variant="h4" gutterBottom>
            Medical Record Details
          </StyledHeader>
          {/* <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Viewing details for record ID: <strong>{medicalRecordId || 'N/A'}</strong>
          </Typography> */}

          {loadingCheckup && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
              <CircularProgress color="primary" />
              <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Nurse Checkup Info...</Typography>
            </Box>
          )}

          {errorCheckup && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {errorCheckup}
            </Alert>
          )}

          {nurseCheckup && (
            <Zoom in timeout={800}>
              <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4, bgcolor: 'background.paper', overflow: 'hidden' }} elevation={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HospitalIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                  <Typography variant="h5" color="text.primary">
                    Nurse Checkup Vitals
                  </Typography>
                  <Chip
                    label={`Appointment ID: ${nurseCheckup.appointmentId}`}
                    size="small"
                    color="primary"
                    sx={{ ml: 2, fontWeight: 700 }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <VitalCard elevation={2}>
                      <VitalSignDisplay
                        icon={<BpIcon sx={{ fontSize: '3rem' }} />}
                        label="Blood Pressure"
                        value={`${nurseCheckup.vitals.bloodPressure.systolic}/${nurseCheckup.vitals.bloodPressure.diastolic}`}
                        unit={nurseCheckup.vitals.bloodPressure.unit}
                        color={theme.palette.info.main}
                      />
                    </VitalCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <VitalCard elevation={2}>
                      <VitalSignDisplay
                        icon={<BloodIcon sx={{ fontSize: '3rem' }} />}
                        label="Blood Sugar"
                        value={nurseCheckup.vitals.bloodSugar.value}
                        unit={nurseCheckup.vitals.bloodSugar.unit}
                        color={theme.palette.success.main}
                      />
                    </VitalCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <VitalCard elevation={2}>
                      <VitalSignDisplay
                        icon={<HeartIcon sx={{ fontSize: '3rem' }} />}
                        label="Pulse Rate"
                        value={nurseCheckup.vitals.pulseRate}
                        unit="bpm"
                        color={theme.palette.error.main}
                      />
                    </VitalCard>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <VitalCard elevation={2}>
                      <VitalSignDisplay
                        icon={<TemperatureIcon sx={{ fontSize: '3rem' }} />}
                        label="Temperature"
                        value={nurseCheckup.vitals.temperature.value}
                        unit={`°${nurseCheckup.vitals.temperature.unit}`}
                        color={theme.palette.warning.main || '#f39c12'}
                      />
                    </VitalCard>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                      Notes: {nurseCheckup.notes || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          )}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Medical Record...</Typography>
            </Box>
          )}

          {error && (
            <Fade in>
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Fade>
          )}

          {!loading && !error && !medicalRecord && (
            <Fade in>
              <Alert severity="info" sx={{ mb: 2 }}>
                No medical record found for this appointment. Please check again later.
              </Alert>
            </Fade>
          )}

          {!loading && medicalRecord && (
            <Fade in timeout={800}>
              <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.paper', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventNoteIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                  <Typography variant="h5" color="text.primary">
                    Record Overview
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <List disablePadding>
                  {[
                    { primary: 'Diagnosis', secondary: medicalRecord.diagnosis || 'No diagnosis provided' },
                    { primary: 'Treatment Plan', secondary: medicalRecord.treatmentPlan || 'No treatment plan details' },
                    { primary: 'Notes', secondary: medicalRecord.notes || 'No notes provided' },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemText
                          primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{item.primary}</Typography>}
                          secondary={<Typography variant="body2" color="text.secondary">{item.secondary}</Typography>}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<ReceiptLongIcon />}
                      onClick={handleViewPrescription}
                      color="info"
                    >
                      View Prescription
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<BiotechIcon />}
                      onClick={handleViewLabReports}
                    >
                      View Lab Reports
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

MedicalRecordsPage.propTypes = {
  medicalRecordId: PropTypes.string,
  appointmentId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default MedicalRecordsPage;
