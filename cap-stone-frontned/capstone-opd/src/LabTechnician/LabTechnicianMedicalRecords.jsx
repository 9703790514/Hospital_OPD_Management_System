// // import React, { useState, useEffect } from 'react';
// // import PropTypes from 'prop-types';
// // import {
// //   Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button
// // } from '@mui/material';
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// // import EventNoteIcon from '@mui/icons-material/EventNote'; // For record date
// // import DescriptionIcon from '@mui/icons-material/Description'; // For chief complaint, diagnosis, treatment plan, notes
// // import PersonIcon from '@mui/icons-material/Person'; // For patient ID (already in prop, but good for consistency)
// // import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // For doctor ID
// // import HealingIcon from '@mui/icons-material/Healing'; // For diagnosis
// // import BiotechIcon from '@mui/icons-material/Biotech'; // For treatment plan

// // // Import the new prescriptions component
// // import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
// // // Import the new test reports component
// // import LabTechnicianTestReports from './LabTechnicianTestReports';

// // const LabTechnicianMedicalRecords = ({ patientId, onBack, labTechnician }) => {
// //   const [medicalRecords, setMedicalRecords] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // State to manage showing the prescriptions page
// //   const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
// //   const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

// //   // State to manage showing the test reports page
// //   const [showTestReportsPage, setShowTestReportsPage] = useState(false);
// //   const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

// //   useEffect(() => {
// //     const fetchMedicalRecords = async () => {
// //       if (!patientId) {
// //         setError("Patient ID is missing. Cannot fetch medical records.");
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         setError(null);

// //         // Fetch medical records for the specific patient
// //         const response = await fetch(`http://localhost:2006/api/medical-records/patient/${patientId}`);

// //         // Check for 204 No Content or empty response before attempting to parse JSON
// //         if (response.status === 204 || response.headers.get('content-length') === '0') {
// //           console.log(`No medical records found for patient ${patientId} (204 No Content).`);
// //           setMedicalRecords([]);
// //           setLoading(false);
// //           return;
// //         }

// //         if (!response.ok) {
// //           const errorBody = await response.text(); // Read error response as text
// //           throw new Error(`Failed to fetch medical records: ${response.status} ${response.statusText} - ${errorBody}`);
// //         }

// //         const text = await response.text();
// //         let data = [];
// //         try {
// //           data = text ? JSON.parse(text) : []; // Parse only if text is not empty
// //         } catch (jsonError) {
// //           console.error("Error parsing JSON response for medical records:", jsonError);
// //           throw new Error("Invalid JSON response from server.");
// //         }

// //         console.log(`Fetched medical records for patient ${patientId}:`, data);
// //         setMedicalRecords(data);
// //       } catch (err) {
// //         console.error("Error fetching medical records:", err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchMedicalRecords();
// //   }, [patientId]); // Re-run effect if patientId changes

// //   // Handlers for the new buttons
// //   const handleViewPrescriptions = (recordId) => {
// //     setSelectedMedicalRecordIdForPrescriptions(recordId);
// //     setShowPrescriptionsPage(true);
// //   };

// //   const handleViewTestReports = (recordId) => {
// //     setSelectedMedicalRecordIdForTestReports(recordId);
// //     setShowTestReportsPage(true);
// //   };

// //   const handleBackToMedicalRecordsFromPrescriptions = () => {
// //     setShowPrescriptionsPage(false);
// //     setSelectedMedicalRecordIdForPrescriptions(null);
// //   };

// //   const handleBackToMedicalRecordsFromTestReports = () => {
// //     setShowTestReportsPage(false);
// //     setSelectedMedicalRecordIdForTestReports(null);
// //   };

// //   if (loading) {
// //     return (
// //       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
// //         <CircularProgress sx={{ mt: 5 }} />
// //         <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
// //           Loading medical records...
// //         </Typography>
// //       </Box>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
// //         <Typography variant="h6" color="error" sx={{ mt: 5 }}>
// //           Error: {error}
// //         </Typography>
// //         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
// //           Failed to load medical records. Please try again later.
// //         </Typography>
// //         <Button
// //           variant="contained"
// //           startIcon={<ArrowBackIcon />}
// //           onClick={onBack}
// //           sx={{ mt: 3 }}
// //         >
// //           Back to Appointments
// //         </Button>
// //       </Box>
// //     );
// //   }

// //   // Conditionally render the Prescriptions page
// //   if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
// //     return (
// //       <LabTechnicianPrescriptions
// //         medicalRecordId={selectedMedicalRecordIdForPrescriptions}
// //         onBack={handleBackToMedicalRecordsFromPrescriptions}
// //       />
// //     );
// //   }

// //   // Conditionally render the Test Reports page
// //   if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
// //     return (
// //       <LabTechnicianTestReports
// //         medicalRecordId={selectedMedicalRecordIdForTestReports}
// //         onBack={handleBackToMedicalRecordsFromTestReports}
// //       />
// //     );
// //   }

// //   return (
// //     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
// //       <Button
// //         variant="outlined"
// //         startIcon={<ArrowBackIcon />}
// //         onClick={onBack}
// //         sx={{ mb: 4, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
// //       >
// //         Back to Appointments
// //       </Button>

// //       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
// //         Medical Records for Patient ID: {patientId}
// //       </Typography>

// //       {medicalRecords.length === 0 ? (
// //         <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
// //           <Typography variant="h6" color="text.secondary">
// //             No medical records found for this patient.
// //           </Typography>
// //           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
// //             Medical records will appear here after consultations.
// //           </Typography>
// //         </Paper>
// //       ) : (
// //         <Grid container spacing={4} justifyContent="center">
// //           {medicalRecords.map((record) => (
// //             <Grid item xs={12} sm={6} md={4} key={record.id}>
// //               <Card elevation={6} sx={{
// //                 borderRadius: 3,
// //                 p: 2,
// //                 background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
// //                 boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
// //                 height: '100%', // Ensure cards have equal height
// //                 display: 'flex',
// //                 flexDirection: 'column',
// //                 justifyContent: 'space-between',
// //               }}>
// //                 <CardContent>
// //                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
// //                     <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
// //                     Record Date: {new Date(record.recordDate).toLocaleDateString()}
// //                   </Typography>
// //                   <Box sx={{ mb: 1.5 }}>
// //                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
// //                       <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
// //                       <strong>Chief Complaint:</strong> {record.chiefComplaint || 'N/A'}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
// //                       <HealingIcon fontSize="small" sx={{ mr: 1 }} />
// //                       <strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
// //                       <BiotechIcon fontSize="small" sx={{ mr: 1 }} />
// //                       <strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
// //                       <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
// //                       <strong>Notes:</strong> {record.notes || 'N/A'}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
// //                       <MedicalInformationIcon fontSize="small" sx={{ mr: 1 }} />
// //                       <strong>Doctor ID:</strong> {record.doctorId || 'N/A'}
// //                     </Typography>
// //                   </Box>
// //                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
// //                     <Button
// //                       variant="contained"
// //                       size="small"
// //                       onClick={() => handleViewPrescriptions(record.id)}
// //                       sx={{ flexGrow: 1, textTransform: 'none', px: 1 }}
// //                     >
// //                       View Prescriptions
// //                     </Button>
// //                     <Button
// //                       variant="outlined"
// //                       size="small"
// //                       onClick={() => handleViewTestReports(record.id)}
// //                       sx={{ flexGrow: 1, textTransform: 'none', px: 1 }}
// //                     >
// //                       View Test Reports
// //                     </Button>
// //                   </Box>
// //                 </CardContent>
// //               </Card>
// //             </Grid>
// //           ))}
// //         </Grid>
// //       )}

