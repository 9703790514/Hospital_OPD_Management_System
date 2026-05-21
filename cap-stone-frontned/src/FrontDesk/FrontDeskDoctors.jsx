import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InfoIcon from '@mui/icons-material/Info';

// Utility to generate a consistent color from a string for avatar background
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

const FrontDeskDoctors = ({ frontDeskUser, onNavigate }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorsAndImages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch the list of doctors
        const doctorsResponse = await fetch(`${import.meta.env.VITE_DOCTOR_SERVICE_URL}/api/doctors/all');
        if (!doctorsResponse.ok) {
          const errorText = await doctorsResponse.text();
          throw new Error(`Failed to fetch doctors list: ${doctorsResponse.status} - ${errorText}`);
        }
        const doctorsData = await doctorsResponse.json();

        if (doctorsData.length === 0) {
          setDoctors([]);
          setLoading(false);
          return;
        }

        // Step 2: For each doctor, fetch their profile image
        const doctorsWithImages = await Promise.all(
          doctorsData.map(async (doctor) => {
            let profilePicUrl = null;

            if (doctor.customId) {
              try {
                const imageResponse = await fetch(`http://localhost:2002/api/users/${doctor.customId}`);

                if (imageResponse.ok) {
                  // Check the Content-Type header to determine how to process the response
                  const contentType = imageResponse.headers.get('Content-Type');

                  if (contentType && contentType.includes('application/json')) {
                    // Scenario: The backend sends a JSON object with a Base64 string
                    const jsonResponse = await imageResponse.json();

                    // Assuming the Base64 string is in a key named "image"
                    const base64Image = jsonResponse.image;

                    if (base64Image) {
                      // Create a Blob from the Base64 string and generate an object URL
                      // We'll use a temporary data URL to fetch a blob, which is a common pattern
                      const imageBlobResponse = await fetch(`data:image/webp;base64,${base64Image}`);
                      if (imageBlobResponse.ok) {
                          const imageBlob = await imageBlobResponse.blob();
                          profilePicUrl = URL.createObjectURL(imageBlob);
                      } else {
                      }
                    } else {
                    }
                  } else if (contentType && contentType.startsWith('image/')) {
                    // Scenario: The backend sends raw image data (e.g., image/webp)
                    const imageBlob = await imageResponse.blob();
                    profilePicUrl = URL.createObjectURL(imageBlob);
                  } else {
                    // Scenario: The backend response is not an image and not a recognized JSON
                    profilePicUrl = null;
                  }

                } else {
                }
              } catch (imgError) {
                profilePicUrl = null;
              }
            } else {
              profilePicUrl = null;
            }
            return { ...doctor, profilePic: profilePicUrl };
          })
        );
        
        setDoctors(doctorsWithImages);
      } catch (err) {
        setError(err.message || "Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsAndImages();

    // Cleanup function to revoke object URLs and prevent memory leaks
    return () => {
      doctors.forEach(doctor => {
        if (doctor.profilePic) {
          URL.revokeObjectURL(doctor.profilePic);
        }
      });
    };
  }, []); // The empty dependency array ensures this effect runs once on mount

  const handleBookAppointment = (doctorId) => {
    if (onNavigate) {
      onNavigate(`book-appointment/${doctorId}`);
    } else {
    }
  };

  const handleViewDoctorDetails = (doctorId) => {
    if (onNavigate) {
      onNavigate(`doctor-details/${doctorId}`);
    } else {
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Doctor Management
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Hospital Doctors List
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Loading Doctors...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && doctors.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No doctors found.
          </Alert>
        )}

        {!loading && !error && doctors.length > 0 && (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <Card elevation={4} sx={{
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                  },
                  background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)',
                  border: '1px solid #d0e0f0',
                }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                    <Avatar
                      src={doctor.profilePic || undefined}
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      sx={{
                        width: 90,
                        height: 90,
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.08)' },
                      }}
                    >
                      {!doctor.profilePic && `${doctor.firstName ? doctor.firstName[0].toUpperCase() : ''}${doctor.lastName ? doctor.lastName[0].toUpperCase() : ''}`}
                    </Avatar>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.dark', fontSize: '1.3rem' }}>
                         {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '0.95rem' }}>
                      <WorkIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {doctor.specialization || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '0.95rem' }}>
                      <MedicalServicesIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {doctor.experience ? `${doctor.experience} years experience` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '0.95rem' }}>
                      <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {doctor.education || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '0.95rem' }}>
                      <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      Fee: {doctor.consultationFee ? `â‚¹${doctor.consultationFee}` : 'N/A'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '0.95rem' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {doctor.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {doctor.contactNumber || 'N/A'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      color="info"
                      startIcon={<InfoIcon />}
                      onClick={() => handleViewDoctorDetails(doctor.id)}
                      sx={{ borderRadius: 2, px: 3, py: 1, mr: 1,
                        borderColor: 'info.main',
                        color: 'info.main',
                        '&:hover': {
                          backgroundColor: 'info.light',
                          color: 'white',
                          borderColor: 'info.dark',
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      startIcon={<EventNoteIcon />}
                      onClick={() => handleBookAppointment(doctor.id)}
                      sx={{ borderRadius: 2, px: 3, py: 1,
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                          boxShadow: '0 5px 8px 3px rgba(25, 118, 210, .3)',
                        }
                      }}
                    >
                      Book Appointment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Efficiently manage all medical professionals within the system.
        </Typography>
      </Box>
    </Box>
  );
};

FrontDeskDoctors.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onNavigate: PropTypes.func.isRequired,
};

export default FrontDeskDoctors;
