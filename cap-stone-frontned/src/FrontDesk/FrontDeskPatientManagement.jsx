// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button,
//   CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, Select, InputLabel, FormControl
// } from '@mui/material';
// import PeopleIcon from '@mui/icons-material/People';
// import AddIcon from '@mui/icons-material/Add';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import PhoneIcon from '@mui/icons-material/Phone';
// import EmailIcon from '@mui/icons-material/Email';
// import SaveIcon from '@mui/icons-material/Save'; // Added for save button in form
// import EventNoteIcon from '@mui/icons-material/EventNote'; // Icon for Book Appointment

// const FrontDeskPatientManagement = ({ frontDeskUser, onNavigate }) => { // Added onNavigate prop
//   // State to hold dynamic patient data
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openNewPatientDialog, setOpenNewPatientDialog] = useState(false);
//   const [newPatientData, setNewPatientData] = useState({
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     contactNumber: '',
//     address: '',
//     email: '',
//     bloodGroup: '',
//     allergies: '',
//     currentMedications: '',
//   });

//   // New state for viewing patient details
//   const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
//   const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients');
//         if (!response.ok) {
//           throw new Error(`Failed to fetch patient data: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();

//         // Log the fetched raw patient data to the console
//         console.log("Fetched raw patient data for Front Desk:", data);

//         // Map fetched data to the required structure for the table
//         const mappedData = data.map((patient, index) => ({
//           id: patient._id, // MongoDB _id
//           patientId: patient.id ? `P-${String(patient.id).padStart(3, '0')}` : `P-${patient._id.substring(0, 5)}`, // Use custom ID or part of MongoDB ID
//           name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'N/A',
//           contact: patient.contact_number || 'N/A',
//           email: patient.email || 'N/A',
//           // Simulate lastVisit and status as they are not in the provided patient data
//           lastVisit: `2025-07-${28 - (index % 5)}`, // Example simulation
//           status: (index % 3 === 0) ? 'Active' : (index % 3 === 1 ? 'Inactive' : 'New'), // Example simulation
//           fullDetails: patient, // Store full patient object for view details
//         }));
//         setPatients(mappedData);
//       } catch (err) {
//         console.error("Error fetching patients:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Active': return 'success';
//       case 'Inactive': return 'warning';
//       case 'New': return 'info';
//       default: return 'default';
//     }
//   };

//   const handleRegisterPatient = () => {
//     setOpenNewPatientDialog(true);
//   };

//   const handleCloseNewPatientDialog = () => {
//     setOpenNewPatientDialog(false);
//     setNewPatientData({
//       firstName: '', lastName: '', dateOfBirth: '', gender: '', contactNumber: '',
//       address: '', email: '', bloodGroup: '', allergies: '', currentMedications: '',
//     }); // Reset form
//   };

//   const handleNewPatientChange = (e) => {
//     const { name, value } = e.target;
//     setNewPatientData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveNewPatient = async () => {
//     // Basic validation
//     if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.email || !newPatientData.contactNumber) {
//       alert('Please fill in required fields: First Name, Last Name, Email, Contact Number.');
//       return;
//     }