// //       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
// //         <Typography variant="body2" color="text.secondary">
// //           Detailed medical history for the selected patient.
// //         </Typography>
// //       </Box>
// //     </Box>
// //   );
// // };

// // LabTechnicianMedicalRecords.propTypes = {
// //   patientId: PropTypes.string.isRequired,
// //   onBack: PropTypes.func.isRequired,
// //   labTechnician: PropTypes.shape({
// //     userId: PropTypes.string,
// //     name: PropTypes.string,
// //     email: PropTypes.string,
// //     profilePic: PropTypes.string,
// //   }),
// // };

// // export default LabTechnicianMedicalRecords;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote'; // For record date
// import DescriptionIcon from '@mui/icons-material/Description'; // For chief complaint, diagnosis, treatment plan, notes
// import PersonIcon from '@mui/icons-material/Person'; // For patient ID (already in prop, but good for consistency)
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // For doctor ID
// import HealingIcon from '@mui/icons-material/Healing'; // For diagnosis
// import BiotechIcon from '@mui/icons-material/Biotech'; // For treatment plan

// // Import the new prescriptions component - Make sure this path is correct
// import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
// // Import the new test reports component - Make sure this path is correct
// import LabTechnicianTestReports from './LabTechnicianTestReports';

// const LabTechnicianMedicalRecords = ({ patientId, doctorIdFromAppointment, onBack, labTechnician }) => {
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State to manage showing the prescriptions page
//   const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
//   const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

//   // State to manage showing the test reports page
//   const [showTestReportsPage, setShowTestReportsPage] = useState(false);
//   const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

//   useEffect(() => {
//     const fetchMedicalRecords = async () => {
//       if (!patientId) {
//         setError("Patient ID is missing. Cannot fetch medical records.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch medical records for the specific patient
//         const response = await fetch(`http://localhost:2006/api/medical-records/patient/${patientId}`);

//         // Check for 204 No Content or empty response before attempting to parse JSON
//         if (response.status === 204 || response.headers.get('content-length') === '0') {
//           console.log(`No medical records found for patient ${patientId} (204 No Content).`);
//           setMedicalRecords([]);
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorBody = await response.text(); // Read error response as text
//           throw new Error(`Failed to fetch medical records: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const text = await response.text();
//         let data = [];
//         try {
//           data = text ? JSON.parse(text) : []; // Parse only if text is not empty
//         } catch (jsonError) {
//           console.error("Error parsing JSON response for medical records:", jsonError);
//           throw new Error("Invalid JSON response from server.");
//         }

//         console.log(`Fetched medical records for patient ${patientId}:`, data);
//         setMedicalRecords(data);
//       } catch (err) {
//         console.error("Error fetching medical records:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicalRecords();
//   }, [patientId]); // Re-run effect if patientId changes

//   // Handlers for the new buttons
//   const handleViewPrescriptions = (recordId) => {
//     setSelectedMedicalRecordIdForPrescriptions(recordId);
//     setShowPrescriptionsPage(true);
//   };

//   const handleViewTestReports = (recordId) => {
//     setSelectedMedicalRecordIdForTestReports(recordId);
//     setShowTestReportsPage(true);
//   };

//   const handleBackToMedicalRecordsFromPrescriptions = () => {
//     setShowPrescriptionsPage(false);
//     setSelectedMedicalRecordIdForPrescriptions(null);
//   };

//   const handleBackToMedicalRecordsFromTestReports = () => {
//     setShowTestReportsPage(false);
//     setSelectedMedicalRecordIdForTestReports(null);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
//         <CircularProgress sx={{ mt: 5 }} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
//           Loading medical records...
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
//           Failed to load medical records. Please try again later.
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           onClick={onBack}
//           sx={{ mt: 3 }}
//         >
//           Back to Appointments
//         </Button>
//       </Box>
//     );
//   }

//   // Conditionally render the Prescriptions page
//   if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
//     return (
//       <LabTechnicianPrescriptions
//         medicalRecordId={selectedMedicalRecordIdForPrescriptions}
//         onBack={handleBackToMedicalRecordsFromPrescriptions}
//         // Pass labTechnician and doctorIdFromAppointment if needed by Prescriptions component
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   // Conditionally render the Test Reports page
//   if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
//     return (
//       <LabTechnicianTestReports
//         medicalRecordId={selectedMedicalRecordIdForTestReports}
//         onBack={handleBackToMedicalRecordsFromTestReports}
//         // Pass labTechnician and doctorIdFromAppointment as they are needed by TestReports component
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Button
//         variant="outlined"
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 4, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
//       >
//         Back to Appointments
//       </Button>

//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Medical Records for Patient ID: {patientId}
//       </Typography>

