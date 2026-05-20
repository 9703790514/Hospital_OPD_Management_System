// AboutPage.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AboutPage = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Welcome to Sarvotham's Spine Care
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
        Sarvotham's Spine Care is dedicated to providing the highest quality healthcare specializing in spinal treatments. Our expert team combines
        compassionate care with the latest medical advancements to help improve the lives of our patients.
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, fontSize: '1rem', lineHeight: 1.5 }}>
        We offer a comprehensive range of services including diagnostics, surgeries, rehabilitation, and pain management tailored to individual needs.
        Explore the dashboard to access your health records, bills, services, and contact information.
      </Typography>
    </Box>
  );
};

export default AboutPage;
