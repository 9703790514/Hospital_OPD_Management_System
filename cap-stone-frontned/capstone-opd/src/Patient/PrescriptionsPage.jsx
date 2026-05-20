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
  Divider,
  Button,
  Fade,
  Zoom,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // For medicine
import BiotechIcon from '@mui/icons-material/Biotech'; // For test
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  // ... (your existing theme customizations) ...
});

const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  letterSpacing: '-0.05em',
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
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
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

const PrescriptionsPage = ({ medicalRecordId, onBack }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!medicalRecordId) {
        setError("Medical Record ID is not available.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:2006/api/prescriptions/medical/${medicalRecordId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setPrescriptions([]);
            setLoading(false);
            return;
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch prescriptions: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err.message || "Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [medicalRecordId]);

  // Helper: icon and chip styles by prescription type
  const getTypeChip = (type) =>
    type === 'Test'
      ? (
          <Chip
            label="Test"
            icon={<BiotechIcon sx={{ color: 'secondary.main' }} />}
            color="secondary"
            sx={{ mr: 1, fontWeight: 'bold' }}
          />
        )
      : (
          <Chip
            label="Medicine"
            icon={<ReceiptLongIcon sx={{ color: 'primary.main' }} />}
            color="primary"
            sx={{ mr: 1, fontWeight: 'bold' }}
          />
        );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
          <Fade in timeout={500}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{
                  mb: 3,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                }}
              >
                Back to Medical Record
              </Button>
            </Box>
          </Fade>

          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <StyledHeader variant="h4" component="h1" gutterBottom>
                Prescriptions
              </StyledHeader>
              <Typography variant="body1" color="text.secondary">
                Viewing prescriptions for record ID: <b>{medicalRecordId || 'N/A'}</b>
              </Typography>
            </Box>
          </Fade>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress color="primary" />
              <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
                Loading Prescriptions...
              </Typography>
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!loading && prescriptions.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No prescriptions found for this medical record.
            </Alert>
          )}

          {!loading && prescriptions.length > 0 && (
            <Zoom in={true} timeout={600}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, md: 4 },
                  background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
                }}
              >
                <List disablePadding>
                  {prescriptions.map((presc, idx) => (
                    <React.Fragment key={presc.id || idx}>
                      <StyledListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTypeChip(presc.prescriptionType)}
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {presc.prescriptionType === 'Test' ? 'Test Name' : 'Medication'}: {presc.medicationName || 'Untitled'}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              {/* Only show for medicines */}
                              {presc.prescriptionType !== 'Test' && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    <b>Dosage:</b> {presc.dosage || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    <b>Frequency:</b> {presc.frequency || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    <b>Route:</b> {presc.route || 'N/A'}
                                  </Typography>
                                </>
                              )}
                              {/* Always shown */}
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                <b>Start Date:</b> {presc.startDate ? new Date(presc.startDate).toLocaleDateString() : 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                <b>End Date:</b> {presc.endDate ? new Date(presc.endDate).toLocaleDateString() : 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.primary" sx={{ mt: 1, display: 'block' }}>
                                <b>Notes:</b> {presc.notes || 'None'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Prescribed by Doctor ID: {presc.prescribedByDoctorId || 'N/A'}
                                {presc.prescriptionDate && <> on {new Date(presc.prescriptionDate).toLocaleDateString()}</>}
                              </Typography>
                            </>
                          }
                        />
                      </StyledListItem>
                      <Divider component="li" variant="inset" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Zoom>
          )}

          <Fade in timeout={1500}>
            <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                A detailed list of all medicine and test prescriptions for the patient.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

PrescriptionsPage.propTypes = {
  medicalRecordId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};

export default PrescriptionsPage;
