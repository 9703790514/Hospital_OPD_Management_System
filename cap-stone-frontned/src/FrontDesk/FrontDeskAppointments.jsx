// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   CircularProgress, // Added for loading indicator
//   Alert, // Added for error/info messages
// } from '@mui/material';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; // Icon for room number
// import DescriptionIcon from '@mui/icons-material/Description'; // Icon for reason for visit

// const FrontDeskAppointments = ({ frontDeskUser }) => {
//   const [appointmentsData, setAppointmentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       setError(null);

//       console.log('Fetching appointments from http://localhost:2010/api/appointments');

//       try {
//         const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments');

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch appointments: ${response.status} - ${errorText}`);
//         }

//         const data = await response.json();
//         setAppointmentsData(data);
//         console.log("Appointments fetched successfully:", data);
//       } catch (err) {
//         console.error("Error fetching appointments:", err);
//         setError(err.message || "Failed to load appointments.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []); // Empty dependency array to fetch data once on component mount

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'success';
//       case 'Scheduled': return 'info'; // Assuming 'Scheduled' is also a valid status
//       case 'Pending': return 'warning';
//       case 'Cancelled': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Confirmed': return <CheckCircleIcon fontSize="small" />;
//       case 'Scheduled': return <EventAvailableIcon fontSize="small" />; // Using EventAvailableIcon for scheduled
//       case 'Pending': return <AccessTimeIcon fontSize="small" />;
//       case 'Cancelled': return <CancelIcon fontSize="small" />;
//       default: return null;
//     }
//   };

//   const handleScheduleAppointment = () => {
//     console.log('Schedule New Appointment clicked!');
//     // Implement logic to open a form for scheduling a new appointment
//   };

//   const handleEditAppointment = (appointmentId) => {
//     console.log(`Edit appointment ID: ${appointmentId}`);
//     // Implement logic to edit appointment details
//   };

//   const handleCancelAppointment = (appointmentId) => {
//     console.log(`Cancel appointment ID: ${appointmentId}`);
//     // Implement logic to cancel an appointment
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Appointments Scheduling
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             Upcoming Appointments
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleScheduleAppointment}
//             sx={{ py: 1, px: 2, fontWeight: 'bold', borderRadius: 2 }}
//           >
//             Schedule New Appointment
//           </Button>
//         </Box>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
//             <CircularProgress sx={{ mb: 2 }} />
//             <Typography variant="h6">Loading Appointments...</Typography>
//           </Box>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length === 0 && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             No appointments found.
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length > 0 && (
//           <TableContainer>
//             <Table sx={{ minWidth: 650 }} aria-label="appointments table">
//               <TableHead>
//                 <TableRow sx={{ bgcolor: '#e3f2fd' }}>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient ID</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Doctor ID</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Time</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Reason</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Room</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {appointmentsData.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
//                   >
//                     <TableCell><PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.patientId}</TableCell>
//                     <TableCell><LocalHospitalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.doctorId}</TableCell>
//                     <TableCell>{row.appointmentDate}</TableCell>
//                     <TableCell>{row.appointmentTime ? new Date(row.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
//                     <TableCell><DescriptionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.reasonForVisit || 'N/A'}</TableCell>
//                     <TableCell><MeetingRoomIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.roomNumber || 'N/A'}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={row.status || 'Unknown'}
//                         color={getStatusColor(row.status)}
//                         size="small"
//                         icon={getStatusIcon(row.status)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {row.status !== 'Cancelled' && (
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           startIcon={<EditIcon />}
//                           onClick={() => handleEditAppointment(row.id)}
//                           sx={{ mr: 1, borderRadius: 2 }}
//                         >
//                           Edit
//                         </Button>
//                       )}
//                       {row.status !== 'Cancelled' && (
//                         <Button
//                           variant="contained"
//                           size="small"
//                           color="error"
//                           startIcon={<CancelIcon />}
//                           onClick={() => handleCancelAppointment(row.id)}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Cancel
//                         </Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Schedule, reschedule, and manage patient appointments efficiently.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskAppointments.propTypes = {
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default FrontDeskAppointments;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
// import DescriptionIcon from '@mui/icons-material/Description';

// const FrontDeskAppointments = ({ frontDeskUser }) => {
//   const [appointmentsData, setAppointmentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Maps for id -> name lookup
//   const [patientNames, setPatientNames] = useState({});
//   const [doctorNames, setDoctorNames] = useState({});

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments');
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch appointments: ${response.status} - ${errorText}`);
//         }
//         const data = await response.json();
//         setAppointmentsData(data);