//       {medicalRecords.length === 0 ? (
//         <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
//           <Typography variant="h6" color="text.secondary">
//             No medical records found for this patient.
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             Medical records will appear here after consultations.
//           </Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {medicalRecords.map((record) => (
//             <Grid item xs={12} sm={6} md={4} key={record.id}>
//               <Card elevation={6} sx={{
//                 borderRadius: 3,
//                 p: 2,
//                 background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
//                 boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
//                 height: '100%', // Ensure cards have equal height
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//               }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                     <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     Record Date: {new Date(record.recordDate).toLocaleDateString()}
//                   </Typography>
//                   <Box sx={{ mb: 1.5 }}>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                       <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
//                       <strong>Chief Complaint:</strong> {record.chiefComplaint || 'N/A'}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                       <HealingIcon fontSize="small" sx={{ mr: 1 }} />
//                       <strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                       <BiotechIcon fontSize="small" sx={{ mr: 1 }} />
//                       <strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                       <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
//                       <strong>Notes:</strong> {record.notes || 'N/A'}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
//                       <MedicalInformationIcon fontSize="small" sx={{ mr: 1 }} />
//                       <strong>Doctor ID:</strong> {record.doctorId || 'N/A'}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => handleViewPrescriptions(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1 }}
//                     >
//                       View Prescriptions
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleViewTestReports(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1 }}
//                     >
//                       View Test Reports
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Detailed medical history for the selected patient.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// LabTechnicianMedicalRecords.propTypes = {
//   patientId: PropTypes.string.isRequired,
//   doctorIdFromAppointment: PropTypes.string, // Added propType for doctorIdFromAppointment
//   onBack: PropTypes.func.isRequired,
//   labTechnician: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default LabTechnicianMedicalRecords;import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button, Divider
// } from '@mui/material';
// import { styled } from '@mui/system'; // Import styled for custom components

// // Icons
// import React, { useState, useEffect } from 'react';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote'; // For record date
// import DescriptionIcon from '@mui/icons-material/Description'; // For chief complaint, diagnosis, treatment plan, notes
// import PersonIcon from '@mui/icons-material/Person'; // For patient ID, Name
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // For doctor ID
// import HealingIcon from '@mui/icons-material/Healing'; // For diagnosis
// import BiotechIcon from '@mui/icons-material/Biotech'; // For treatment plan
// import EmailIcon from '@mui/icons-material/Email'; // For patient email
// import PhoneIcon from '@mui/icons-material/Phone'; // For patient contact
// import LocationOnIcon from '@mui/icons-material/LocationOn'; // For patient address
// import CakeIcon from '@mui/icons-material/Cake'; // For patient date of birth
// import WcIcon from '@mui/icons-material/Wc'; // For patient gender

// // Import the new prescriptions component
// import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
// // Import the new test reports component
// import LabTechnicianTestReports from './LabTechnicianTestReports';

// // --- Styled Components for Visual Enhancement ---

// const PageContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(4),
//   maxWidth: 1400, // Slightly wider for more content
//   margin: 'auto',
//   width: '100%',
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(2),
//   },
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2, // More rounded corners
//   padding: theme.spacing(3), // Increased padding
//   background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.08)', // Stronger, more refined shadow
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-5px)', // Subtle lift effect on hover
//     boxShadow: '0 16px 36px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)',
//   },
// }));

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 'bold',
//   color: theme.palette.primary.dark,
//   marginBottom: theme.spacing(4),
//   textAlign: 'center',
//   position: 'relative',
//   '&:after': {
//     content: '""',
//     display: 'block',
//     width: '80px', // Slightly wider underline
//     height: '4px',
//     background: theme.palette.primary.main,
//     margin: '8px auto 0',
//     borderRadius: '2px',
//   },
// }));

// const InfoBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginBottom: theme.spacing(1), // Vertical spacing for info items
//   color: theme.palette.text.secondary,
//   '& svg': {
//     marginRight: theme.spacing(1),
//     fontSize: '1.1rem', // Slightly larger icons
//   },
// }));

// const PatientDetailsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   mb: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #e0f2f7, #c1e4f2)', // Light blue gradient
//   boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
// }));

// const NoRecordsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
//   boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
//   textAlign: 'center',
//   marginTop: theme.spacing(4),
// }));

// // --- Main Component ---

// const LabTechnicianMedicalRecords = ({ patientId, doctorIdFromAppointment, onBack, labTechnician }) => {
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [patientDetails, setPatientDetails] = useState(null);
//   const [patientLoading, setPatientLoading] = useState(true);
//   const [patientError, setPatientError] = useState(null);

//   const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
//   const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

//   const [showTestReportsPage, setShowTestReportsPage] = useState(false);
//   const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

//   // Effect to fetch Medical Records
//   useEffect(() => {
//     const fetchMedicalRecords = async () => {
//       if (!patientId) {
//         setError("Patient ID is missing. Cannot fetch medical records.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`http://localhost:2006/api/medical-records/patient/${patientId}`);

//         if (response.status === 204 || response.headers.get('content-length') === '0') {
//           console.log(`No medical records found for patient ${patientId} (204 No Content).`);
//           setMedicalRecords([]);
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch medical records: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const text = await response.text();
//         let data = [];
//         try {
//           data = text ? JSON.parse(text) : [];
//         } catch (jsonError) {
//           console.error("Error parsing JSON response for medical records:", jsonError);
//           throw new Error("Invalid JSON response from server.");
//         }

//         console.log(`Fetched medical records for patient ${patientId}:`, data);
//         setMedicalRecords(data);
//       } catch (err) {
//         console.error("Error fetching medical records:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicalRecords();
//   }, [patientId]);

//   // Effect to fetch Patient Details
//   useEffect(() => {
//     const fetchPatientDetails = async () => {
//       if (!patientId) {
//         setPatientError("Patient ID is missing. Cannot fetch patient details.");
//         setPatientLoading(false);
//         return;
//       }

//       try {
//         setPatientLoading(true);
//         setPatientError(null);

//         const response = await fetch(`http://localhost:2008/api/patients/${patientId}`);

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const data = await response.json();
//         console.log(`Fetched patient details for ${patientId}:`, data);
//         setPatientDetails(data);
//       } catch (err) {
//         console.error("Error fetching patient details:", err);
//         setPatientError(err.message);
//       } finally {
//         setPatientLoading(false);
//       }
//     };

//     fetchPatientDetails();
//   }, [patientId]); // Re-run effect if patientId changes

//   const handleViewPrescriptions = (recordId) => {
//     setSelectedMedicalRecordIdForPrescriptions(recordId);
//     setShowPrescriptionsPage(true);
//   };

//   const handleViewTestReports = (recordId) => {
//     setSelectedMedicalRecordIdForTestReports(recordId);
//     setShowTestReportsPage(true);
//   };

//   const handleBackToMedicalRecordsFromPrescriptions = () => {
//     setShowPrescriptionsPage(false);
//     setSelectedMedicalRecordIdForPrescriptions(null);
//   };

//   const handleBackToMedicalRecordsFromTestReports = () => {
//     setShowTestReportsPage(false);
//     setSelectedMedicalRecordIdForTestReports(null);
//   };

