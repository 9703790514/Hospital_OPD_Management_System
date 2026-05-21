import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DoctorPrescriptions = ({ doctorUser }) => {
  // Static data for demonstration
  const prescriptionsData = [
    {
      id: 1,
      patientName: 'John Doe',
      prescriptionDate: '2025-07-28',
      medication: 'Ibuprofen 400mg',
      dosage: '1 tablet, 3 times daily',
      status: 'Active',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      prescriptionDate: '2025-07-27',
      medication: 'Muscle Relaxant',
      dosage: 'As needed',
      status: 'Active',
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      prescriptionDate: '2025-07-20',
      medication: 'Physical Therapy Referral',
      dosage: '2 sessions/week for 4 weeks',
      status: 'Completed',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'info';
      case 'Expired': return 'warning';
      default: return 'default';
    }
  };

  const handleCreatePrescription = () => {
    // Implement logic to open a form for creating a new prescription
  };

  const handleViewPrescription = (prescriptionId) => {
    // Implement logic to view prescription details
  };

  const handlePrintPrescription = (prescriptionId) => {
    // Implement logic to print prescription
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Prescriptions Management
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Patient Prescriptions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePrescription}
            sx={{ py: 1, px: 2, fontWeight: 'bold' }}
          >
            Create New Prescription
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="prescriptions table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Prescription Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Medication</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Dosage</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptionsData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell><PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.patientName}</TableCell>
                  <TableCell><CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.prescriptionDate}</TableCell>
                  <TableCell>{row.medication}</TableCell>
                  <TableCell>{row.dosage}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewPrescription(row.id)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PrintIcon />}
                      onClick={() => handlePrintPrescription(row.id)}
                    >
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Create, view, and manage prescriptions for your patients.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorPrescriptions.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorPrescriptions;