//         // Extract unique patient and doctor IDs
//         const patientIds = [...new Set(data.map((appt) => appt.patientId))];
//         const doctorIds = [...new Set(data.map((appt) => appt.doctorId))];

//         // Fetch patient names
//         const fetchPatientNames = async () => {
//           const map = {};
//           await Promise.all(patientIds.map(async (id) => {
//             try {
//               const res = await fetch(`http://localhost:2008/api/patients/${id}`);
//               if (res.ok) {
//                 const patientData = await res.json();
//                 // Assuming response has first_name, last_name fields
//                 if (patientData.first_name && patientData.last_name) {
//                   map[id] = `${patientData.first_name} ${patientData.last_name}`;
//                 } else {
//                   // Fallback to just id
//                   map[id] = id;
//                 }
//               } else {
//                 map[id] = id; // fallback if error
//               }
//             } catch {
//               map[id] = id;
//             }
//           }));
//           setPatientNames(map);
//         };

//         // Fetch doctor names
//         const fetchDoctorNames = async () => {
//           const map = {};
//           await Promise.all(doctorIds.map(async (id) => {
//             try {
//               const res = await fetch(`http://localhost:2005/api/doctors/${id}`);
//               if (res.ok) {
//                 const doctorData = await res.json();
//                 // Assuming response has firstName and lastName fields
//                 if (doctorData.firstName && doctorData.lastName) {
//                   map[id] = `Dr. ${doctorData.firstName} ${doctorData.lastName}`;
//                 } else {
//                   map[id] = id;
//                 }
//               } else {
//                 map[id] = id;
//               }
//             } catch {
//               map[id] = id;
//             }
//           }));
//           setDoctorNames(map);
//         };

//         await Promise.all([fetchPatientNames(), fetchDoctorNames()]);
//       } catch (err) {
//         setError(err.message || 'Failed to load appointments.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'success';
//       case 'Scheduled': return 'info';
//       case 'Pending': return 'warning';
//       case 'Cancelled': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Confirmed': return <CheckCircleIcon fontSize="small" />;
//       case 'Scheduled': return <EventAvailableIcon fontSize="small" />;
//       case 'Pending': return <AccessTimeIcon fontSize="small" />;
//       case 'Cancelled': return <CancelIcon fontSize="small" />;
//       default: return null;
//     }
//   };

//   const handleScheduleAppointment = () => {
//     console.log('Schedule New Appointment clicked!');
//     // Implement logic to open a form for scheduling a new appointment
//   };

//   const handleEditAppointment = (appointmentId) => {
//     console.log(`Edit appointment ID: ${appointmentId}`);
//     // Implement logic to edit appointment details
//   };

