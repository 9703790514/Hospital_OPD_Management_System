import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
const LabTechnicianTestResults = ({ labTechnician }) => {
  // Static data for demonstration
  const testResultsData = [
    {
      id: 1,
      testId: 'T-001',
      patientName: 'John Doe',
      testType: 'Blood Test (CBC)',
      result: 'Normal',
      status: 'Validated',
      validationDate: '2025-07-28',
    },
    {
      id: 2,
      testId: 'T-002',
      patientName: 'Jane Smith',
      testType: 'Urine Analysis',
      result: 'Abnormal (High Protein)',
      status: 'Pending Validation',
      validationDate: 'N/A',
    },
    {
      id: 3,
      testId: 'T-003',
      patientName: 'Robert Johnson',
      testType: 'Spinal Fluid Analysis',
      result: 'Normal',
      status: 'Published',
      validationDate: '2025-07-27',
    },
    {
      id: 4,
      testId: 'T-004',
      patientName: 'Alice Wonderland',
      testType: 'Tissue Biopsy',
      result: 'Pending Analysis',
      status: 'In Progress',
      validationDate: 'N/A',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validated': return 'success';
      case 'Pending Validation': return 'warning';
      case 'Published': return 'primary';
      case 'In Progress': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Validated': return <CheckCircleIcon fontSize="small" />;
      case 'Pending Validation': return <PendingActionsIcon fontSize="small" />;
      case 'Published': return <PublishIcon fontSize="small" />;
      case 'In Progress': return <HourglassEmptyIcon fontSize="small" />; // Assuming HourglassEmptyIcon is imported
      default: return null;
    }
  };

  const handleEditResult = (testId) => {
    // Implement logic to edit test result
  };

  const handlePublishResult = (testId) => {
    // Implement logic to publish test result
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Test Results Entry & Validation
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Recent Test Results
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="test results table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Test ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Test Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Result</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Validation Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testResultsData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell component="th" scope="row">
                    {row.testId}
                  </TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>{row.testType}</TableCell>
                  <TableCell>{row.result}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      icon={getStatusIcon(row.status)}
                    />
                  </TableCell>
                  <TableCell>{row.validationDate}</TableCell>
                  <TableCell>
                    {row.status === 'Pending Validation' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditResult(row.testId)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                    )}
                    {(row.status === 'Validated' || row.status === 'Pending Validation') && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PublishIcon />}
                        onClick={() => handlePublishResult(row.testId)}
                      >
                        Publish
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Enter and validate laboratory test results before publishing them to patient records.
        </Typography>
      </Box>
    </Box>
  );
};

LabTechnicianTestResults.propTypes = {
  labTechnician: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default LabTechnicianTestResults;
