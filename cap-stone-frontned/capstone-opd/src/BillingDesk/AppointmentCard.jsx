import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, Box, Chip, Stack, styled } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const StyledCard = styled(Card)(({ theme, status }) => ({
  width: 480,
  height: 310,
  cursor: 'pointer',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderLeft: `5px solid ${status === 'Scheduled' ? theme.palette.success.main : theme.palette.warning.main}`,
  '&:hover': {
    boxShadow: theme.shadows[6],
    transform: 'translateY(-5px)',
  },
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Typography variant="body2" color="text.secondary">
      {label}: <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Typography>
  </Box>
);

const formatTime = (timeString) => {
  if (!timeString) return 'Not specified';
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime()) || (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0)) {
      return 'Not specified';
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Not specified';
  }
};

const AppointmentCard = ({ appointment, onClick }) => {
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    if (appointment.doctorId) {
      fetch(`http://localhost:2005/api/doctors/${appointment.doctorId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch doctor details');
          return res.json();
        })
        .then((data) => setDoctorName(`${data.firstName} ${data.lastName}`))
        .catch(() => setDoctorName('Unknown Doctor'));
    }
  }, [appointment.doctorId]);

  useEffect(() => {
    if (appointment.patientId) {
      fetch(`http://localhost:2008/api/patients/${appointment.patientId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch patient details');
          return res.json();
        })
        .then((data) => setPatientName(`${data.first_name} ${data.last_name}`))
        .catch(() => setPatientName('Unknown Patient'));
    }
  }, [appointment.patientId]);

  const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const appointmentTime = formatTime(appointment.appointmentTime);

  const statusColor = appointment.status === 'Scheduled' ? 'success' : 'warning';

  return (
    <StyledCard onClick={() => onClick(appointment)} status={appointment.status}>
      <CardContent>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Appointment APP{appointment.customId ?? appointment.id.slice(4,8)}
            </Typography>
            <Chip label={appointment.status} color={statusColor} size="small" sx={{ fontWeight: 'bold' }} />
          </Box>

          <Stack spacing={1}>
            <InfoItem icon={<PersonIcon color="action" fontSize="small" />} label="Patient" value={patientName || appointment.patientId} />
            <InfoItem icon={<MedicalInformationIcon color="action" fontSize="small" />} label="Doctor" value={doctorName || appointment.doctorId} />
            <InfoItem icon={<EventIcon color="action" fontSize="small" />} label="Date" value={appointmentDate} />
            <InfoItem icon={<AccessTimeIcon color="action" fontSize="small" />} label="Time" value={appointmentTime} />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Reason: {appointment.reasonForVisit || 'Not specified'}
          </Typography>
        </Stack>
      </CardContent>
      <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClick(appointment);
          }}
        >
          Generate Bill
        </Button>
      </Box>
    </StyledCard>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    customId: PropTypes.string,
    patientId: PropTypes.string.isRequired,
    doctorId: PropTypes.string.isRequired,
    appointmentDate: PropTypes.string.isRequired,
    appointmentTime: PropTypes.string,
    reasonForVisit: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AppointmentCard;
