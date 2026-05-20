// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   CircularProgress,
//   Alert,
//   Button,
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

// function AppointmentList({ billingDeskUser, onGenerateBillClick }) {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setLoading(true);
//         const fetchedAppointments = await fetchData(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments');
//         const enrichedAppointments = await Promise.all(
//           fetchedAppointments.map(async (appointment) => {
//             let patientName = 'Unknown Patient';
//             let doctorName = 'Unknown Doctor';

//             try {
//               const patientData = await fetchData(`http://localhost:2008/api/patients/${appointment.patientId}`);
//               patientName = patientData.name;
//             } catch (patientError) {
//               console.error(`Could not fetch patient with ID ${appointment.patientId}:`, patientError);
//             }

//             try {
//               const doctorData = await fetchData(`http://localhost:2005/api/doctors/${appointment.doctorId}`);
//               doctorName = doctorData.name;
//             } catch (doctorError) {
//               console.error(`Could not fetch doctor with ID ${appointment.doctorId}:`, doctorError);
//             }

//             const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString();
//             const appointmentTime = new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//             return {
//               ...appointment,
//               patientName,
//               doctorName,
//               formattedDate: appointmentDate,
//               formattedTime: appointmentTime,
//             };
//           })
//         );

//         setAppointments(enrichedAppointments);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching appointments:', err);
//         setError('Failed to load appointments. Please check the API.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         p: 4,
//         bgcolor: 'background.default',
//         overflowY: 'auto',
//       }}
//     >
//       <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
//         Consultation Bill
//       </Typography>
//       <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 4 }}>
//         Welcome, {billingDeskUser.name}! This page shows a list of recent appointments. You can generate a bill for each one.
//       </Typography>

//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ width: '100%', maxWidth: 700, mt: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && appointments.length === 0 && (
//         <Alert severity="info" sx={{ width: '100%', maxWidth: 700, mt: 2 }}>
//           No appointments found.
//         </Alert>
//       )}

//       {!loading && !error && appointments.length > 0 && (
//         <Box sx={{ width: '100%', maxWidth: 700 }}>
//           <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
//             Recent Appointments
//           </Typography>
//           <List>
//             {appointments.map((appointment) => (
//               <Paper elevation={2} sx={{ mb: 2, p: 2 }} key={appointment.id}>
//                 <ListItem disableGutters>
//                   <ListItemText
//                     primary={
//                       <Typography variant="h6" component="span">
//                         {appointment.patientName}
//                       </Typography>
//                     }
//                     secondary={
//                       <>
//                         <Typography component="span" variant="body2" color="text.primary">
//                           Doctor: {appointment.doctorName}
//                         </Typography>
//                         <br />
//                         <Typography component="span" variant="body2" color="text.secondary">
//                           Date: {appointment.formattedDate} | Time: {appointment.formattedTime}
//                         </Typography>
//                         <br />
//                         <Typography component="span" variant="body2" color="text.secondary">
//                           Reason: {appointment.reasonForVisit}
//                         </Typography>
//                       </>
//                     }
//                   />
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => onGenerateBillClick(appointment.id)}
//                     sx={{ ml: 2, flexShrink: 0 }}
//                   >
//                     Generate Bill
//                   </Button>
//                 </ListItem>
//               </Paper>
//             ))}
//           </List>
//         </Box>
//       )}
//     </Box>
//   );
// }

// AppointmentList.propTypes = {
//   billingDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
//   onGenerateBillClick: PropTypes.func.isRequired,
// };

// export default AppointmentList;
