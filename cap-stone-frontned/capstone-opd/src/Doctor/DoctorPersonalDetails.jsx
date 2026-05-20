import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Divider, CircularProgress, Alert,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Avatar
} from '@mui/material';
import {
  ContactMail as ContactMailIcon,
  LocalHospital as LocalHospitalIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const DoctorPersonalDetails = ({ doctorUser }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    const customId = doctorUser?.userId;
    if (!customId) {
      setError('No user ID found to fetch details.');
      setLoading(false);
      return;
    }

    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2005/api/doctors/customId/${customId}`);
        if (!response.ok) throw new Error('Failed to fetch doctor details');
        const data = await response.json();
        setDoctorDetails(data);
        setFormState(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorUser?.userId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:2005/api/doctors/${formState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error('Failed to update doctor details');
      const updatedDoctor = await response.json();
      setDoctorDetails(updatedDoctor);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{`Error: ${error}`}</Alert>
      </Box>
    );
  }

  if (!doctorDetails) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">No doctor details found.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(to right, #f0f4f8, #d9e4ec)',
        minHeight: '100vh'
      }}
    >
      {/* Main container with soft glass effect */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 1300,
          m: 'auto',
          borderRadius: 6,
          background: 'linear-gradient(145deg, #ffffffaa, #f7f9fcaa)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        {/* Profile */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
            }}
          >
            {doctorDetails.firstName?.[0]}{doctorDetails.lastName?.[0]}
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
             {doctorDetails.firstName} {doctorDetails.lastName}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {doctorDetails.specialization}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Section title */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Professional and Contact Information
        </Typography>

        {/* Cards grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 3,
            mt: 3,
          }}
        >
          {[
            { icon: <ContactMailIcon color="primary" />, label: 'Email Address', value: doctorDetails.email },
            { icon: <LocalHospitalIcon color="primary" />, label: 'Contact Number', value: doctorDetails.contactNumber },
            { icon: <BadgeIcon color="primary" />, label: 'License Number', value: doctorDetails.licenseNumber },
            { icon: <WorkIcon color="primary" />, label: 'Experience', value: `${doctorDetails.experience} years` },
            { icon: <SchoolIcon color="primary" />, label: 'Education', value: doctorDetails.education },
            { icon: <AttachMoneyIcon color="primary" />, label: 'Consultation Fee', value: `â‚¹${doctorDetails.consultationFee}` },
          ].map((item, i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease, background 0.4s ease',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  border: '1px solid transparent',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1)) padding-box,
                               linear-gradient(135deg, #42a5f5, #ab47bc) border-box`,
                },
              }}
            >
              {item.icon}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Update button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleOpen}
            sx={{ px: 3, py: 1.2, fontSize: '1rem', borderRadius: '8px' }}
          >
            Update Details
          </Button>
        </Box>
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Update Doctor Details</DialogTitle>
        <DialogContent dividers>
          {['firstName', 'lastName', 'email', 'contactNumber', 'education', 'consultationFee'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.replace(/([A-Z])/g, ' $1')}
              type={field === 'consultationFee' ? 'number' : 'text'}
              fullWidth
              variant="outlined"
              value={formState?.[field] || ''}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

DoctorPersonalDetails.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }).isRequired,
};

export default DoctorPersonalDetails;
