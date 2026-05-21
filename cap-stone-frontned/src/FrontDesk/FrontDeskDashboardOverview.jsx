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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

const FrontDeskDashboardOverview = ({ frontDeskUser }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Util to parse date string and only keep date component (yyyy-mm-dd)
  const getDateOnly = (dateString) => (dateString ? new Date(dateString).toISOString().split("T")[0] : null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch patients
        const patientsRes = await fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients');
        if (!patientsRes.ok) throw new Error('Failed to fetch patients data');
        const patientsData = await patientsRes.json();

        // Fetch doctors
        const doctorsRes = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/all');
        if (!doctorsRes.ok) throw new Error('Failed to fetch doctors data');
        const doctorsData = await doctorsRes.json();

        // Fetch appointments
        const apptsRes = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments');
        if (!apptsRes.ok) throw new Error('Failed to fetch appointments data');
        const apptsData = await apptsRes.json();

        setPatients(patientsData);
        setDoctors(doctorsData);
        setAppointments(apptsData);

        // Build recent activities - combine:
        // - Most recent 3 appointments checked in or completed
        // - Most recent 3 patients registered
        // - Simulate payments processed from completed appointments (recent 2)

        // Sort patients by creation date descending
        const recentPatients = [...patientsData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .map(pat => ({
            id: `patient-${pat._id}`,
            text: `Registered new patient: ${pat.first_name} ${pat.last_name}`,
            time: new Date(pat.created_at).toLocaleString(),
          }));

        // Sort appointments by date descending for recent check-ins/completions
        const recentAppts = [...apptsData]
          .filter(appt => {
            // Consider only Completed or Checked-In for recent check-ins
            const status = appt.status?.toLowerCase() || '';
            return status === 'completed' || status === 'checked-in';
          })
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 3)
          .map(appt => {
            const patient = patientsData.find(p => p._id === appt.patientId);
            const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
            const doctor = doctorsData.find(d => d.id === appt.doctorId);
            const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
            return {
              id: `appt-${appt.id}`,
              text: `Checked in Patient: ${patientName} (Appt. with ${doctorName})`,
              time: new Date(appt.appointmentDate).toLocaleString(),
            };
          });

        // Simulate payments processed from recent completed appointments (last 2)
        const recentPayments = [...apptsData]
          .filter(appt => appt.status?.toLowerCase() === 'completed')
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 2)
          .map(appt => ({
            id: `payment-${appt.id}`,
            text: `Processed payment for Appointment #${appt.customId || appt.id}`,
            time: new Date(appt.updatedAt || appt.createdAt).toLocaleString(),
          }));

        // Combine all recent activities and sort by time descending
        const combinedActivities = [...recentPatients, ...recentAppts, ...recentPayments]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 6);

        setRecentActivities(combinedActivities);

      } catch (err) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  // Compute stats dynamically

  // Today’s date string yyyy-mm-dd to compare
  const todayStr = new Date().toISOString().split("T")[0];

  // Patients Checked In Today: appointments where appointmentDate == today and status is completed or checked-in
  const patientsCheckedInToday = appointments.filter(appt => {
    const apptDate = getDateOnly(appt.appointmentDate);
    const status = appt.status?.toLowerCase() || '';
    return apptDate === todayStr && (status === 'completed' || status === 'checked-in');
  }).length;

  // Upcoming Appointments: future appointments with status NOT completed or cancelled
  const nowDate = new Date();
  const upcomingAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.appointmentDate);
    const status = appt.status?.toLowerCase() || '';
    return apptDate >= nowDate && status !== 'completed' && status !== 'cancelled';
  }).length;

  // Pending Payments: appointments where status includes 'pending' or 'payment' (case-insensitive)
  const pendingPayments = appointments.filter(appt => {
    const status = appt.status?.toLowerCase() || '';
    return status.includes('pending') || status.includes('payment');
  }).length;

  // Average wait time (dummy example: 15 min) — replace with real calculation if available
  const averageWaitTime = '15 min';


  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }


  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }


  // Stats to display dynamically
  const stats = [
    { label: 'Patients Checked In Today', value: patientsCheckedInToday, icon: <PeopleIcon sx={{ fontSize: 48, color: '#1976d2' }} /> },
    { label: 'Upcoming Appointments', value: upcomingAppointments, icon: <EventAvailableIcon sx={{ fontSize: 48, color: '#388e3c' }} /> },
    { label: 'Pending Payments', value: pendingPayments, icon: <CurrencyRupeeIcon sx={{ fontSize: 48, color: '#d32f2f' }} /> },
    { label: 'Average Wait Time', value: averageWaitTime, icon: <AccessTimeIcon sx={{ fontSize: 48, color: '#fbc02d' }} /> },
  ];


  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 5, fontWeight: 900, color: '#0d47a1', letterSpacing: '0.12em' }}>
        Front Desk Dashboard Overview
      </Typography>

      <Grid container spacing={5} justifyContent="center">
        {stats.map(stat => (
          <Grid key={stat.label} item xs={12} sm={6} md={3}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 3,
                py: 4,
                px: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                boxShadow: '0 10px 25px rgba(21,101,192,0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 14px 32px rgba(21,101,192,0.25)' },
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              {stat.icon}
              <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold', color: '#0d47a1' }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#1976d2', mt: 1 }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>


      <Paper
        elevation={10}
        sx={{
          mt: 7,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff, #f0f4ff)',
          boxShadow: '0 16px 40px rgba(21,101,192,0.1)',
          border: '1px solid #dae6fc',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 700, color: '#0d47a1', letterSpacing: '0.05em', textAlign: 'center' }}>
          Recent Front Desk Activities
        </Typography>

        <List sx={{ maxHeight: 320, overflowY: 'auto' }}>
          {recentActivities.length > 0 ? recentActivities.map(activity => (
            <Box
              key={activity.id}
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: '1px solid #dde7f0',
                '&:last-child': { borderBottom: 'none', mb: 0 },
              }}
            >
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccessAlarmIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{activity.text}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{activity.time}</Typography>}
                />
              </ListItem>
            </Box>
          )) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              No recent activities.
            </Typography>
          )}
        </List>
      </Paper>

      <Box sx={{ mt: 7, opacity: 0.65, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          This overview provides a snapshot of key front desk operations and alerts.
        </Typography>
      </Box>
    </Box>
  );
};

FrontDeskDashboardOverview.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default FrontDeskDashboardOverview;
