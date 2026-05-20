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
  Link, // Import Link for external URLs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BiotechIcon from '@mui/icons-material/Biotech';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person'; // For Patient ID (if available)
import ScienceIcon from '@mui/icons-material/Science'; // Icon for test type
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icon for results
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for notes
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'; // Icon for report download

const DoctorDiagnosticTestsPage = ({ medicalRecordId, onBack }) => {
  const [diagnosticTests, setDiagnosticTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosticTests = async () => {
      if (!medicalRecordId) {
        setError("Medical Record ID is not available for fetching diagnostic tests.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);


      try {
        const response = await fetch(`http://localhost:2006/api/diagnostic-tests/medical/${medicalRecordId}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch diagnostic tests: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setDiagnosticTests(data);
      } catch (err) {
        setError(err.message || "Failed to load diagnostic tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosticTests();
  }, [medicalRecordId]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to Medical Record Details
      </Button>

      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Diagnostic Tests 
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Diagnostic Tests...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && diagnosticTests.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No diagnostic tests found for this medical record.
        </Alert>
      )}

      {!loading && !error && diagnosticTests.length > 0 && (
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Diagnostic Test List
          </Typography>
          <List>
            {diagnosticTests.map((test, index) => (
              <React.Fragment key={test.id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BiotechIcon sx={{ mr: 1, color: 'info.main' }} />
                        Test Name: {test.testName || 'N/A'} (ID: {test.id || 'N/A'})
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {/* Patient ID is not directly on the test object in your sample,
                            but medicalRecordId implies patient context.
                            If patientId is available from the medical record, it would be displayed there.
                            If you have patient details linked to diagnostic tests, you can add them here.
                        */}
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <ScienceIcon fontSize="small" sx={{ mr: 1 }} />
                          Test Type: {test.testType || 'N/A'}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          Ordered By Doctor ID: {test.orderedByDoctorId || 'N/A'}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                          Results: {test.results || 'N/A'}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                          Result Notes: {test.resultNotes || 'No notes provided'}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Order Date: {test.orderDate ? new Date(test.orderDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {test.reportDocumentUrl && (
                          <Box sx={{ mt: 1 }}>
                            <Link
                              href={test.reportDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'primary.main',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              <CloudDownloadIcon fontSize="small" sx={{ mr: 0.5 }} />
                              View Report
                            </Link>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < diagnosticTests.length - 1 && <Divider component="li" sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          View detailed diagnostic test results.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorDiagnosticTestsPage.propTypes = {
  medicalRecordId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};

export default DoctorDiagnosticTestsPage;