//   const handleCancelAppointment = (appointmentId) => {
//     console.log(`Cancel appointment ID: ${appointmentId}`);
//     // Implement logic to cancel an appointment
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Appointments Scheduling
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             Upcoming Appointments
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleScheduleAppointment}
//             sx={{ py: 1, px: 2, fontWeight: 'bold', borderRadius: 2 }}
//           >
//             Schedule New Appointment
//           </Button>
//         </Box>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
//             <CircularProgress sx={{ mb: 2 }} />
//             <Typography variant="h6">Loading Appointments...</Typography>
//           </Box>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length === 0 && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             No appointments found.
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length > 0 && (
//           <TableContainer>
//             <Table sx={{ minWidth: 650 }} aria-label="appointments table">
//               <TableHead>
//                 <TableRow sx={{ bgcolor: '#e3f2fd' }}>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Doctor</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Time</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Reason</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Room</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {appointmentsData.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
//                   >
//                     <TableCell>
//                       <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {patientNames[row.patientId] || row.patientId}
//                     </TableCell>
//                     <TableCell>
//                       <LocalHospitalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {doctorNames[row.doctorId] || row.doctorId}
//                     </TableCell>
//                     <TableCell>{row.appointmentDate}</TableCell>
//                     <TableCell>{row.appointmentTime ? new Date(row.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
//                     <TableCell>
//                       <DescriptionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {row.reasonForVisit || 'N/A'}
//                     </TableCell>
//                     <TableCell>
//                       <MeetingRoomIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {row.roomNumber || 'N/A'}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={row.status || 'Unknown'}
//                         color={getStatusColor(row.status)}
//                         size="small"
//                         icon={getStatusIcon(row.status)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {row.status !== 'Cancelled' && (
//                         <>
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             startIcon={<EditIcon />}
//                             onClick={() => handleEditAppointment(row.id)}
//                             sx={{ mr: 1, borderRadius: 2 }}
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="contained"
//                             size="small"
//                             color="error"
//                             startIcon={<CancelIcon />}
//                             onClick={() => handleCancelAppointment(row.id)}
//                             sx={{ borderRadius: 2 }}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Schedule, reschedule, and manage patient appointments efficiently.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskAppointments.propTypes = {
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default FrontDeskAppointments;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// import AddIcon from '@mui/icons-material/Add';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
// import DescriptionIcon from '@mui/icons-material/Description';

// const FrontDeskAppointments = ({ frontDeskUser }) => {
//   const [appointmentsData, setAppointmentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Maps for id -> name lookup
//   const [patientNames, setPatientNames] = useState({});
//   const [doctorNames, setDoctorNames] = useState({});

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments');
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch appointments: ${response.status} - ${errorText}`);
//         }
//         const data = await response.json();
//         setAppointmentsData(data);

//         // Extract unique patient and doctor IDs
//         const patientIds = [...new Set(data.map((appt) => appt.patientId))];
//         const doctorIds = [...new Set(data.map((appt) => appt.doctorId))];

//         // Fetch patient names
//         const fetchPatientNames = async () => {
//           const map = {};
//           await Promise.all(patientIds.map(async (id) => {
//             try {
//               const res = await fetch(`http://localhost:2008/api/patients/${id}`);
//               if (res.ok) {
//                 const patientData = await res.json();
//                 // Assuming response has first_name, last_name fields
//                 if (patientData.first_name && patientData.last_name) {
//                   map[id] = `${patientData.first_name} ${patientData.last_name}`;
//                 } else {
//                   // Fallback to just id
//                   map[id] = id;
//                 }
//               } else {
//                 map[id] = id; // fallback if error
//               }
//             } catch {
//               map[id] = id;
//             }
//           }));
//           setPatientNames(map);
//         };

//         // Fetch doctor names
//         const fetchDoctorNames = async () => {
//           const map = {};
//           await Promise.all(doctorIds.map(async (id) => {
//             try {
//               const res = await fetch(`http://localhost:2005/api/doctors/${id}`);
//               if (res.ok) {
//                 const doctorData = await res.json();
//                 // Assuming response has firstName and lastName fields
//                 if (doctorData.firstName && doctorData.lastName) {
//                   map[id] = `Dr. ${doctorData.firstName} ${doctorData.lastName}`;
//                 } else {
//                   map[id] = id;
//                 }
//               } else {
//                 map[id] = id;
//               }
//             } catch {
//               map[id] = id;
//             }
//           }));
//           setDoctorNames(map);
//         };

//         await Promise.all([fetchPatientNames(), fetchDoctorNames()]);
//       } catch (err) {
//         setError(err.message || 'Failed to load appointments.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'success';
//       case 'Scheduled': return 'info';
//       case 'Pending': return 'warning';
//       case 'Cancelled': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Confirmed': return <CheckCircleIcon fontSize="small" />;
//       case 'Scheduled': return <EventAvailableIcon fontSize="small" />;
//       case 'Pending': return <AccessTimeIcon fontSize="small" />;
//       case 'Cancelled': return <CancelIcon fontSize="small" />;
//       default: return null;
//     }
//   };

//   const handleScheduleAppointment = () => {
//     console.log('Schedule New Appointment clicked!');
//     // Implement logic to open a form for scheduling a new appointment
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Appointments Scheduling
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             Upcoming Appointments
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleScheduleAppointment}
//             sx={{ py: 1, px: 2, fontWeight: 'bold', borderRadius: 2 }}
//           >
//             Schedule New Appointment
//           </Button>
//         </Box>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
//             <CircularProgress sx={{ mb: 2 }} />
//             <Typography variant="h6">Loading Appointments...</Typography>
//           </Box>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length === 0 && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             No appointments found.
//           </Alert>
//         )}

