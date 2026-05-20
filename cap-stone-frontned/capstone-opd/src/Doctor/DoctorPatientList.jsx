import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const DoctorPatientList = ({ doctorUser }) => {
  // Static data for demonstration
  const patientsData = [
    {
      id: 1,
      patientId: 'P-001',
      name: 'John Doe',
      contact: '+919876543210',
      email: 'john.doe@example.com',
      lastVisit: '2025-07-25',
      status: 'Active',
    },
    {
      id: 2,
      patientId: 'P-002',
      name: 'Jane Smith',
      contact: '+919123456789',
      email: 'jane.smith@example.com',
      lastVisit: '2025-07-28',
      status: 'Active',
    },
    {
      id: 3,
      patientId: 'P-003',
      name: 'Robert Johnson',
      contact: '+918765432109',
      email: 'robert.j@example.com',
      lastVisit: '2025-07-20',
      status: 'Inactive',
    },
    {
      id: 4,
      patientId: 'P-004',
      name: 'Alice Wonderland',
      contact: '+917654321098',
      email: 'alice.w@example.com',
      lastVisit: 'N/A',
      status: 'New',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'New': return 'info';
      default: return 'default';
    }
  };

  const handleViewDetails = (patientId) => {
    // Implement logic to navigate to or open a modal for patient details
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Patient List
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          My Patients
        </Typography>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="patient list table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Last Visit</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientsData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell component="th" scope="row">
                    {row.patientId}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell><PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.contact}</TableCell>
                  <TableCell><EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.email}</TableCell>
                  <TableCell>{row.lastVisit}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(row.patientId)}
                    >
                      View Details
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
          View and manage your patient roster, search for specific patients, and access their profiles.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorPatientList.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorPatientList;
