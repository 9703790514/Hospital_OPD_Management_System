import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Fade,
  Zoom,
  LinearProgress,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Correct import for CssBaseline
import { styled } from '@mui/system';

// Define a custom Material-UI theme for this page with a modern, clean aesthetic
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 900, fontSize: '3rem', letterSpacing: '-0.05em' },
    h6: { fontWeight: 700, fontSize: '1.4rem' },
    body1: { fontSize: '1.05rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
  },
  palette: {
    primary: { main: '#4361ee', light: '#7b95ff', dark: '#2e499d' },
    secondary: { main: '#ffb703', light: '#ffd15c', dark: '#d99700' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#212121', secondary: '#616161' },
    success: { main: '#2a9d8f' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 45px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&.Mui-focused fieldset': {
              borderColor: '#4361ee',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#616161',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
});

// Styled component for a more visually prominent header
const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  letterSpacing: '-0.05em',
  color: theme.palette.primary.dark,
  textShadow: '2px 2px 4px rgba(0,0,0,0.08)',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
  },
}));

// Main Contact Page Component
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' }); // Clear form
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <StyledHeader variant="h4" component="h1" gutterBottom>
              Get in Touch
            </StyledHeader>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}
            >
              We are here to answer your questions, schedule appointments, and provide the support you need. Feel free to reach out to us through the form below or via our direct contact information.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, width: '100%' }}>
          {/* Left side: Contact info card */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1500}>
              <Paper
                elevation={8}
                sx={{
                  p: { xs: 3, md: 5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  background: 'linear-gradient(135deg, #4361ee, #7b95ff)',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>
                    <PhoneIcon sx={{ color: 'primary.contrastText' }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'white' }}>+91 98458 88005</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>
                    <EmailIcon sx={{ color: 'primary.contrastText' }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'white' }}>info@sarvothams.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <IconButton sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>
                    <LocationOnIcon sx={{ color: 'primary.contrastText' }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'white', maxWidth: 250 }}>
                    1/1, Prima Rohan Apartment, 2nd Floor, Assaye Road, Bangalore - 560042
                  </Typography>
                </Box>

                {/* Google Map Embed */}
                <Box sx={{ mt: 4, borderRadius: 2, overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.893158017387!2d77.61869811484177!3d12.971169390847996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1684c7a5f0b5%3A0x6b8a8b1d7d0a2d2a!2sSarvotham's%20Spine%20Care%20Assaye%20Road!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sarvotham's Spine Care Location"
                  ></iframe>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Right side: Contact form */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={1500}>
              <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, height: '100%' }}>
                {submitted ? (
                  <Zoom in={submitted} timeout={500}>
                    <Box sx={{ textAlign: 'center', py: 5, color: 'success.main' }}>
                      <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Thank You!
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Your message has been received. We will get back to you shortly.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSubmitted(false)}
                        sx={{ mt: 3 }}
                      >
                        Send Another Message
                      </Button>
                    </Box>
                  </Zoom>
                ) : (
                  <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.dark' }}>
                      Send Us a Message
                    </Typography>
                    {loading && <LinearProgress color="primary" sx={{ mb: 3 }} />}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          value={formData.name}
                          onChange={handleChange('name')}
                          margin="normal"
                          required
                          disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange('email')}
                          margin="normal"
                          required
                          disabled={loading}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Your Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange('message')}
                      margin="normal"
                      required
                      disabled={loading}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      sx={{ mt: 3 }}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 8, textAlign: 'center', color: 'text.secondary', maxWidth: 700 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Our team is available during business hours to assist you. For urgent medical concerns, please contact us directly by phone.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ContactPage;
