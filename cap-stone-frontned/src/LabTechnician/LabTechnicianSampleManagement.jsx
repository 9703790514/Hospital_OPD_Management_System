import React, { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Paper, Grid, Card,
  CardContent, Chip, Button, IconButton, TextField, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, useTheme,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel
} from '@mui/material';
import { styled } from '@mui/system';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import RoomIcon from '@mui/icons-material/Room';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PersonIcon from '@mui/icons-material/Person';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import EventNoteIcon from '@mui/icons-material/EventNote';

// --- Styled Components for a consistent UI ---

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1400,
  margin: 'auto',
  width: '100%',
  minHeight: '80vh',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  fontSize: '2.5rem',
  letterSpacing: '0.05em',
  '&:after': {
    content: '""',
    display: 'block',
    width: '80px',
    height: '5px',
    background: theme.palette.secondary.main,
    margin: '12px auto 0',
    borderRadius: '2.5px',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(145deg, #f9fbfd, #eaf2f8)'
    : 'linear-gradient(145deg, #2c3e50, #1a2a3a)',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.12)',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.secondary,
}));

const InfoText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '1rem',
  marginLeft: theme.spacing(1),
}));

const NoResultsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 3,
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(145deg, #e3f2fd, #bbdefb)'
    : 'linear-gradient(145deg, #2c3e50, #34495e)',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  textAlign: 'center',
  marginTop: theme.spacing(6),
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%',
  py: 1.5,
  fontWeight: 700,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '1rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  transition: 'background-color 0.3s ease',
}));

// --- Status Helpers ---
const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return <CheckCircleIcon />;
    case 'Pending':
      return <HourglassEmptyIcon />;
    case 'Cancelled':
      return <CancelIcon />;
    default:
      return <AssignmentIcon />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Pending': return 'warning';
    case 'Cancelled': return 'error';
    default: return 'default';
  }
};