//         {!loading && !error && appointmentsData.length > 0 && (
//           <TableContainer>
//             <Table sx={{ minWidth: 650 }} aria-label="appointments table">
//               <TableHead>
//                 <TableRow sx={{ bgcolor: '#e3f2fd' }}>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Doctor</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Time</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Reason</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Room</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {appointmentsData.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
//                   >
//                     <TableCell>
//                       <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {patientNames[row.patientId] || row.patientId}
//                     </TableCell>
//                     <TableCell>
//                       <LocalHospitalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {doctorNames[row.doctorId] || row.doctorId}
//                     </TableCell>
//                     <TableCell>{row.appointmentDate}</TableCell>
//                     <TableCell>{row.appointmentTime ? new Date(row.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
//                     <TableCell>
//                       <DescriptionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {row.reasonForVisit || 'N/A'}
//                     </TableCell>
//                     <TableCell>
//                       <MeetingRoomIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//                       {row.roomNumber || 'N/A'}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={row.status || 'Unknown'}
//                         color={getStatusColor(row.status)}
//                         size="small"
//                         icon={getStatusIcon(row.status)}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Schedule, reschedule, and manage patient appointments efficiently.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskAppointments.propTypes = {
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default FrontDeskAppointments;
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';

const FrontDeskAppointments = ({ frontDeskUser }) => {
  const theme = useTheme();
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('appointmentDate');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Maps for id -> name lookup
  const [patientNames, setPatientNames] = useState({});
  const [doctorNames, setDoctorNames] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to fetch appointments: ' + response.status + ' - ' + errorText);
        }
        const data = await response.json();
        setAppointmentsData(data);

        // Extract unique patient and doctor IDs
        const patientIds = [...new Set(data.map((appt) => appt.patientId))];
        const doctorIds = [...new Set(data.map((appt) => appt.doctorId))];

        // Fetch patient names
        const fetchPatientNames = async () => {
          const map = {};
          await Promise.all(patientIds.map(async (id) => {
            try {
              const res = await fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + id);
              if (res.ok) {
                const patientData = await res.json();
                if (patientData.first_name && patientData.last_name) {
                  map[id] = patientData.first_name + ' ' + patientData.last_name;
                } else {
                  map[id] = id;
                }
              } else {
                map[id] = id; // fallback if error
              }
            } catch {
              map[id] = id;
            }
          }));
          setPatientNames(map);
        };

        // Fetch doctor names
        const fetchDoctorNames = async () => {
          const map = {};
          await Promise.all(doctorIds.map(async (id) => {
            try {
              const res = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + id);
              if (res.ok) {
                const doctorData = await res.json();
                // Use the example data structure provided by the user
                if (doctorData.firstName && doctorData.lastName) {
                  map[id] = 'Dr. ' + doctorData.firstName + ' ' + doctorData.lastName;
                } else {
                  map[id] = id;
                }
              } else {
                map[id] = id;
              }
            } catch {
              map[id] = id;
            }
          }));
          setDoctorNames(map);
        };

        await Promise.all([fetchPatientNames(), fetchDoctorNames()]);
      } catch (err) {
        setError(err.message || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Scheduled': return 'info';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <CheckCircleIcon fontSize="small" />;
      case 'Scheduled': return <EventAvailableIcon fontSize="small" />;
      case 'Pending': return <AccessTimeIcon fontSize="small" />;
      case 'Cancelled': return <CancelIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Memoized function for filtering and sorting appointments
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointmentsData.filter(appt => {
      const patientName = patientNames[appt.patientId]?.toLowerCase() || '';
      const doctorName = doctorNames[appt.doctorId]?.toLowerCase() || '';
      const reason = appt.reasonForVisit?.toLowerCase() || '';
      const term = searchTerm.toLowerCase();

      return (
        patientName.includes(term) ||
        doctorName.includes(term) ||
        reason.includes(term)
      );
    });

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        let aValue, bValue;

        // Custom sorting logic for different fields
        switch (sortField) {
          case 'patient':
            aValue = patientNames[a.patientId] || '';
            bValue = patientNames[b.patientId] || '';
            break;
          case 'doctor':
            aValue = doctorNames[a.doctorId] || '';
            bValue = doctorNames[b.doctorId] || '';
            break;
          default: // 'appointmentDate', 'appointmentTime'
            aValue = a[sortField];
            bValue = b[sortField];
            break;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [appointmentsData, searchTerm, sortField, sortOrder, patientNames, doctorNames]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        <EventAvailableIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'bottom' }} /> Appointments Scheduling
      </Typography>

      <Paper elevation={8} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: theme.palette.background.paper, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Scheduled Appointments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
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
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="sort-field-label">Sort By</InputLabel>
              <Select
                labelId="sort-field-label"
                value={sortField}
                label="Sort By"
                onChange={(e) => setSortField(e.target.value)}
              >
                <MenuItem value="appointmentDate">Date</MenuItem>
                <MenuItem value="appointmentTime">Time</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} size="small" sx={{ alignSelf: 'center', height: 'fit-content' }}>
              {sortOrder === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Loading Appointments...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && filteredAndSortedAppointments.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No appointments found.
          </Alert>
        )}

        {!loading && !error && filteredAndSortedAppointments.length > 0 && (
          <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 650 }} aria-label="appointments table">
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell onClick={() => handleSort('patient')} sx={{ fontWeight: 'bold', color: 'primary.contrastText', cursor: 'pointer' }}>Patient</TableCell>
                  <TableCell onClick={() => handleSort('doctor')} sx={{ fontWeight: 'bold', color: 'primary.contrastText', cursor: 'pointer' }}>Doctor</TableCell>
                  <TableCell onClick={() => handleSort('appointmentDate')} sx={{ fontWeight: 'bold', color: 'primary.contrastText', cursor: 'pointer' }}>Date</TableCell>
                  <TableCell onClick={() => handleSort('appointmentTime')} sx={{ fontWeight: 'bold', color: 'primary.contrastText', cursor: 'pointer' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Room</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedAppointments.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                      '&:hover': { backgroundColor: theme.palette.action.selected },
                    }}
                  >
                    <TableCell>
                      <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {patientNames[row.patientId] || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <LocalHospitalIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {doctorNames[row.doctorId] || 'N/A'}
                    </TableCell>
                    <TableCell>{row.appointmentDate}</TableCell>
                    <TableCell>{row.appointmentTime ? new Date(`1970-01-01T${row.appointmentTime}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</TableCell>
                    <TableCell>
                      <DescriptionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {row.reasonForVisit || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <MeetingRoomIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {row.roomNumber || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || 'Unknown'}
                        color={getStatusColor(row.status)}
                        size="small"
                        icon={getStatusIcon(row.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

FrontDeskAppointments.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default FrontDeskAppointments;

