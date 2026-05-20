// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Divider,
//   Button,
//   Grid,
//   TextField,
//   Card,
//   CardContent,
//   Modal,
//   CircularProgress,
//   Alert,
// } from '@mui/material';

// async function fetchData(url) {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch from ${url}: ${response.status} - ${errorText}`);
//     }
//     return response.json();
//   } catch (error) {
//     console.error(`Fetch error for URL: ${url}`, error);
//     throw error;
//   }
// }

// function BillingForm({ appointmentId, onBack }) {
//   const [appointment, setAppointment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [consultationFee, setConsultationFee] = useState('250.00');
//   const [additionalCharges, setAdditionalCharges] = useState('0.00');
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     const fetchAppointmentDetails = async () => {
//       try {
//         setLoading(true);
//         const fetchedAppointment = await fetchData(`http://localhost:2010/api/appointments/${appointmentId}`);

//         let patientName = 'Unknown Patient';
//         let doctorName = 'Unknown Doctor';
//         try {
//           const patientData = await fetchData(`http://localhost:2010/api/patients/${fetchedAppointment.patientId}`);
//           patientName = patientData.name;
//         } catch (e) {
//           console.error('Could not fetch patient name:', e);
//         }
//         try {
//           const doctorData = await fetchData(`http://localhost:2010/api/doctors/${fetchedAppointment.doctorId}`);
//           doctorName = doctorData.name;
//         } catch (e) {
//           console.error('Could not fetch doctor name:', e);
//         }

//         const appointmentDate = new Date(fetchedAppointment.appointmentDate).toLocaleDateString();
//         const appointmentTime = new Date(fetchedAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//         const formattedAppointment = {
//           ...fetchedAppointment,
//           patientName,
//           doctorName,
//           formattedDate: appointmentDate,
//           formattedTime: appointmentTime,
//         };

//         setAppointment(formattedAppointment);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching appointment details:', err);
//         setError('Failed to load appointment details. Please check the API.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointmentDetails();
//   }, [appointmentId]);

//   const handleCreateBill = () => {
//     // This is where the bill creation logic would go.
//     // For this example, we'll just log the details and show a modal.
//     console.log('Bill created for appointment:', appointment.id);
//     console.log('Billing Details:', { consultationFee, additionalCharges, notes });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     onBack();
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
//           &larr; Back to Appointments
//         </Button>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   if (!appointment) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
//           &larr; Back to Appointments
//         </Button>
//         <Alert severity="info">No appointment data to display.</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         p: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         height: '100%',
//         overflowY: 'auto',
//       }}
//     >
//       <Box sx={{ width: '100%', maxWidth: 800 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//           <Typography variant="h4" component="h1">
//             Generate Bill
//           </Typography>
//           <Button onClick={onBack} variant="outlined">
//             Back to Appointments
//           </Button>
//         </Box>
//         <Card elevation={3} sx={{ p: 4 }}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Bill for Appointment
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1"><strong>Patient:</strong> {appointment.patientName}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1"><strong>Doctor:</strong> {appointment.doctorName}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1"><strong>Date:</strong> {appointment.formattedDate}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1"><strong>Time:</strong> {appointment.formattedTime}</Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="body1"><strong>Reason for Visit:</strong> {appointment.reasonForVisit}</Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 4 }} />

//             <Typography variant="h6" gutterBottom>
//               Billing Details
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <TextField 
//                   label="Consultation Fee" 
//                   fullWidth 
//                   variant="outlined" 
//                   value={consultationFee} 
//                   onChange={(e) => setConsultationFee(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField 
//                   label="Additional Charges" 
//                   fullWidth 
//                   variant="outlined" 
//                   value={additionalCharges}
//                   onChange={(e) => setAdditionalCharges(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField 
//                   label="Notes" 
//                   fullWidth 
//                   multiline 
//                   rows={4} 
//                   variant="outlined" 
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 />
//               </Grid>
//             </Grid>

//             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
//               <Button variant="contained" color="primary" onClick={handleCreateBill}>
//                 Create Bill
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>

//       {/* Custom Modal for alert message */}
//       <Modal open={showModal} onClose={handleCloseModal}>
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           border: '2px solid #000',
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 2,
//         }}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Success!
//           </Typography>
//           <Typography sx={{ mt: 2 }}>
//             Bill for appointment {appointment?.id} created successfully!
//           </Typography>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//             <Button onClick={handleCloseModal} variant="contained">
//               OK
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

// BillingForm.propTypes = {
//   appointmentId: PropTypes.string.isRequired,
//   onBack: PropTypes.func.isRequired,
// };

// export default BillingForm;
