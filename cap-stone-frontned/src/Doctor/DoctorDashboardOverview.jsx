// import React from 'react';
// import PropTypes from 'prop-types';
// import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
// import GroupIcon from '@mui/icons-material/Group';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// const DoctorDashboardOverview = ({ doctorUser }) => {
//   // Static data for demonstration
//   const stats = [
//     { label: 'Total Patients', value: 150, icon: <GroupIcon color="primary" sx={{ fontSize: 40 }} /> },
//     { label: 'Appointments Today', value: 8, icon: <EventNoteIcon color="secondary" sx={{ fontSize: 40 }} /> },
//     { label: 'New Medical Records', value: 3, icon: <MedicalInformationIcon color="info" sx={{ fontSize: 40 }} /> },
//     { label: 'Upcoming Surgeries', value: 2, icon: <CalendarTodayIcon color="error" sx={{ fontSize: 40 }} /> },
//   ];

//   const recentActivities = [
//     { id: 1, text: 'Consultation with Patient: John Doe', time: '15 mins ago' },
//     { id: 2, text: 'Updated medical record for Patient: Jane Smith', time: '45 mins ago' },
//     { id: 3, text: 'Prescribed medication for Patient: Robert Johnson', time: '2 hours ago' },
//     { id: 4, text: 'Reviewed lab results for Patient: Alice Wonderland', time: '3 hours ago' },
//   ];

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Doctor Dashboard Overview
//       </Typography>

//       <Grid container spacing={4} justifyContent="center">
//         {stats.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card elevation={6} sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(145deg, #f0f2f5, #ffffff)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//               <CardContent>
//                 {stat.icon}
//                 <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: 'text.primary' }}>
//                   {stat.value}
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   {stat.label}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Paper elevation={6} sx={{ mt: 6, p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
//           Recent Activities
//         </Typography>
//         {recentActivities.length > 0 ? (
//           recentActivities.map((activity) => (
//             <Box key={activity.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none', mb: 0 } }}>
//               <Typography variant="body1" color="text.primary">
//                 {activity.text}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {activity.time}
//               </Typography>
//             </Box>
//           ))
//         ) : (
//           <Typography variant="body1" color="text.secondary">No recent activities.</Typography>
//         )}
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           This overview provides a snapshot of your daily schedule, patient load, and key metrics.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// DoctorDashboardOverview.propTypes = {
//   doctorUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// export default DoctorDashboardOverview;
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Assume a base URL for your appointment service
const API_BASE_URL = import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments';

const DoctorDashboardOverview = ({ doctorUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A function to fetch appointments from the backend
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // For a real application, you would pass a doctorId to filter appointments.
      // For now, we fetch all appointments.
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments. Please check the network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter and process the data to get dashboard statistics
  const today = new Date().toDateString();
  const appointmentsToday = appointments.filter(
    (appt) => new Date(appt.appointmentDate).toDateString() === today
  ).length;

  const totalPatients = new Set(appointments.map((appt) => appt.patientId)).size;

  const upcomingAppointments = appointments.filter(
    (appt) => new Date(appt.appointmentDate) > new Date()
  ).length;
  
  // Sort appointments by date to get recent activities
  const recentActivities = [...appointments]
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 5); // Show the 5 most recent appointments

  const stats = [
    { label: 'Total Patients', value: totalPatients, icon: <GroupIcon color="primary" sx={{ fontSize: 40 }} /> },
    { label: 'Appointments Today', value: appointmentsToday, icon: <EventNoteIcon color="secondary" sx={{ fontSize: 40 }} /> },
    { label: 'Total Appointments', value: appointments.length, icon: <CalendarMonthIcon color="info" sx={{ fontSize: 40 }} /> },
    { label: 'Upcoming Appointments', value: upcomingAppointments, icon: <AccessTimeIcon color="error" sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Doctor Dashboard Overview
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Dashboard Data...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={6} sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(145deg, #f0f2f5, #ffffff)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    {stat.icon}
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: 'text.primary' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={6} sx={{ mt: 6, p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Recent Appointments
            </Typography>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <Box key={activity.id || index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none', mb: 0 } }}>
                  <Typography variant="body1" color="text.primary">
                    Appointment for Patient ID: {activity.patientId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Status: {activity.status || 'N/A'} - Date: {new Date(activity.appointmentDate).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">No recent activities.</Typography>
            )}
          </Paper>
        </>
      )}
      
      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          This overview provides a snapshot of your daily schedule, patient load, and key metrics.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorDashboardOverview.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorDashboardOverview;
