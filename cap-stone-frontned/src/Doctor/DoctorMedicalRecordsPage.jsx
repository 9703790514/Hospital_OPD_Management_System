import React, { useState, useEffect } from 'react';
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
  Button,
  CssBaseline,
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import HealingIcon from '@mui/icons-material/Healing';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BiotechIcon from '@mui/icons-material/Biotech';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SpaIcon from '@mui/icons-material/Spa';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em' },
    body1: { fontSize: '1.05rem', lineHeight: 1.7 },
  },
  palette: {
    primary: { main: '#0077b6' },
    secondary: { main: '#48cae4' },
    background: { default: '#f0f4f8', paper: '#ffffff' },
    text: { primary: '#2d3748', secondary: '#718096' },
  },
});

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

const DoctorMedicalRecordsPage = ({ medicalRecordId, appointment, onBack, onNavigate }) => {
  // States for data and loading/error management
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [nurseCheckup, setNurseCheckup] = useState(null);
  const [loadingMedicalRecord, setLoadingMedicalRecord] = useState(true);
  const [loadingNurseCheckup, setLoadingNurseCheckup] = useState(true);
  const [errorMedicalRecord, setErrorMedicalRecord] = useState(null);
  const [errorNurseCheckup, setErrorNurseCheckup] = useState(null);

  useEffect(() => {
    // Fetch medical record data
    if (!medicalRecordId) {
      setErrorMedicalRecord("Medical Record ID is not available for fetching medical records.");
      setLoadingMedicalRecord(false);
      return;
    }

    const fetchMedicalRecord = async () => {
      setLoadingMedicalRecord(true);
      setErrorMedicalRecord(null);
      try {
        const response = await fetch(`http://localhost:2006/api/medical-records/${medicalRecordId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch medical record: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setMedicalRecord(data);
      } catch (err) {
        setErrorMedicalRecord(err.message || 'Failed to load medical record.');
      } finally {
        setLoadingMedicalRecord(false);
      }
    };

    fetchMedicalRecord();
  }, [medicalRecordId]);

  useEffect(() => {
    // Fetch nurse checkup data using appointment ID
    const nurseCheckupId = appointment?.id || appointment?.appointmentId;

    if (!nurseCheckupId) {
      setErrorNurseCheckup("Nurse Checkup ID is not available.");
      setLoadingNurseCheckup(false);
      return;
    }

    const fetchNurseCheckup = async () => {
      setLoadingNurseCheckup(true);
      setErrorNurseCheckup(null);
      try {
        const response = await fetch(`http://localhost:2012/api/nurse-checkups/appointment/${nurseCheckupId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch nurse checkup data: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setNurseCheckup(data);
      } catch (err) {
        setErrorNurseCheckup(err.message || 'Failed to load nurse checkup data.');
      } finally {
        setLoadingNurseCheckup(false);
      }
    };

    fetchNurseCheckup();
  }, [appointment]);

  const handleViewPrescription = () => {
    onNavigate(`prescriptions-detail/${medicalRecordId}`);
  };

  const handleViewLabReports = () => {
    onNavigate(`diagnostic-tests-detail/${medicalRecordId}`);
  };

  const isLoading = loadingMedicalRecord || loadingNurseCheckup;
  const hasError = errorMedicalRecord || errorNurseCheckup;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 3 }}>
          Back to Appointments
        </Button>

        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
          Medical Record Details
        </Typography>

        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'medium', color: 'text.secondary' }}>
          Appointment ID: <strong>{appointment?.id || appointment?.appointmentId || 'N/A'}</strong>
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading Medical Data...
            </Typography>
          </Box>
        )}

        {hasError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMedicalRecord || errorNurseCheckup || 'An unexpected error occurred.'}
          </Alert>
        )}

        {!isLoading && !hasError && !medicalRecord && !nurseCheckup && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No medical or nurse checkup data found for this record.
          </Alert>
        )}

        {!isLoading && (medicalRecord || nurseCheckup) && (
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            }}
          >
            {medicalRecord && (
              <>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                  Patient Medical Record
                </Typography>
                <List disablePadding sx={{ mb: 3 }}>
                  <StyledListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventNoteIcon sx={{ mr: 1, color: 'info.main' }} />
                          Record ID: {medicalRecord.id || 'N/A'}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <ScienceIcon fontSize="small" sx={{ mr: 1 }} />
                            Diagnosis: {medicalRecord.diagnosis || 'No diagnosis provided'}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <HealingIcon fontSize="small" sx={{ mr: 1 }} />
                            Treatment Plan: {medicalRecord.treatmentPlan || 'No treatment plan details'}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                            Notes: {medicalRecord.notes || 'No notes provided'}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Recorded on: {medicalRecord.recordDate ? new Date(medicalRecord.recordDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box>
                      }
                    />
                  </StyledListItem>
                </List>
              </>
            )}

            {nurseCheckup && (
              <>
                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                  Nurse Checkup & Vitals
                </Typography>
                <List disablePadding>
                  <StyledListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MonitorHeartIcon sx={{ mr: 1, color: 'info.main' }} />
                          Vitals
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <HealingIcon fontSize="small" sx={{ mr: 1 }} />
                            Blood Pressure: {nurseCheckup.vitals?.bloodPressure?.systolic}/{nurseCheckup.vitals?.bloodPressure?.diastolic} {nurseCheckup.vitals?.bloodPressure?.unit}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <SpaIcon fontSize="small" sx={{ mr: 1 }} />
                            Blood Sugar: {nurseCheckup.vitals?.bloodSugar?.value} {nurseCheckup.vitals?.bloodSugar?.unit}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <GraphicEqIcon fontSize="small" sx={{ mr: 1 }} />
                            Pulse Rate: {nurseCheckup.vitals?.pulseRate} beats/min
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <BubbleChartIcon fontSize="small" sx={{ mr: 1 }} />
                            Respiratory Rate: {nurseCheckup.vitals?.respiratoryRate} breaths/min
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <ThermostatIcon fontSize="small" sx={{ mr: 1 }} />
                            Temperature: {nurseCheckup.vitals?.temperature?.value} °{nurseCheckup.vitals?.temperature?.unit}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <ScienceIcon fontSize="small" sx={{ mr: 1 }} />
                            Oxygen Saturation: {nurseCheckup.vitals?.oxygenSaturation?.value} {nurseCheckup.vitals?.oxygenSaturation?.unit}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <FitnessCenterIcon fontSize="small" sx={{ mr: 1 }} />
                            Weight: {nurseCheckup.vitals?.weightKg} kg
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <HeightIcon fontSize="small" sx={{ mr: 1 }} />
                            Height: {nurseCheckup.vitals?.heightCm} cm
                          </Typography>
                        </Box>
                      }
                    />
                  </StyledListItem>

                  <StyledListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AssignmentIcon sx={{ mr: 1, color: 'info.main' }} />
                          Notes
                        </Typography>
                      }
                      secondary={
                        <Typography component="span" variant="body2" color="text.primary">
                          {nurseCheckup.notes || 'No notes provided'}
                        </Typography>
                      }
                    />
                  </StyledListItem>
                </List>
              </>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ReceiptLongIcon />}
                onClick={handleViewPrescription}
                sx={{ py: 1, px: 2, fontWeight: 'bold', borderRadius: 2 }}
              >
                Prescription
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<BiotechIcon />}
                onClick={handleViewLabReports}
                sx={{ py: 1, px: 2, fontWeight: 'bold', borderRadius: 2 }}
              >
                Lab Reports
              </Button>
            </Box>
          </Paper>
        )}
        <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Detailed medical history for the selected patient.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

DoctorMedicalRecordsPage.propTypes = {
  medicalRecordId: PropTypes.string,
  appointment: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default DoctorMedicalRecordsPage;