//     try {
//       // For a real application, you'd send this to your patient registration API
//       console.log('Attempting to register new patient:', newPatientData);
//       // Example API call (replace with your actual patient registration endpoint)
//       const response = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           first_name: newPatientData.firstName,
//           last_name: newPatientData.lastName,
//           date_of_birth: newPatientData.dateOfBirth,
//           gender: newPatientData.gender,
//           contact_number: newPatientData.contactNumber,
//           address: newPatientData.address,
//           email: newPatientData.email,
//           blood_group: newPatientData.bloodGroup,
//           allergies: newPatientData.allergies,
//           current_medications: newPatientData.currentMedications,
//           // Add other fields as per your backend API requirements
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to register patient: ${errorText}`);
//       }

//       const registeredPatient = await response.json();
//       console.log('Patient registered successfully:', registeredPatient);

//       // Re-fetch patients to update the table with the new entry
//       // Or manually add the new patient to the state if you have the full object
//       setLoading(true); // Show loading while refetching
//       const updatedResponse = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients');
//       const updatedData = await updatedResponse.json();
//       const newMappedData = updatedData.map((patient, index) => ({
//         id: patient._id,
//         patientId: patient.id ? `P-${String(patient.id).padStart(3, '0')}` : `P-${patient._id.substring(0, 5)}`,
//         name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'N/A',
//         contact: patient.contact_number || 'N/A',
//         email: patient.email || 'N/A',
//         lastVisit: `2025-07-${28 - (index % 5)}`,
//         status: (index % 3 === 0) ? 'Active' : (index % 3 === 1 ? 'Inactive' : 'New'),
//         fullDetails: patient,
//       }));
//       setPatients(newMappedData);
//       setLoading(false);

//       handleCloseNewPatientDialog(); // Close dialog after saving
//     } catch (err) {
//       console.error('Error saving new patient:', err);
//       setError(err.message);
//       alert(`Error registering patient: ${err.message}`); // Show error to user
//     }
//   };

//   const handleViewDetails = (patientId) => {
//     // Find the full details of the patient from the `patients` state
//     const patientDetail = patients.find(p => p.patientId === patientId);
//     if (patientDetail && patientDetail.fullDetails) {
//       console.log(`Full details for Patient ID ${patientId}:`, patientDetail.fullDetails);
//       setSelectedPatientDetails(patientDetail.fullDetails); // Set details for display
//       setOpenViewDetailsDialog(true); // Open the dialog
//     } else {
//       console.warn(`Details not found for Patient ID: ${patientId}`);
//       alert(`Details not found for Patient ID: ${patientId}`); // Inform user
//     }
//   };

//   const handleCloseViewDetailsDialog = () => {
//     setOpenViewDetailsDialog(false);
//     setSelectedPatientDetails(null); // Clear selected details
//   };

//   // New function to handle booking an appointment for a specific patient
//   const handleBookAppointmentForPatient = (patientId) => {
//     console.log(`Navigating to book appointment for Patient ID: ${patientId}`);
//     if (onNavigate) {
//       // Navigate to the book appointment page, passing the patientId
//       onNavigate(`book-appointment-for-patient/${patientId}`);
//     } else {
//       console.error("onNavigate prop is not provided to FrontDeskPatientManagement.");
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
//         <CircularProgress sx={{ mt: 5 }} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
//           Loading patient data...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
//         <Typography variant="h6" color="error" sx={{ mt: 5 }}>
//           Error: {error}
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//           Failed to load patient data. Please try again later.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Patient Management
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             Registered Patients
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleRegisterPatient}
//             sx={{ py: 1, px: 2, fontWeight: 'bold' }}
//           >
//             Register New Patient
//           </Button>
//         </Box>

//         <TableContainer>
//           <Table sx={{ minWidth: 650 }} aria-label="patient management table">
//             <TableHead>
//               <TableRow sx={{ bgcolor: '#e3f2fd' }}>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient ID</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Name</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Contact</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Email</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Last Visit</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {patients.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {row.patientId}
//                   </TableCell>
//                   <TableCell>{row.name}</TableCell>
//                   <TableCell><PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.contact}</TableCell>
//                   <TableCell><EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.email}</TableCell>
//                   <TableCell>{row.lastVisit}</TableCell>
//                   <TableCell>
//                     <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       display: 'flex',
//                       gap: 1,
//                       py: 1.5,
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<VisibilityIcon />}
//                       onClick={() => handleViewDetails(row.patientId)}
//                     >
//                       View Details
//                     </Button>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="primary"
//                       startIcon={<EventNoteIcon />}
//                       onClick={() => handleBookAppointmentForPatient(row.id)}
//                     >
//                       Book Appointment
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Manage patient registrations, update profiles, and view patient history.
//         </Typography>
//       </Box>

//       {/* New Patient Registration Dialog */}
//       <Dialog open={openNewPatientDialog} onClose={handleCloseNewPatientDialog} fullWidth maxWidth="md">
//         <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', pb: 1.5 }}>
//           <Typography variant="h6" fontWeight="bold">
//             Register New Patient
//           </Typography>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 autoFocus
//                 margin="dense"
//                 name="firstName"
//                 label="First Name"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.firstName}
//                 onChange={handleNewPatientChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="lastName"
//                 label="Last Name"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.lastName}
//                 onChange={handleNewPatientChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="dateOfBirth"
//                 label="Date of Birth"
//                 type="date"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.dateOfBirth}
//                 onChange={handleNewPatientChange}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth margin="dense" variant="outlined">
//                 <InputLabel>Gender</InputLabel>
//                 <Select
//                   name="gender"
//                   value={newPatientData.gender}
//                   onChange={handleNewPatientChange}
//                   label="Gender"
//                 >
//                   <MenuItem value=""><em>Select Gender</em></MenuItem>
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                   <MenuItem value="Other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="contactNumber"
//                 label="Contact Number"
//                 type="tel"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.contactNumber}
//                 onChange={handleNewPatientChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="email"
//                 label="Email Address"
//                 type="email"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.email}
//                 onChange={handleNewPatientChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 margin="dense"
//                 name="address"
//                 label="Address"
//                 type="text"
//                 fullWidth
//                 multiline
//                 rows={2}
//                 variant="outlined"
//                 value={newPatientData.address}
//                 onChange={handleNewPatientChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="bloodGroup"
//                 label="Blood Group"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.bloodGroup}
//                 onChange={handleNewPatientChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 margin="dense"
//                 name="allergies"
//                 label="Allergies"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 value={newPatientData.allergies}
//                 onChange={handleNewPatientChange}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 margin="dense"
//                 name="currentMedications"
//                 label="Current Medications"
//                 type="text"
//                 fullWidth
//                 multiline
//                 rows={2}
//                 variant="outlined"
//                 value={newPatientData.currentMedications}
//                 onChange={handleNewPatientChange}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={handleCloseNewPatientDialog} variant="outlined" color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveNewPatient} variant="contained" color="primary" startIcon={<SaveIcon />}>
//             Register Patient
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* View Patient Details Dialog */}
//       <Dialog open={openViewDetailsDialog} onClose={handleCloseViewDetailsDialog} fullWidth maxWidth="md">
//         <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', pb: 1.5 }}>
//           <Typography variant="h6" fontWeight="bold">
//             Patient Details
//           </Typography>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: 3 }}>
//           {selectedPatientDetails && (
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">First Name:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.first_name || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Last Name:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.last_name || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Date of Birth:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.date_of_birth || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Gender:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.gender || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Contact Number:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.contact_number || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Email:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.email || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Address:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.address || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Blood Group:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.blood_group || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Allergies:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.allergies || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" fontWeight="bold">Current Medications:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.current_medications || 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Created At:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.created_at ? new Date(selectedPatientDetails.created_at).toLocaleDateString() : 'N/A'}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" fontWeight="bold">Updated At:</Typography>
//                 <Typography variant="body1">{selectedPatientDetails.updated_at ? new Date(selectedPatientDetails.updated_at).toLocaleDateString() : 'N/A'}</Typography>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={handleCloseViewDetailsDialog} variant="contained" color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// FrontDeskPatientManagement.propTypes = {
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
//   onNavigate: PropTypes.func.isRequired, // Added onNavigate propType
// };

// export default FrontDeskPatientManagement;
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, InputAdornment, Snackbar, Alert,
  useTheme
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';

const FrontDeskPatientManagement = ({ frontDeskUser }) => {
  const theme = useTheme();

  // State to hold all patient data, fetched once
  const [allPatients, setAllPatients] = useState([]);
  // State for the currently displayed patients (filtered)
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);

  // State for a message box to replace 'alert()'
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  // Handle opening the message box
  const handleOpenSnackbar = (message, severity = 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle closing the message box
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients');
        if (!response.ok) {
          throw new Error('Failed to fetch patient data: ' + response.status + ' ' + response.statusText);
        }
        const data = await response.json();

        // Map fetched data to the required structure for the table
        const mappedData = data.map((patient, index) => ({
          id: patient._id, // MongoDB _id
          patientId: patient.id ? `P-${String(patient.id).padStart(3, '0')}` : `P-${patient._id.substring(0, 5)}`,
          name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'N/A',
          contact: patient.contact_number || 'N/A',
          lastVisit: `2025-07-${28 - (index % 5)}`, // Example simulation
          status: (index % 3 === 0) ? 'Active' : (index % 3 === 1 ? 'Inactive' : 'New'), // Example simulation
          fullDetails: patient, // Store full patient object for view details
        }));

        setAllPatients(mappedData);
        setFilteredPatients(mappedData); // Initially, show all patients
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Effect to handle filtering when the searchTerm changes
  useEffect(() => {
    const results = allPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, allPatients]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'New': return 'info';
      default: return 'default';
    }
  };

  const handleViewDetails = (patientId) => {
    const patientDetail = filteredPatients.find(p => p.patientId === patientId);
    if (patientDetail && patientDetail.fullDetails) {
      setSelectedPatientDetails(patientDetail.fullDetails);
      setOpenViewDetailsDialog(true);
    } else {
      handleOpenSnackbar(`Details not found for Patient ID: ${patientId}`, 'warning');
    }
  };

  const handleCloseViewDetailsDialog = () => {
    setOpenViewDetailsDialog(false);
    setSelectedPatientDetails(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading patient data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mt: 5 }}>
          Error: {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Failed to load patient data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        <PeopleIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'bottom' }} /> Patient Management
      </Typography>

      <Paper elevation={8} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Registered Patients
          </Typography>
          <TextField
            label="Search Patients"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 650 }} aria-label="patient management table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText', borderTopLeftRadius: 8 }}>Patient ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Last Visit</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText', borderTopRightRadius: 8 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                      '&:hover': { backgroundColor: theme.palette.action.selected, cursor: 'pointer' },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.patientId}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell><PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.contact}</TableCell>
                    <TableCell>{row.lastVisit}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(row.patientId)}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No patients found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Patient Details Dialog */}
      <Dialog open={openViewDetailsDialog} onClose={handleCloseViewDetailsDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', pb: 1.5 }}>
          <Typography variant="h6" fontWeight="bold">
            Patient Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedPatientDetails && (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Full Name</TableCell>
                    <TableCell>{`${selectedPatientDetails.first_name || 'N/A'} ${selectedPatientDetails.last_name || 'N/A'}`}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
                    <TableCell>{selectedPatientDetails._id ? selectedPatientDetails._id.substring(0, 8) : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                    <TableCell>{selectedPatientDetails.date_of_birth || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                    <TableCell>{selectedPatientDetails.gender || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Contact Number</TableCell>
                    <TableCell>{selectedPatientDetails.contact_number || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell>{selectedPatientDetails.email || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
                    <TableCell>{selectedPatientDetails.blood_group || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell>{selectedPatientDetails.address || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Allergies</TableCell>
                    <TableCell>{selectedPatientDetails.allergies || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Current Medications</TableCell>
                    <TableCell>{selectedPatientDetails.current_medications || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                    <TableCell>{selectedPatientDetails.created_at ? new Date(selectedPatientDetails.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                    <TableCell>{selectedPatientDetails.updated_at ? new Date(selectedPatientDetails.updated_at).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseViewDetailsDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Snackbar component to replace the 'alert' function for better UX */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

FrontDeskPatientManagement.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default FrontDeskPatientManagement;
