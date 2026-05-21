import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';

const LabTechnicianPrescriptions = ({ medicalRecordId, onBack }) => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!medicalRecordId) {
        setError('Medical Record ID is missing. Cannot fetch prescriptions.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:2006/api/prescriptions/medical/${medicalRecordId}`);

        if (response.status === 204 || response.headers.get('content-length') === '0') {
          setLabTests([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch prescriptions: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const text = await response.text();
        let data = [];
        try {
          data = text ? JSON.parse(text) : [];
        } catch {
          throw new Error('Invalid JSON response from server.');
        }

        // Filter only 'Test' prescriptions
        const tests = data.filter((p) => p.prescriptionType === 'Test');
        setLabTests(tests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [medicalRecordId]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 5 }} size={60} thickness={5} color="primary" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 3, fontWeight: 600 }}>
          Loading lab test orders...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 800, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
          Error: {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Failed to load lab test orders. Please try again later.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ fontWeight: 'bold', letterSpacing: 0.7, px: 4, py: 1.5 }}
        >
          Back to Medical Records
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          mb: 4,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          color: 'primary.main',
          borderColor: 'primary.main',
          textTransform: 'none',
          '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(63,81,181,0.1)' },
        }}
      >
        Back to Medical Records
      </Button>

      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 5, fontWeight: 'bold', color: 'primary.dark' }}>
        Lab Tests for Medical Record 
      </Typography>

      {labTests.length === 0 ? (
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(145deg, #f9fafb, #e6efff)',
            boxShadow: '0 12px 30px rgba(63,81,181,0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            No lab tests found for this medical record.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Lab test orders will appear here if issued.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={5} justifyContent="center">
          {labTests.map((prescription) => (
            <Grid item xs={12} sm={6} md={4} key={prescription.id}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  p: 3,
                  background: 'linear-gradient(145deg, #fafbff, #e2e7fc)',
                  boxShadow: '0 10px 35px rgba(63,81,181,0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 18px 50px rgba(63,81,181,0.25)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScienceIcon fontSize="small" />
                    {prescription.medicationName || 'N/A'}
                  </Typography>
                  <Chip
                    label="Test Odered"
                    color="primary"
                    size="small"
                    sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 0.5 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.8, gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" />
<strong>Prescription Date:</strong> {new Date().toLocaleDateString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon fontSize="small" />
                      <strong>Instructions:</strong> {prescription.notes || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 8, opacity: 0.8, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Detailed lab test orders for the selected medical record.
        </Typography>
      </Box>
    </Box>
  );
};

LabTechnicianPrescriptions.propTypes = {
  medicalRecordId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default LabTechnicianPrescriptions;
