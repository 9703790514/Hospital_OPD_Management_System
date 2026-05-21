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
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/system';
import { useMediaQuery } from '@mui/material';

// Custom MUI theme with a fresh, modern look
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.05em' },
    h6: { fontWeight: 700, fontSize: '1.4rem' },
    body1: { fontSize: '1.05rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
  },
  palette: {
    primary: { main: '#005b96', light: '#007bb2', dark: '#003e6b' },
    secondary: { main: '#ffc857', light: '#ffde8a', dark: '#d9a74a' },
    background: { default: '#f0f2f5', paper: '#ffffff' },
    text: { primary: '#263238', secondary: '#546e7a' },
    success: { main: '#4caf50' },
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
            transition: 'border-color 0.3s',
            '&.Mui-focused fieldset': {
              borderColor: '#005b96',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#546e7a',
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

// Styled header with a dynamic underline accent
const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
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
    height: 6,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 3,
  },
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle form input changes
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Handle form submit with simulated API call
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
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
          width : "100%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
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
          {/* Left side: Contact info */}
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  color: 'white', // Explicit white text for visibility
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                  Contact Information
                </Typography>

                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{ bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}
                    aria-label="phone"
                  >
                    <PhoneIcon sx={{ color: theme.palette.primary.dark }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'blue' }}>
                    +91 98458 88005
                  </Typography>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{ bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}
                    aria-label="email"
                  >
                    <EmailIcon sx={{ color: theme.palette.primary.dark }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'blue' }}>
                    info@sarvothams.com
                  </Typography>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <IconButton
                    sx={{ bgcolor: theme.palette.secondary.main, '&:hover': { bgcolor: theme.palette.secondary.dark } }}
                    aria-label="location"
                  >
                    <LocationOnIcon sx={{ color: theme.palette.primary.dark }} />
                  </IconButton>
                  <Typography variant="body1" sx={{ color: 'blue', maxWidth: 250 }}>
                    1/1, Prima Rohan Apartment, 2nd Floor, Assaye Road, Bangalore - 560042
                  </Typography>
                </Box>

                {/* Google Maps Embed */}
                <Box
                  sx={{
                    mt: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: '100%',
                    aspectRatio: isMobile ? '1 / 1' : '16 / 9',
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.893158017387!2d77.61869811484177!3d12.971169390847996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1684c7a5f0b5%3A0x6b8a8b1d7d0a2d2a!2sSarvotham's%20Spine%20Care%20Assaye%20Road!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sarvotham's Spine Care Location"
                  />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Right side: Contact Form */}
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
