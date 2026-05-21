import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const FrontDeskReports = ({ frontDeskUser }) => {
  // Static data for available reports
  const reportsList = [
    {
      id: 1,
      name: 'Daily Patient Flow Report',
      description: 'Overview of patient check-ins, appointments, and departures for the day.',
      icon: <GroupIcon color="primary" />,
    },
    {
      id: 2,
      name: 'Upcoming Appointments Summary',
      description: 'Detailed list of all confirmed and pending appointments for the next week.',
      icon: <EventNoteIcon color="secondary" />,
    },
    {
      id: 3,
      name: 'Daily Revenue Summary',
      description: 'Summary of payments received and outstanding balances for the current day.',
      icon: <AttachMoneyIcon color="success" />,
    },
    {
      id: 4,
      name: 'Patient Demographics Report',
      description: 'Analysis of patient age, gender, and geographical distribution.',
      icon: <BarChartIcon color="info" />,
    },
    {
      id: 5,
      name: 'Service Utilization Report',
      description: 'Insights into the most frequently availed services by patients.',
      icon: <TrendingUpIcon color="warning" />,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Operational Reports
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Available Reports
        </Typography>
        <List>
          {reportsList.map((report) => (
            <ListItem
              key={report.id}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#cfe8fc', cursor: 'pointer' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {report.icon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{report.name}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{report.description}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Access various reports on patient demographics, appointments, and revenue to support front desk operations.
        </Typography>
      </Box>
    </Box>
  );
};

FrontDeskReports.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default FrontDeskReports;
