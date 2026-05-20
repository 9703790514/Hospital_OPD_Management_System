import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

// Import icons for each service
import HealingIcon from '@mui/icons-material/Healing';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SpaIcon from '@mui/icons-material/Spa';

// Define a custom Material-UI theme for this page
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 800, fontSize: '2.8rem' },
    h6: { fontWeight: 700, fontSize: '1.4rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6, color: '#424242' },
  },
  palette: {
    primary: {
      main: '#2C3E50', // A professional, dark charcoal blue
      light: '#34495E',
      dark: '#1C2833',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3498DB', // A vibrant blue for accents
      light: '#5DADE2',
      dark: '#21618C',
    },
    background: {
      default: '#ECF0F1', // A very light, clean grey
      paper: '#ffffff', // White background for cards and containers
    },
    text: {
      primary: '#2C3E50', // Matching the primary color for a cohesive look
      secondary: '#757575', // A soft grey for descriptions
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Even more rounded corners
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)', // A more pronounced, soft shadow
          transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-12px)', // A more noticeable lift effect
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20, // Rounded search bar
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'transparent', // No border initially
            },
            '&:hover fieldset': {
              borderColor: 'rgba(44, 62, 80, 0.2)', // Subtle border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3498DB', // Focus border with the secondary color
              boxShadow: '0 0 10px rgba(52, 152, 219, 0.4)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#757575',
            fontWeight: 500,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '24px 0',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          height: 2, // Thicker divider
        },
      },
    },
  },
});

// Sample static services data, now with an associated icon component
const servicesData = [
  {
    id: 1,
    name: 'Consultations',
    description:
      'Expert consultations with experienced spine specialists to diagnose and provide personalized treatment plans for your spinal health issues.',
    icon: <Diversity2Icon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 2,
    name: 'Surgical Treatments',
    description:
      'Advanced surgical options, including minimally invasive procedures, utilizing state-of-the-art technology to ensure successful outcomes and faster recovery.',
    icon: <HealingIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 3,
    name: 'Physical Therapy & Rehabilitation',
    description:
      'Personalized physical therapy programs designed to aid recovery, improve mobility, reduce pain, and restore function after injury or surgery.',
    icon: <FitnessCenterIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 4,
    name: 'Pain Management Programs',
    description:
      'Comprehensive pain management plans, including medication management, injections, and non-surgical interventions to alleviate chronic spinal pain.',
    icon: <SpaIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 5,
    name: 'Diagnostic Imaging',
    description:
      'Access to advanced diagnostic imaging services like MRI, X-ray, and CT scans for accurate and detailed assessment of spinal conditions.',
    icon: <MonitorHeartIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 6,
    name: 'Spinal Injections',
    description:
      'Targeted spinal injections (e.g., epidural, facet joint) to reduce inflammation and pain, often used for diagnostic and therapeutic purposes.',
    icon: <LocalHospitalIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 7,
    name: 'Chiropractic Care',
    description:
      'Holistic chiropractic adjustments and therapies to improve spinal alignment, reduce nerve irritation, and enhance overall nervous system function.',
    icon: <SelfImprovementIcon sx={{ fontSize: '2.5rem' }} />,
  },
  {
    id: 8,
    name: 'Nutritional Counseling',
    description:
      'Guidance on diet and nutrition to support spinal health, reduce inflammation, and promote overall well-being as part of a comprehensive treatment plan.',
    icon: <FastfoodIcon sx={{ fontSize: '2.5rem' }} />,
  },
];

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter services based on search term
  const filteredServices = servicesData.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          pt: 8,
          width: '100%',
          px: { xs: 3, md: 5, lg: 8 },
          pb: 8,
          // Updated background with a subtle linear gradient for a modern feel
          background: 'linear-gradient(180deg, #ECF0F1 0%, #DCE3E5 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            textShadow: '1px 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          Our Comprehensive Services
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 820, mx: 'auto', mb: 6, px: { xs: 2, sm: 0 }, fontSize: '1.2rem' }}
        >
          At Sarvotham's Spine Care, we are dedicated to providing a wide range of specialized services to address all your spinal health needs. Our expert team utilizes the latest techniques and technologies to ensure the best possible care.
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            mb: 7,
            width: '100%',
            maxWidth: 3000,
            bgcolor: 'background.paper',
            borderRadius: 20,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.6,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search services (e.g., therapy, pain management)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" sx={{ fontSize: '1.8rem', color: '#757575' }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: '1.1rem',
                paddingLeft: 1,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
              },
              '& .MuiInputBase-input': {
                paddingY: 1.4, // Adjusted padding for better vertical alignment
              },
            }}
          />
        </Box>

        <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: 1400 ,height : 1500}}>
          {filteredServices.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4, fontWeight: 600 }}>
              No services found matching your search.
            </Typography>
          ) : (
            filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                <Card
                  elevation={8}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    width : "1300px",
                    flexDirection: 'column',
                    borderRadius: 5,
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: theme.palette.secondary.main,
                      transition: 'height 0.4s ease-in-out',
                    },
                    '&:hover::before': {
                      height: '100%',
                      opacity: 0.1,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4, zIndex: 1 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'secondary.light',
                        color: 'background.paper',
                        p: 2,
                        mb: 2,
                        boxShadow: '0 4px 10px rgba(52, 152, 219, 0.3)',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        mb: 1.5,
                      }}
                    >
                      {service.name}
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: 'primary.light', height: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.65 }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box
          sx={{
            mt: 10,
            textAlign: 'center',
            color: 'text.secondary',
            maxWidth: 720,
            px: 2,
            fontStyle: 'italic',
            fontSize: '1rem',
          }}
        >
          <Typography>
            For more detailed information about our services or to schedule an appointment, please contact us directly.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ServicesPage;
