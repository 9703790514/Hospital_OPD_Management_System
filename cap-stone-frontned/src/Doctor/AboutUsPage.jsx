import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SpaIcon from '@mui/icons-material/Spa';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import GroupIcon from '@mui/icons-material/Group';

// Create a custom MUI theme for a cohesive and beautiful look
const theme = createTheme({
    palette: {
        primary: {
            main: '#4a148c', // A deep, rich purple
        },
        secondary: {
            main: '#ff6f00', // A vibrant orange for accents
        },
        background: {
            default: '#f4f6f9',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h3: {
            fontWeight: 800,
            fontSize: '2.5rem',
        },
        h5: {
            fontWeight: 700,
            color: '#4a148c',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

// A component to display a service item with an icon
const ServiceItem = ({ icon, title, description }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ mr: 2, p: 1, borderRadius: '50%', bgcolor: 'secondary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </Box>
    </Box>
);

const AboutPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                flexGrow: 1,
                minHeight: '100vh',
                py: { xs: 4, md: 8 },
                px: { xs: 2, md: 4 },
                background: 'linear-gradient(135deg, #eef2f6 0%, #ccdae8 100%)',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Box sx={{ maxWidth: 1000, width: '100%' }}>
                    <Paper sx={{ p: { xs: 4, md: 8 }, overflow: 'hidden' }}>
                        {/* Header and Mission Statement */}
                        <Typography variant="h3" gutterBottom align="center" color="primary">
                            Welcome to Sarvotham's Spine Care
                        </Typography>
                        <Divider sx={{ my: 4, borderColor: 'primary.main', opacity: 0.2 }} />
                        <Typography variant="body1" sx={{ mt: 2, fontSize: '1.1rem', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                            At **Sarvotham's Spine Care**, our unwavering commitment is to deliver world-class healthcare with a specialized focus on spinal treatments. We are passionate about improving the lives of our patients through a perfect blend of compassionate care and cutting-edge medical technology. Our team of specialists is dedicated to providing personalized treatment plans that lead to long-lasting health and well-being.
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, fontSize: '1.1rem', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                            We believe in a holistic approach, addressing not just the symptoms but the root cause of spinal issues. Your journey to a pain-free life is our primary mission.
                        </Typography>

                        <Divider sx={{ my: 6, borderColor: 'primary.main', opacity: 0.2 }} />

                        {/* Our Services Section */}
                        <Typography variant="h5" align="center" gutterBottom>
                            Our Comprehensive Services
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <ServiceItem
                                    icon={<ScienceIcon />}
                                    title="Advanced Diagnostics"
                                    description="Utilizing the latest imaging and diagnostic tools to accurately identify your condition."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ServiceItem
                                    icon={<MedicalServicesIcon />}
                                    title="Surgical Excellence"
                                    description="Performing a wide range of spinal surgeries with precision and minimal invasiveness."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ServiceItem
                                    icon={<AccessibilityNewIcon />}
                                    title="Personalized Rehabilitation"
                                    description="Customized therapy programs to help you recover faster and regain mobility."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ServiceItem
                                    icon={<SpaIcon />}
                                    title="Effective Pain Management"
                                    description="Offering non-surgical solutions and techniques to manage and alleviate chronic pain."
                                />
                            </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 6, borderColor: 'primary.main', opacity: 0.2 }} />

                        {/* Our Team Section */}
                        <Typography variant="h5" align="center" gutterBottom>
                            Meet Our Team
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, textAlign: 'center' }}>
                            <GroupIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="body1" sx={{ maxWidth: 700 }}>
                                Our dedicated team of board-certified spine specialists, physical therapists, and nurses work collaboratively to provide you with the best possible care. Each member brings a wealth of experience and a shared passion for patient well-being, ensuring a supportive and professional environment.
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AboutPage;