// --- Main Component ---
const LabTechnicianDashboard = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [patients, setPatients] = useState({});

  // State to manage the view
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments: ' + response.status + ' ' + response.statusText);
      }
      const appointmentsData = await response.json();

      // Create a set of unique patient IDs from appointments
      const patientIds = [...new Set(appointmentsData.map(app => app.patientId))];

      // Fetch patient details for each patient ID
      const patientDetailsPromises = patientIds.map(async (patientId) => {
        try {
          const patientResponse = await fetch(`http://localhost:2008/api/patients/${patientId}`);
          if (!patientResponse.ok) {
            return { [patientId]: { first_name: 'Unknown', last_name: 'Patient' } };
          }
          const patientData = await patientResponse.json();
          return { [patientId]: patientData };
        } catch (err) {
          return { [patientId]: { first_name: 'Unknown', last_name: 'Patient' } };
        }
      });

      const patientDetailsArray = await Promise.all(patientDetailsPromises);
      const patientsMap = Object.assign({}, ...patientDetailsArray);

      setAppointments(appointmentsData);
      setPatients(patientsMap);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch diagnostic tests for a medical record
  const fetchTests = async (medicalRecordId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:2006/api/diagnostic-tests/medical/${medicalRecordId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch test results: ${response.statusText}`);
      }
      const data = await response.json();
      setTestResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch initial appointments data on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Effect to fetch diagnostic tests when a medical record ID is selected
  useEffect(() => {
    if (selectedMedicalRecordId) {
      fetchTests(selectedMedicalRecordId);
    } else {
      setTestResults([]);
      setLoading(false);
    }
  }, [selectedMedicalRecordId]);

  // Handlers
  const handleViewTests = (medicalRecordId) => {
    setSelectedMedicalRecordId(medicalRecordId);
  };

  const handleBack = () => {
    setSelectedMedicalRecordId(null);
    setTestResults([]);
    setError(null);
  };

  const handleDownload = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSort = (property) => {
    const isAsc = sortOption === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortOption(property);
  };

  // --- NEW HANDLER TO UPDATE TEST STATUS ---
  const handleUpdateTestStatus = async (testId, newStatus) => {
    setLoading(true);
    try {
      const testToUpdate = testResults.find(test => test.id === testId);
      if (!testToUpdate) {
        throw new Error('Test not found for update.');
      }
  
      const formData = new FormData();
      formData.append('testName', testToUpdate.testName);
      formData.append('testType', testToUpdate.testType || '');
      formData.append('orderedByDoctorId', testToUpdate.orderedByDoctorId);
      formData.append('results', testToUpdate.results || '');
      formData.append('resultNotes', testToUpdate.resultNotes || '');
      formData.append('performedByUserId', testToUpdate.performedByUserId || '');
      formData.append('medicalRecordId', testToUpdate.medicalRecordId);
      formData.append('status', newStatus);
  
      const response = await fetch(`http://localhost:2006/api/diagnostic-tests/${testId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update test status: ${response.statusText}`);
      }
  
      // Refresh the test results to reflect the new status
      fetchTests(selectedMedicalRecordId);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const patient = patients[appointment.patientId] || {};
    const patientName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const appointmentId = (appointment.customId || appointment.id || '').toString().toLowerCase();

    return (
      patientName.includes(lowerCaseSearchTerm) ||
      appointmentId.includes(lowerCaseSearchTerm)
    );
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let comparison = 0;
    
    if (sortOption === 'date' && a.appointmentDate && b.appointmentDate) {
      comparison = new Date(a.appointmentDate) - new Date(b.appointmentDate);
    } else if (sortOption === 'patientName') {
      const aName = `${patients[a.patientId]?.first_name || ''} ${patients[a.patientId]?.last_name || ''}`;
      const bName = `${patients[b.patientId]?.first_name || ''} ${patients[b.patientId]?.last_name || ''}`;
      comparison = aName.localeCompare(bName);
    } else {
      const aValue = a[sortOption] || '';
      const bValue = b[sortOption] || '';
      comparison = aValue.toString().localeCompare(bValue.toString());
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // --- Render Logic (Conditional Display) ---

  if (loading) {
    return (
      <PageContainer sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mt: 10, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 3, fontWeight: 'medium' }}>
          {selectedMedicalRecordId ? 'Fetching diagnostic tests...' : 'Fetching appointments...'}
        </Typography>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mt: 10, fontWeight: 'bold' }}>
          Error: {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 3, backgroundColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.error.dark } }}
        >
          Back to Appointments
        </Button>
      </PageContainer>
    );
  }

  // Display diagnostic tests if a medical record ID is selected
  if (selectedMedicalRecordId) {
    return (
      <PageContainer>
        <Box mb={4}>
          <IconButton onClick={handleBack} color="primary">
            <ArrowBackIcon />
            <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>Back to Appointments</Typography>
          </IconButton>
        </Box>

        <SectionTitle variant="h4">
          Diagnostic Tests for Medical Record: {selectedMedicalRecordId}
        </SectionTitle>

        {testResults.length === 0 ? (
          <NoResultsPaper elevation={6}>
            <Typography variant="h6" color="text.secondary">
              <ScienceIcon sx={{ fontSize: 50, mb: 2, color: theme.palette.action.disabled }} />
              <br />
              No diagnostic tests found for this medical record.
            </Typography>
          </NoResultsPaper>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {testResults.map((test) => (
              <Grid item xs={12} sm={6} md={4} key={test.id}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                      <ScienceIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Test: {test.testName}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(test.status)}
                      label={test.status}
                      color={getStatusColor(test.status)}
                      size="medium"
                      sx={{ mb: 2, fontWeight: 700, px: 1, textTransform: 'uppercase' }}
                    />
                    <Box mt={2}>
                      <InfoBox>
                        <MedicalInformationIcon fontSize="small" color="primary" />
                        <InfoText>
                          Doctor ID: {test.orderedByDoctorId || 'N/A'}
                        </InfoText>
                      </InfoBox>
                      <InfoBox>
                        <PersonIcon fontSize="small" color="primary" />
                        <InfoText>
                          Performed by: {test.performedByUserId || 'N/A'}
                        </InfoText>
                      </InfoBox>
                      <InfoBox>
                        <AccessTimeIcon fontSize="small" color="primary" />
                        <InfoText>
                          Ordered: {test.orderDate ? new Date(test.orderDate).toLocaleString() : 'N/A'}
                        </InfoText>
                      </InfoBox>
                      <InfoBox>
                        <DescriptionIcon fontSize="small" color="primary" />
                        <InfoText>
                          Results: {test.results || 'N/A'}
                        </InfoText>
                      </InfoBox>
                    </Box>
                    
                    {/* --- ADDED STATUS UPDATE BUTTON --- */}
                    {test.status === 'Pending' && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleUpdateTestStatus(test.id, 'Completed')}
                        sx={{ mt: 3, width: '100%' }}
                        disabled={loading}
                      >
                        Mark as Completed
                      </Button>
                    )}

                    {/* --- VIEW REPORT BUTTON --- */}
                    {test.reportDocumentUrl && (
                      <StyledButton
                        variant="contained"
                        color="secondary"
                        startIcon={<DocumentScannerIcon />}
                        onClick={() => handleDownload(test.reportDocumentUrl)}
                        sx={{ mt: 2 }}
                      >
                        View Report
                      </StyledButton>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </PageContainer>
    );
  }

  // Otherwise, display the list of appointments in a table
  return (
    <PageContainer>
      <SectionTitle variant="h4">
        Lab Technician Appointments Overview
      </SectionTitle>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          label="Search appointments"
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}
        />
        <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label="Sort By"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon color="action" />
              </InputAdornment>
            }
          >
            <MenuItem value="date">Date & Time</MenuItem>
            <MenuItem value="patientName">Patient Name</MenuItem>
            <MenuItem value="doctorId">Doctor ID</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {sortedAppointments.length === 0 && searchTerm !== '' ? (
        <NoResultsPaper elevation={6}>
          <Typography variant="h6" color="text.secondary">
            <SearchIcon sx={{ fontSize: 50, mb: 2, color: theme.palette.action.disabled }} />
            <br />
            No appointments found matching your search criteria.
          </Typography>
        </NoResultsPaper>
      ) : sortedAppointments.length === 0 ? (
        <NoResultsPaper elevation={6}>
          <Typography variant="h6" color="text.secondary">
            <EventNoteIcon sx={{ fontSize: 50, mb: 2, color: theme.palette.action.disabled }} />
            <br />
            No appointments available at the moment.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for new appointments.
          </Typography>
        </NoResultsPaper>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table aria-label="appointments table">
            <StyledTableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortOption === 'id'}
                    direction={sortOption === 'id' ? sortOrder : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    Appointment ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortOption === 'patientName'}
                    direction={sortOption === 'patientName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('patientName')}
                  >
                    Patient Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortOption === 'appointmentDate'}
                    direction={sortOption === 'appointmentDate' ? sortOrder : 'asc'}
                    onClick={() => handleSort('appointmentDate')}
                  >
                    Date & Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortOption === 'status'}
                    direction={sortOption === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sortedAppointments.map((appointment) => {
                const patient = patients[appointment.patientId] || { first_name: 'Unknown', last_name: 'Patient' };
                const patientName = `${patient.first_name} ${patient.last_name}`;

                return (
                  <StyledTableRow key={appointment.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {appointment.customId || appointment.id.substring(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <InfoBox>
                        <PersonIcon fontSize="small" color="primary" />
                        <InfoText>{patientName}</InfoText>
                      </InfoBox>
                    </TableCell>
                    <TableCell>
                      {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}{' '}
                      {appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewTests(appointment.medicalRecordId)}
                        disabled={!appointment.medicalRecordId}
                      >
                        {appointment.medicalRecordId ? "View Tests" : "No Tests"}
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </PageContainer>
  );
};

export default LabTechnicianDashboard;
