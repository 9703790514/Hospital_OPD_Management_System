import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningIcon from '@mui/icons-material/Warning';

const NurseDashboardOverview = () => {
  // States to hold fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch patients
        const patientsRes = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients');
        if (!patientsRes.ok) throw new Error('Failed to fetch patients');
        const patientsData = await patientsRes.json();

        // Fetch appointments
        const apptsRes = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments');
        if (!apptsRes.ok) throw new Error('Failed to fetch appointments');
        const apptsData = await apptsRes.json();

        setPatients(patientsData);
        setAppointments(apptsData);

        // Build recent activities (simulate from appointments for now)
        const recentActs = apptsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((appt, idx) => {
            // Find patient name
            const patient = patientsData.find(p => p._id === appt.patientId);
            const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';

            // Text summarizing appointment and nursing action placeholder
            const text = idx % 2 === 0
              ? `Administered medication to ${patientName}`
              : `Updated vitals for ${patientName}`;

            // Time ago approximation (simple)
            const timeDiffMins = Math.floor((Date.now() - new Date(appt.createdAt)) / (1000 * 60));
            const timeStr = timeDiffMins < 60 ? `${timeDiffMins} mins ago` : `${Math.floor(timeDiffMins/60)} hour(s) ago`;

            return {
              id: appt.id || appt._id || idx,
              text,
              time: timeStr,
            };
          });

        setRecentActivities(recentActs);
      } catch (err) {
        setError(err.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute stats based on data

  // Patients assigned currently: count unique patient IDs in upcoming or ongoing appointments
  const now = new Date();
  const activeAppointments = appointments.filter(
    appt => new Date(appt.appointmentDate) >= now && appt.status?.toLowerCase() !== 'cancelled'
  );
  const assignedPatientIds = [...new Set(activeAppointments.map(appt => appt.patientId))];
  const assignedPatientsCount = assignedPatientIds.length;

  // Upcoming appointments count (future dates and not cancelled)
  const upcomingAppointmentsCount = activeAppointments.length;

  // Critical alerts count: count appointments with status 'critical' or notes mentioning 'critical' (case-insensitive)
  const criticalAlertsCount = appointments.filter(appt => {
    if (!appt.status && !appt.notes) return false;
    const statusLow = appt.status?.toLowerCase() || '';
    const notesLow = appt.notes?.toLowerCase() || '';
    return statusLow.includes('critical') || notesLow.includes('critical');
  }).length;

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

  const stats = [
    { label: 'Assigned Patients', value: assignedPatientsCount, icon: <PeopleIcon color="primary" sx={{ fontSize: 40 }} /> },
    { label: 'Upcoming Appointments', value: upcomingAppointmentsCount, icon: <EventAvailableIcon color="secondary" sx={{ fontSize: 40 }} /> },
    { label: 'Critical Alerts', value: criticalAlertsCount, icon: <WarningIcon color="error" sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Nurse Dashboard Overview
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
          Recent Activities
        </Typography>
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <Box key={activity.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none', mb: 0 } }}>
              <Typography variant="body1" color="text.primary">
                {activity.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">No recent activities.</Typography>
        )}
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          This overview provides a snapshot of key nursing responsibilities and alerts.
        </Typography>
      </Box>
    </Box>
  );
};

export default NurseDashboardOverview;