//   if (loading || patientLoading) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <CircularProgress size={60} sx={{ mt: 10 }} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
//           Loading patient records and details...
//         </Typography>
//       </PageContainer>
//     );
//   }

//   if (error || patientError) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <Typography variant="h6" color="error" sx={{ mt: 10 }}>
//           Error: {error || patientError}
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//           Failed to load patient data. Please try again later.
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           onClick={onBack}
//           sx={{ mt: 3 }}
//         >
//           Back to Appointments
//         </Button>
//       </PageContainer>
//     );
//   }

//   // Conditionally render the Prescriptions page
//   if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
//     return (
//       <LabTechnicianPrescriptions
//         medicalRecordId={selectedMedicalRecordIdForPrescriptions}
//         onBack={handleBackToMedicalRecordsFromPrescriptions}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   // Conditionally render the Test Reports page
//   if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
//     return (
//       <LabTechnicianTestReports
//         medicalRecordId={selectedMedicalRecordIdForTestReports}
//         onBack={handleBackToMedicalRecordsFromTestReports}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   return (
//     <PageContainer>
//       <Button
//         variant="outlined"
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 4, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
//       >
//         Back to Appointments
//       </Button>

//       <SectionTitle variant="h4">
//         Medical Records for Patient ID: {patientId}
//       </SectionTitle>

//       {/* Patient Details Section */}
//       {patientDetails && (
//         <PatientDetailsPaper elevation={6}>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
//             <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.8rem' }} />
//             Patient Information
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <PersonIcon />
//                 <Typography variant="body1">
//                   <strong>Name:</strong> {patientDetails.name || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <EmailIcon />
//                 <Typography variant="body1">
//                   <strong>Email:</strong> {patientDetails.email || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <PhoneIcon />
//                 <Typography variant="body1">
//                   <strong>Contact:</strong> {patientDetails.contactNumber || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <LocationOnIcon />
//                 <Typography variant="body1">
//                   <strong>Address:</strong> {patientDetails.address || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <CakeIcon />
//                 <Typography variant="body1">
//                   <strong>Date of Birth:</strong> {patientDetails.dateOfBirth ? new Date(patientDetails.dateOfBirth).toLocaleDateString() : 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <WcIcon />
//                 <Typography variant="body1">
//                   <strong>Gender:</strong> {patientDetails.gender || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//           </Grid>
//         </PatientDetailsPaper>
//       )}

//       {/* Medical Records List */}
//       <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>
//         Medical History
//       </Typography>
//       <Divider sx={{ mb: 4 }} />

