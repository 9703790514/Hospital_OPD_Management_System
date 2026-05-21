import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DoctorMedicalRecords = ({ doctorUser }) => {
  // Static data for demonstration
  const medicalRecordsData = [
    {
      id: 1,
      patientName: 'John Doe',
      recordDate: '2025-07-25',
      chiefComplaint: 'Lower back pain',
      diagnosis: 'Lumbar strain',
      status: 'Completed',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      recordDate: '2025-07-28',
      chiefComplaint: 'Neck stiffness',
      diagnosis: 'Cervical spondylosis',
      status: 'Completed',
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      recordDate: '2025-07-20',
      chiefComplaint: 'Sciatica',
      diagnosis: 'Herniated disc (L5-S1)',
      status: 'Pending Review',
    },
    {
      id: 4,
      patientName: 'Alice Wonderland',
      recordDate: '2025-07-27',
      chiefComplaint: 'Post-surgery follow-up',
      diagnosis: 'Recovery assessment',
      status: 'Completed',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending Review': return 'warning';
      default: return 'default';
    }
  };

  const handleAddRecord = () => {
    // Implement logic to open a form for adding a new medical record
  };

  const handleViewRecord = (recordId) => {
    // Implement logic to view full medical record details
  };

  const handleEditRecord = (recordId) => {
    // Implement logic to edit medical record details
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Medical Records Management
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Patient Medical Records
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRecord}
            sx={{ py: 1, px: 2, fontWeight: 'bold' }}
          >
            Add New Record
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="medical records table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Record Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Chief Complaint</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Diagnosis</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalRecordsData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell><PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.patientName}</TableCell>
                  <TableCell><CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.recordDate}</TableCell>
                  <TableCell>{row.chiefComplaint}</TableCell>
                  <TableCell>{row.diagnosis}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewRecord(row.id)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditRecord(row.id)}
                    >
                      Edit
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
          Access and update comprehensive medical records for your patients.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorMedicalRecords.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorMedicalRecords;
