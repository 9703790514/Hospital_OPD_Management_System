import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#7636ff' },
    secondary: { main: '#ff9800' },
    background: { default: '#f4f8fb', paper: '#fff' },
  },
  typography: {
    fontFamily: 'Inter,"Segoe UI",sans-serif',
    h4: { fontWeight: 900, letterSpacing: -1 },
    body1: { fontSize: '1rem' },
    subtitle2: { color: '#888' }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          background:
            'linear-gradient(140deg,rgba(255,255,255,0.85) 65%,rgba(220,230,255,0.75))',
          boxShadow: '0 12px 32px 0 rgba(76,63,224,0.08)',
          backdropFilter: 'blur(7px)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 700,
          letterSpacing: '.01em',
          padding: '12px 36px',
          background: 'linear-gradient(90deg,#7636ff 10%,#4f8dfd 100%)',
          color: '#fff',
          boxShadow: '0 4px 24px 0 rgba(118,54,255,0.12)',
          transition: 'transform .15s',
          '&:hover': {
            background: 'linear-gradient(90deg,#4f8dfd 10%,#7636ff 100%)',
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 12px 32px 0 rgba(76,63,224,0.19)',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255,255,255,0.96)',
        }
      }
    }
  }
});

const EditProfilePage = ({ patient, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    currentMedications: '',
  });

  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:2008/api/patients/user/${patient.userId}`);
        if (!response.ok) throw new Error('Failed to fetch patient data.');
        const data = await response.json();
        const patientData = data[0];
        if (!patientData) throw new Error('Patient data not found.');
        setPatientId(patientData._id);
        setFormData({
          name: `${patientData.first_name} ${patientData.last_name}`,
          phoneNumber: patientData.contact_number,
          dateOfBirth: patientData.date_of_birth,
          gender: patientData.gender,
          address: patientData.address,
          bloodGroup: patientData.blood_group,
          allergies: patientData.allergies,
          currentMedications: patientData.current_medications,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (patient && patient.userId) fetchPatientData();
    else setLoading(false);
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      setSnackbar({ open: true, message: 'Error: Patient ID is missing.', severity: 'error' });
      return;
    }
    const [first_name, ...last_name_parts] = formData.name.split(' ');
    const last_name = last_name_parts.join(' ');
    const payload = {
      _id: patientId,
      user_id: patient.userId,
      first_name,
      last_name,
      contact_number: formData.phoneNumber,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      blood_group: formData.bloodGroup,
      allergies: formData.allergies,
      current_medications: formData.currentMedications,
    };
    try {
      const response = await fetch(`http://localhost:2008/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update patient profile.');
      const updatedPatient = await response.json();
      onSave(updatedPatient);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 60% 0%,#d1c4e9 0,#f4f8fb 80%)'
        }}>
          <CircularProgress color="primary" size={70} thickness={5} sx={{ mb: 3 }} />
          <Typography variant="h6" color="primary">Loading profile...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          minHeight: '100vh', py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'radial-gradient(circle at 70% 20%,#ffd6d7 0,#f4f8fb 70%)'
        }}>
          <Paper elevation={8} sx={{ p: 6, minWidth: 340, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 750, color: theme.palette.primary.main, mb: 2 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
            <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }} startIcon={<ArrowBackIcon />}>
              Back
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f4f8fb 0%, #e3e6f6 80%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        {/* 🔹 Max width now 100% */}
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
  <Button
    variant="text"
    startIcon={<ArrowBackIcon />}
    onClick={onBack}
    sx={{
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '1.05rem',
      textTransform: 'none',
    }}
  >
    Back to Dashboard
  </Button>
</Box>

          <Paper elevation={10} sx={{ p: { xs: 2, sm: 5 }, position: 'relative', width: '100%' }}>
            <Box sx={{ mt: -7, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{
                background: 'linear-gradient(145deg, #7636ff 50%, #ff9800 150%)',
                borderRadius: '50%', boxShadow: '0 8px 32px 0 rgba(118,54,255,0.18)',
                width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '4px solid #fff',
              }}>
                <PersonIcon sx={{ color: '#fff', fontSize: 54 }} />
              </Box>
            </Box>
            <Typography variant="h4" align="center" gutterBottom sx={{
              background: 'linear-gradient(90deg, #7636ff 30%, #ff9800)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent',
              fontWeight: 900, mb: 1, letterSpacing: -1
            }}>
              Edit Profile
            </Typography>
            <Typography variant="subtitle2" align="center" sx={{ color: '#9e9aaf', mb: 2 }} gutterBottom>
              Update your personal & medical information.
            </Typography>
            <Divider sx={{ mb: 3, mt: 1 }} />

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Full Name" name="name"
                    value={formData.name} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" name="phoneNumber" type="tel"
                    value={formData.phoneNumber} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date"
                    value={formData.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><CakeIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }}>Medical Info</Divider>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Address" name="address"
                    value={formData.address} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><HomeIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Blood Group" name="bloodGroup"
                    value={formData.bloodGroup} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><BloodtypeIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Allergies" name="allergies"
                    value={formData.allergies} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LocalHospitalIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Current Medications" name="currentMedications"
                    value={formData.currentMedications} onChange={handleChange}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LocalHospitalIcon color="disabled" /></InputAdornment>) }} />
                </Grid>
              </Grid>

              <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" type="submit" size="large">
                  Save Changes
                </Button>
              </Box>
            </form>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

EditProfilePage.propTypes = {
  patient: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditProfilePage;