//       {medicalRecords.length === 0 ? (
//         <NoRecordsPaper elevation={6}>
//           <Typography variant="h6" color="text.secondary">
//             <DescriptionIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
//             <br />
//             No medical records found for this patient.
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             Medical records will appear here after consultations.
//           </Typography>
//         </NoRecordsPaper>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {medicalRecords.map((record) => (
//             <Grid item xs={12} sm={6} md={4} key={record.id}>
//               <StyledCard>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
//                     <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     Record Date: {new Date(record.recordDate).toLocaleDateString('en-IN', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </Typography>
//                   <Divider sx={{ mb: 1.5 }} />
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Chief Complaint:</strong> {record.chiefComplaint || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <HealingIcon />
//                     <Typography variant="body2">
//                       <strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <BiotechIcon />
//                     <Typography variant="body2">
//                       <strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Notes:</strong> {record.notes || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <MedicalInformationIcon />
//                     <Typography variant="body2">
//                       <strong>Doctor ID:</strong> {record.doctorId || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewPrescriptions(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Prescriptions
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewTestReports(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Test Reports
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </StyledCard>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="caption" color="text.secondary">
//           Last updated: July 2025. Detailed medical history for the selected patient.
//         </Typography>
//       </Box>
//     </PageContainer>
//   );
// };

// LabTechnicianMedicalRecords.propTypes = {
//   patientId: PropTypes.string.isRequired,
//   doctorIdFromAppointment: PropTypes.string,
//   onBack: PropTypes.func.isRequired,
//   labTechnician: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default LabTechnicianMedicalRecords;

// import React, { useState, useEffect } from 'react'; // <-- Move this line to the top
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button, Divider
// } from '@mui/material';
// import { styled } from '@mui/system'; // Import styled for custom components

// // Icons
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote'; // For record date
// import DescriptionIcon from '@mui/icons-material/Description'; // For chief complaint, diagnosis, treatment plan, notes
// import PersonIcon from '@mui/icons-material/Person'; // For patient ID, Name
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // For doctor ID
// import HealingIcon from '@mui/icons-material/Healing'; // For diagnosis
// import BiotechIcon from '@mui/icons-material/Biotech'; // For treatment plan
// import EmailIcon from '@mui/icons-material/Email'; // For patient email
// import PhoneIcon from '@mui/icons-material/Phone'; // For patient contact
// import LocationOnIcon from '@mui/icons-material/LocationOn'; // For patient address
// import CakeIcon from '@mui/icons-material/Cake'; // For patient date of birth
// import WcIcon from '@mui/icons-material/Wc'; // For patient gender

// // Import the new prescriptions component
// import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
// // Import the new test reports component
// import LabTechnicianTestReports from './LabTechnicianTestReports';

// // --- Styled Components for Visual Enhancement ---

// const PageContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(4),
//   maxWidth: 1400, // Slightly wider for more content
//   margin: 'auto',
//   width: '100%',
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(2),
//   },
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2, // More rounded corners
//   padding: theme.spacing(3), // Increased padding
//   background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.08)', // Stronger, more refined shadow
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-5px)', // Subtle lift effect on hover
//     boxShadow: '0 16px 36px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)',
//   },
// }));

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 'bold',
//   color: theme.palette.primary.dark,
//   marginBottom: theme.spacing(4),
//   textAlign: 'center',
//   position: 'relative',
//   '&:after': {
//     content: '""',
//     display: 'block',
//     width: '80px', // Slightly wider underline
//     height: '4px',
//     background: theme.palette.primary.main,
//     margin: '8px auto 0',
//     borderRadius: '2px',
//   },
// }));

// const InfoBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginBottom: theme.spacing(1), // Vertical spacing for info items
//   color: theme.palette.text.secondary,
//   '& svg': {
//     marginRight: theme.spacing(1),
//     fontSize: '1.1rem', // Slightly larger icons
//   },
// }));

// const PatientDetailsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   mb: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #e0f2f7, #c1e4f2)', // Light blue gradient
//   boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
// }));

// const NoRecordsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
//   boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
//   textAlign: 'center',
//   marginTop: theme.spacing(4),
// }));

// // --- Main Component ---

// const LabTechnicianMedicalRecords = ({ patientId, doctorIdFromAppointment, onBack, labTechnician }) => {
//   // Print patientId to console as soon as the component receives it
//   // This will log on initial render and whenever patientId changes
//   console.log("Current Patient ID:", patientId);

//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [patientDetails, setPatientDetails] = useState(null);
//   const [patientLoading, setPatientLoading] = useState(true);
//   const [patientError, setPatientError] = useState(null);

//   const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
//   const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

//   const [showTestReportsPage, setShowTestReportsPage] = useState(false);
//   const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

//   // Effect to fetch Medical Records
//   useEffect(() => {
//     const fetchMedicalRecords = async () => {
//       if (!patientId) {
//         setError("Patient ID is missing. Cannot fetch medical records.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`http://localhost:2006/api/medical-records/patient/${patientId}`);

//         if (response.status === 204 || response.headers.get('content-length') === '0') {
//           console.log(`No medical records found for patient ${patientId} (204 No Content).`);
//           setMedicalRecords([]);
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch medical records: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const text = await response.text();
//         let data = [];
//         try {
//           data = text ? JSON.parse(text) : [];
//         } catch (jsonError) {
//           console.error("Error parsing JSON response for medical records:", jsonError);
//           throw new Error("Invalid JSON response from server.");
//         }

//         console.log(`Fetched medical records for patient ${patientId}:`, data);
//         setMedicalRecords(data);
//       } catch (err) {
//         console.error("Error fetching medical records:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicalRecords();
//   }, [patientId]);

//   // Effect to fetch Patient Details
//   useEffect(() => {
//     const fetchPatientDetails = async () => {
//       if (!patientId) {
//         setPatientError("Patient ID is missing. Cannot fetch patient details.");
//         setPatientLoading(false);
//         return;
//       }

//       try {
//         setPatientLoading(true);
//         setPatientError(null);

//         const response = await fetch(`http://localhost:2008/api/patients/${patientId}`);

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const data = await response.json();
//         console.log(`Fetched patient details for ${patientId}:`, data);
//         setPatientDetails(data);
//       } catch (err) {
//         console.error("Error fetching patient details:", err);
//         setPatientError(err.message);
//       } finally {
//         setPatientLoading(false);
//       }
//     };

//     fetchPatientDetails();
//   }, [patientId]); // Re-run effect if patientId changes

//   const handleViewPrescriptions = (recordId) => {
//     console.log("Viewing prescriptions for Medical Record ID:", recordId); // Log record.id
//     setSelectedMedicalRecordIdForPrescriptions(recordId);
//     setShowPrescriptionsPage(true);
//   };

//   const handleViewTestReports = (recordId) => {
//     console.log("Viewing test reports for Medical Record ID:", recordId); // Log record.id
//     setSelectedMedicalRecordIdForTestReports(recordId);
//     setShowTestReportsPage(true);
//   };

//   const handleBackToMedicalRecordsFromPrescriptions = () => {
//     setShowPrescriptionsPage(false);
//     setSelectedMedicalRecordIdForPrescriptions(null);
//   };

//   const handleBackToMedicalRecordsFromTestReports = () => {
//     setShowTestReportsPage(false);
//     setSelectedMedicalRecordIdForTestReports(null);
//   };

//   if (loading || patientLoading) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <CircularProgress size={60} sx={{ mt: 10 }} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
//           Loading patient records and details...
//         </Typography>
//       </PageContainer>
//     );
//   }

//   if (error || patientError) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <Typography variant="h6" color="error" sx={{ mt: 10 }}>
//           Error: {error || patientError}
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//           Failed to load patient data. Please try again later.
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           onClick={onBack}
//           sx={{ mt: 3 }}
//         >
//           Back to Appointments
//         </Button>
//       </PageContainer>
//     );
//   }

//   // Conditionally render the Prescriptions page
//   if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
//     return (
//       <LabTechnicianPrescriptions
//         medicalRecordId={selectedMedicalRecordIdForPrescriptions}
//         onBack={handleBackToMedicalRecordsFromPrescriptions}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   // Conditionally render the Test Reports page
//   if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
//     return (
//       <LabTechnicianTestReports
//         medicalRecordId={selectedMedicalRecordIdForTestReports}
//         onBack={handleBackToMedicalRecordsFromTestReports}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   return (
//     <PageContainer>
//       <Button
//         variant="outlined"
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 4, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
//       >
//         Back to Appointments
//       </Button>

//       <SectionTitle variant="h4">
//         Medical Records for Patient ID: {patientId}
//       </SectionTitle>

//       {/* Patient Details Section */}
//       {patientDetails && (
//         <PatientDetailsPaper elevation={6}>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
//             <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.8rem' }} />
//             Patient Information
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <PersonIcon />
//                 <Typography variant="body1">
//                   <strong>Name:</strong> {patientDetails.name || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <EmailIcon />
//                 <Typography variant="body1">
//                   <strong>Email:</strong> {patientDetails.email || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <PhoneIcon />
//                 <Typography variant="body1">
//                   <strong>Contact:</strong> {patientDetails.contactNumber || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <LocationOnIcon />
//                 <Typography variant="body1">
//                   <strong>Address:</strong> {patientDetails.address || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <CakeIcon />
//                 <Typography variant="body1">
//                   <strong>Date of Birth:</strong> {patientDetails.dateOfBirth ? new Date(patientDetails.dateOfBirth).toLocaleDateString() : 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <WcIcon />
//                 <Typography variant="body1">
//                   <strong>Gender:</strong> {patientDetails.gender || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//           </Grid>
//         </PatientDetailsPaper>
//       )}

//       {/* Medical Records List */}
//       <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>
//         Medical History
//       </Typography>
//       <Divider sx={{ mb: 4 }} />

//       {medicalRecords.length === 0 ? (
//         <NoRecordsPaper elevation={6}>
//           <Typography variant="h6" color="text.secondary">
//             <DescriptionIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
//             <br />
//             No medical records found for this patient.
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             Medical records will appear here after consultations.
//           </Typography>
//         </NoRecordsPaper>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {medicalRecords.map((record) => (
//             <Grid item xs={12} sm={6} md={4} key={record.id}>
//               <StyledCard>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
//                     <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     Record Date: {new Date(record.recordDate).toLocaleDateString('en-IN', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </Typography>
//                   <Divider sx={{ mb: 1.5 }} />
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Chief Complaint:</strong> {record.chiefComplaint || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <HealingIcon />
//                     <Typography variant="body2">
//                       <strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <BiotechIcon />
//                     <Typography variant="body2">
//                       <strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Notes:</strong> {record.notes || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <MedicalInformationIcon />
//                     <Typography variant="body2">
//                       <strong>Doctor ID:</strong> {record.doctorId || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewPrescriptions(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Prescriptions
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewTestReports(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Test Reports
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </StyledCard>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="caption" color="text.secondary">
//           Last updated: July 2025. Detailed medical history for the selected patient.
//         </Typography>
//       </Box>
//     </PageContainer>
//   );
// };

// LabTechnicianMedicalRecords.propTypes = {
//   patientId: PropTypes.string.isRequired,
//   doctorIdFromAppointment: PropTypes.string,
//   onBack: PropTypes.func.isRequired,
//   labTechnician: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default LabTechnicianMedicalRecords;


// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button, Divider
// } from '@mui/material';
// import { styled } from '@mui/system'; // Import styled for custom components

// // Icons
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote'; // For record date
// import DescriptionIcon from '@mui/icons-material/Description'; // For chief complaint, diagnosis, treatment plan, notes
// import PersonIcon from '@mui/icons-material/Person'; // For patient ID, Name
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // For doctor ID
// import HealingIcon from '@mui/icons-material/Healing'; // For diagnosis
// import BiotechIcon from '@mui/icons-material/Biotech'; // For treatment plan
// import EmailIcon from '@mui/icons-material/Email'; // For patient email
// import PhoneIcon from '@mui/icons-material/Phone'; // For patient contact
// import LocationOnIcon from '@mui/icons-material/LocationOn'; // For patient address
// import CakeIcon from '@mui/icons-material/Cake'; // For patient date of birth
// import WcIcon from '@mui/icons-material/Wc'; // For patient gender

// // Import the new prescriptions component
// import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
// // Import the new test reports component
// import LabTechnicianTestReports from './LabTechnicianTestReports';

// // --- Styled Components for Visual Enhancement ---

// const PageContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(4),
//   maxWidth: 1400, // Slightly wider for more content
//   margin: 'auto',
//   width: '100%',
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(2),
//   },
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2, // More rounded corners
//   padding: theme.spacing(3), // Increased padding
//   background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.08)', // Stronger, more refined shadow
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-5px)', // Subtle lift effect on hover
//     boxShadow: '0 16px 36px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)',
//   },
// }));

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 'bold',
//   color: theme.palette.primary.dark,
//   marginBottom: theme.spacing(4),
//   textAlign: 'center',
//   position: 'relative',
//   '&:after': {
//     content: '""',
//     display: 'block',
//     width: '80px', // Slightly wider underline
//     height: '4px',
//     background: theme.palette.primary.main,
//     margin: '8px auto 0',
//     borderRadius: '2px',
//   },
// }));

// const InfoBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginBottom: theme.spacing(1), // Vertical spacing for info items
//   color: theme.palette.text.secondary,
//   '& svg': {
//     marginRight: theme.spacing(1),
//     fontSize: '1.1rem', // Slightly larger icons
//   },
// }));

// const PatientDetailsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   mb: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #e0f2f7, #c1e4f2)', // Light blue gradient
//   boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
// }));

// const NoRecordsPaper = styled(Paper)(({ theme }) => ({
//   p: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
//   boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
//   textAlign: 'center',
//   marginTop: theme.spacing(4),
// }));

// // --- Main Component ---

// const LabTechnicianMedicalRecords = ({ patientId, doctorIdFromAppointment, onBack, labTechnician }) => {
//   console.log("Current Patient ID:", patientId);

//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [patientDetails, setPatientDetails] = useState(null);
//   const [patientLoading, setPatientLoading] = useState(true);
//   const [patientError, setPatientError] = useState(null);

//   const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
//   const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

//   const [showTestReportsPage, setShowTestReportsPage] = useState(false);
//   const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

//   // Effect to fetch Medical Records
//   useEffect(() => {
//     const fetchMedicalRecords = async () => {
//       if (!patientId) {
//         setError("Patient ID is missing. Cannot fetch medical records.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`http://localhost:2006/api/medical-records/patient/${patientId}`);

//         if (response.status === 204 || response.headers.get('content-length') === '0') {
//           console.log(`No medical records found for patient ${patientId} (204 No Content).`);
//           setMedicalRecords([]);
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch medical records: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const text = await response.text();
//         let data = [];
//         try {
//           data = text ? JSON.parse(text) : [];
//         } catch (jsonError) {
//           console.error("Error parsing JSON response for medical records:", jsonError);
//           throw new Error("Invalid JSON response from server.");
//         }

//         console.log(`Fetched medical records for patient ${patientId}:`, data);
//         setMedicalRecords(data);
//       } catch (err) {
//         console.error("Error fetching medical records:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicalRecords();
//   }, [patientId]);

//   // Effect to fetch Patient Details
//   useEffect(() => {
//     const fetchPatientDetails = async () => {
//       if (!patientId) {
//         setPatientError("Patient ID is missing. Cannot fetch patient details.");
//         setPatientLoading(false);
//         return;
//       }

//       try {
//         setPatientLoading(true);
//         setPatientError(null);

//         const response = await fetch(`http://localhost:2008/api/patients/${patientId}`);

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText} - ${errorBody}`);
//         }

//         const data = await response.json();
//         console.log(`Fetched patient details for ${patientId}:`, data);
//         setPatientDetails(data);
//       } catch (err) {
//         console.error("Error fetching patient details:", err);
//         setPatientError(err.message);
//       } finally {
//         setPatientLoading(false);
//       }
//     };

//     fetchPatientDetails();
//   }, [patientId]); // Re-run effect if patientId changes

//   const handleViewPrescriptions = (recordId) => {
//     console.log("Viewing prescriptions for Medical Record ID:", recordId);
//     setSelectedMedicalRecordIdForPrescriptions(recordId);
//     setShowPrescriptionsPage(true);
//   };

//   const handleViewTestReports = (recordId) => {
//     console.log("Viewing test reports for Medical Record ID:", recordId);
//     setSelectedMedicalRecordIdForTestReports(recordId);
//     setShowTestReportsPage(true);
//   };

//   const handleBackToMedicalRecordsFromPrescriptions = () => {
//     setShowPrescriptionsPage(false);
//     setSelectedMedicalRecordIdForPrescriptions(null);
//   };

//   const handleBackToMedicalRecordsFromTestReports = () => {
//     setShowTestReportsPage(false);
//     setSelectedMedicalRecordIdForTestReports(null);
//   };

//   if (loading || patientLoading) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <CircularProgress size={60} sx={{ mt: 10 }} />
//         <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
//           Loading patient records and details...
//         </Typography>
//       </PageContainer>
//     );
//   }

//   if (error || patientError) {
//     return (
//       <PageContainer sx={{ textAlign: 'center' }}>
//         <Typography variant="h6" color="error" sx={{ mt: 10 }}>
//           Error: {error || patientError}
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//           Failed to load patient data. Please try again later.
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           onClick={onBack}
//           sx={{ mt: 3 }}
//         >
//           Back to Appointments
//         </Button>
//       </PageContainer>
//     );
//   }

//   // Conditionally render the Prescriptions page
//   if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
//     return (
//       <LabTechnicianPrescriptions
//         medicalRecordId={selectedMedicalRecordIdForPrescriptions}
//         onBack={handleBackToMedicalRecordsFromPrescriptions}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   // Conditionally render the Test Reports page
//   if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
//     return (
//       <LabTechnicianTestReports
//         medicalRecordId={selectedMedicalRecordIdForTestReports}
//         onBack={handleBackToMedicalRecordsFromTestReports}
//         labTechnician={labTechnician}
//         doctorIdFromAppointment={doctorIdFromAppointment}
//       />
//     );
//   }

//   return (
//     <PageContainer>
//       <Button
//         variant="outlined"
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 4, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
//       >
//         Back to Appointments
//       </Button>

//       <SectionTitle variant="h4">
//         Medical Records for Patient ID: {patientId}
//       </SectionTitle>

//       {/* Patient Details Section */}
//       {patientDetails && (
//         <PatientDetailsPaper elevation={6}>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
//             <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.8rem' }} />
//             Patient Information
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <PersonIcon />
//                 <Typography variant="body1">
//                   <strong>Name:</strong> {patientDetails.first_name} {patientDetails.last_name || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <EmailIcon />
//                 <Typography variant="body1">
//                   <strong>Email:</strong> {patientDetails.email || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <PhoneIcon />
//                 <Typography variant="body1">
//                   <strong>Contact:</strong> {patientDetails.contact_number || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InfoBox>
//                 <LocationOnIcon />
//                 <Typography variant="body1">
//                   <strong>Address:</strong> {patientDetails.address || 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <CakeIcon />
//                 <Typography variant="body1">
//                   <strong>Date of Birth:</strong> {patientDetails.date_of_birth ? new Date(patientDetails.date_of_birth).toLocaleDateString() : 'N/A'}
//                 </Typography>
//               </InfoBox>
//               <InfoBox>
//                 <WcIcon />
//                 <Typography variant="body1">
//                   <strong>Gender:</strong> {patientDetails.gender || 'N/A'}
//                 </Typography>
//               </InfoBox>
//             </Grid>
//           </Grid>
//         </PatientDetailsPaper>
//       )}

//       {/* Medical Records List */}
//       <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>
//         Medical History
//       </Typography>
//       <Divider sx={{ mb: 4 }} />

//       {medicalRecords.length === 0 ? (
//         <NoRecordsPaper elevation={6}>
//           <Typography variant="h6" color="text.secondary">
//             <DescriptionIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
//             <br />
//             No medical records found for this patient.
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             Medical records will appear here after consultations.
//           </Typography>
//         </NoRecordsPaper>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {medicalRecords.map((record) => (
//             <Grid item xs={12} sm={6} md={4} key={record.id}>
//               <StyledCard>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
//                     <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
//                     Record Date: {new Date(record.recordDate).toLocaleDateString('en-IN', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </Typography>
//                   <Divider sx={{ mb: 1.5 }} />
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Chief Complaint:</strong> {record.chiefComplaint || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <HealingIcon />
//                     <Typography variant="body2">
//                       <strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <BiotechIcon />
//                     <Typography variant="body2">
//                       <strong>Treatment Plan:</strong> {record.treatmentPlan || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <DescriptionIcon />
//                     <Typography variant="body2">
//                       <strong>Notes:</strong> {record.notes || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <InfoBox>
//                     <MedicalInformationIcon />
//                     <Typography variant="body2">
//                       <strong>Doctor ID:</strong> {record.doctorId || 'N/A'}
//                     </Typography>
//                   </InfoBox>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 1 }}>
//                     <Button
//                       variant="contained"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewPrescriptions(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Prescriptions
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="medium" // Slightly larger buttons
//                       onClick={() => handleViewTestReports(record.id)}
//                       sx={{ flexGrow: 1, textTransform: 'none', px: 1, borderRadius: 2 }}
//                     >
//                       View Test Reports
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </StyledCard>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="caption" color="text.secondary">
//           Last updated: July 2025. Detailed medical history for the selected patient.
//         </Typography>
//       </Box>
//     </PageContainer>
//   );
// };

// LabTechnicianMedicalRecords.propTypes = {
//   patientId: PropTypes.string.isRequired,
//   doctorIdFromAppointment: PropTypes.string,
//   onBack: PropTypes.func.isRequired,
//   labTechnician: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default LabTechnicianMedicalRecords;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Button, Divider
} from '@mui/material';
import { styled } from '@mui/system';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HealingIcon from '@mui/icons-material/Healing';
import BiotechIcon from '@mui/icons-material/Biotech';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';

import LabTechnicianPrescriptions from './LabTechnicianPrescriptions';
import LabTechnicianTestReports from './LabTechnicianTestReports';


const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1400,
  margin: 'auto',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
  boxShadow: '0 12px 28px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 16px 36px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  '&:after': {
    content: '""',
    display: 'block',
    width: '80px',
    height: '4px',
    background: theme.palette.primary.main,
    margin: '8px auto 0',
    borderRadius: '2px',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  },
}));

const PatientDetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(145deg, #e3f2fd, #bbdefb)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.primary.light}`, 
  position: 'relative',
  overflow: 'hidden',
  '&:before': { 
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: theme.palette.primary.main,
  },
}));

const PatientDetailsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.8rem',
  '& svg': {
    fontSize: '2rem',
    marginRight: theme.spacing(1.5),
  },
}));

const NoRecordsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  textAlign: 'center',
  marginTop: theme.spacing(4),
}));


const LabTechnicianMedicalRecords = ({ patientId, doctorIdFromAppointment, onBack, labTechnician, appointmentId }) => {
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [patientDetails, setPatientDetails] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientError, setPatientError] = useState(null);

  const [showPrescriptionsPage, setShowPrescriptionsPage] = useState(false);
  const [selectedMedicalRecordIdForPrescriptions, setSelectedMedicalRecordIdForPrescriptions] = useState(null);

  const [showTestReportsPage, setShowTestReportsPage] = useState(false);
  const [selectedMedicalRecordIdForTestReports, setSelectedMedicalRecordIdForTestReports] = useState(null);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      const medicalRecordId = appointmentId?.medicalRecordId;

      if (!medicalRecordId) {
        setError("Medical Record ID is missing from the appointment object. Cannot fetch medical record.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:2006/api/medical-records/${medicalRecordId}`);

        if (response.status === 204 || response.headers.get('content-length') === '0') {
          setMedicalRecord(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch medical record: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        setMedicalRecord(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentId]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientId) {
        setPatientError("Patient ID is missing. Cannot fetch patient details.");
        setPatientLoading(false);
        return;
      }

      try {
        setPatientLoading(true);
        setPatientError(null);

        const response = await fetch(`http://localhost:2008/api/patients/${patientId}`);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        setPatientDetails(data);
      } catch (err) {
        setPatientError(err.message);
      } finally {
        setPatientLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const handleViewPrescriptions = () => {
    if (medicalRecord) {
      setSelectedMedicalRecordIdForPrescriptions(medicalRecord.id);
      setShowPrescriptionsPage(true);
    }
  };

  const handleViewTestReports = () => {
    if (medicalRecord) {
      setSelectedMedicalRecordIdForTestReports(medicalRecord.id);
      setShowTestReportsPage(true);
    }
  };

  const handleBackToMedicalRecordsFromPrescriptions = () => {
    setShowPrescriptionsPage(false);
    setSelectedMedicalRecordIdForPrescriptions(null);
  };

  const handleBackToMedicalRecordsFromTestReports = () => {
    setShowTestReportsPage(false);
    setSelectedMedicalRecordIdForTestReports(null);
  };

  if (loading || patientLoading) {
    return (
      <PageContainer sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mt: 10 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
          Loading patient records and details...
        </Typography>
      </PageContainer>
    );
  }

  if (error || patientError) {
    return (
      <PageContainer sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mt: 10 }}>
          Error: {error || patientError}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Failed to load patient data. Please try again later.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 3 }}
        >
          Back to Appointments
        </Button>
      </PageContainer>
    );
  }

  if (showPrescriptionsPage && selectedMedicalRecordIdForPrescriptions) {
    return (
      <LabTechnicianPrescriptions
        medicalRecordId={selectedMedicalRecordIdForPrescriptions}
        onBack={handleBackToMedicalRecordsFromPrescriptions}
        labTechnician={labTechnician}
        doctorIdFromAppointment={doctorIdFromAppointment}
      />
    );
  }

  if (showTestReportsPage && selectedMedicalRecordIdForTestReports) {
    return (
      <LabTechnicianTestReports
        medicalRecordId={selectedMedicalRecordIdForTestReports}
        onBack={handleBackToMedicalRecordsFromTestReports}
        labTechnician={labTechnician}
        doctorIdFromAppointment={doctorIdFromAppointment}
      />
    );
  }

  return (
    <PageContainer>
      <HeaderBox>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
        >
          Back to Appointments
        </Button>
      </HeaderBox>

      <SectionTitle variant="h4">
        Medical Record for Appointment      </SectionTitle>

      {/* Patient Details Section */}
      {patientDetails && (
        <PatientDetailsPaper elevation={6}>
          <PatientDetailsTitle>
            <PersonIcon />
            Patient Information
          </PatientDetailsTitle>
          <Divider sx={{ mb: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
          <Grid container spacing={4}> {/* Increased spacing */}
            <Grid item xs={12} sm={6}>
              <InfoBox>
                <PersonIcon />
                <Typography variant="body1">
                  <strong>Name:</strong> {patientDetails.first_name} {patientDetails.last_name || 'N/A'}
                </Typography>
              </InfoBox>
              <InfoBox>
                <PhoneIcon />
                <Typography variant="body1">
                  <strong>Contact:</strong> {patientDetails.contact_number || 'N/A'}
                </Typography>
              </InfoBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoBox>
                <LocationOnIcon />
                <Typography variant="body1">
                  <strong>Address:</strong> {patientDetails.address || 'N/A'}
                </Typography>
              </InfoBox>
              <InfoBox>
                <CakeIcon />
                <Typography variant="body1">
                  <strong>Date of Birth:</strong> {patientDetails.date_of_birth ? new Date(patientDetails.date_of_birth).toLocaleDateString() : 'N/A'}
                </Typography>
              </InfoBox>
              <InfoBox>
                <WcIcon />
                <Typography variant="body1">
                  <strong>Gender:</strong> {patientDetails.gender || 'N/A'}
                </Typography>
              </InfoBox>
            </Grid>
          </Grid>
        </PatientDetailsPaper>
      )}

      {medicalRecord ? (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Record Date: {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
              
                <InfoBox>
                  <HealingIcon />
                  <Typography variant="body2">
                    <strong>Diagnosis:</strong> {medicalRecord.diagnosis || 'N/A'}
                  </Typography>
                </InfoBox>
                
                <InfoBox>
                  <DescriptionIcon />
                  <Typography variant="body2">
                    <strong>Notes:</strong> {medicalRecord.notes || 'N/A'}
                  </Typography>
                </InfoBox>
               
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                    size="large"
                    onClick={handleViewPrescriptions}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    View Prescriptions
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ScienceIcon />}
                    size="large"
                    onClick={handleViewTestReports}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    View Test Reports
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      ) : (
        <NoRecordsPaper elevation={6}>
          <Typography variant="h6" color="text.secondary">
            <DescriptionIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
            <br />
            No medical record found for this appointment.
          </Typography>
        </NoRecordsPaper>
      )}
    </PageContainer>
  );
};

LabTechnicianMedicalRecords.propTypes = {
  patientId: PropTypes.string.isRequired,
  doctorIdFromAppointment: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  labTechnician: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  appointmentId: PropTypes.shape({
    id: PropTypes.string,
    medicalRecordId: PropTypes.string.isRequired,
  }).isRequired,
};

export default LabTechnicianMedicalRecords;
