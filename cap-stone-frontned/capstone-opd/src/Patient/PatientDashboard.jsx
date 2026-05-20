import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import ProfileMenu from './ProfileMenu';
import MyHealthPage from './MyHealthPage';
import MedicalRecordsPage from './MedicalRecordsPage';
import PrescriptionsPage from './PrescriptionsPage';
import LabReportsPage from './LabReportsPage';
import HomePage from './HomePage';
import MyBillsPage from './MyBillsPage';
import ServicesPage from './ServicesPage';
import ContactPage from './ContactPage';
import EditProfilePage from './EditProfilePage';
import './PatientDashboard.css';

// Navigation configuration with the new "Edit Profile" button
const NAVIGATION = [
  { segment: 'home', title: 'Home', icon: <HomeIcon /> },
  { segment: 'my-health', title: 'My Health', icon: <MedicalServicesIcon /> },
  { segment: 'my-bills', title: 'My Bills', icon: <AccountBalanceWalletIcon /> },
  { segment: 'services', title: 'Services', icon: <MiscellaneousServicesIcon /> },
  { segment: 'contact', title: 'Contact', icon: <ContactMailIcon /> },
  { segment: 'edit-profile', title: 'Edit Profile', icon: <SettingsIcon /> },
];

// Material-UI theme setup
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', contrastText: '#fff' },
    secondary: { main: '#388e3c' },
    background: { default: '#f5f7fa', paper: '#fff' },
    error: { main: '#d32f2f' },
    text: { primary: '#202124', secondary: '#5f6368' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    body1: { fontSize: '1rem' },
  },
  components: {
    MuiTypography: { styleOverrides: { root: { lineHeight: 1.5 } } },
  },
});

// Simple Error Boundary for catching render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error.toString() };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Error occurred loading this section.</Typography>
          <Typography>{this.state.errorInfo}</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function SidebarNavigation({ currentSegment, onNavigate }) {
  console.log('[SidebarNavigation] currentSegment:', currentSegment);
  return (
    <List sx={{ width: 0, bgcolor: 'background.paper' }}>
      {NAVIGATION.map((item, idx) =>
        item.kind === 'header' ? (
          <Typography key={idx} variant="subtitle2" sx={{ p: 2, color: 'text.secondary', userSelect: 'none' }}>
            {item.title}
          </Typography>
        ) : (
          <ListItemButton key={item.segment} selected={currentSegment === item.segment} onClick={() => {
            console.log(`[SidebarNavigation] Navigate to: ${item.segment}`);
            onNavigate(item.segment);
          }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        )
      )}
    </List>
  );
}

SidebarNavigation.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

function DashboardPageContent({ currentSegment, loading, patient, onNavigate, onViewMedicalRecords, onSaveProfile }) {
  console.log('[DashboardPageContent] Rendering for segment:', currentSegment);
  if (loading) {
    return (
      <Box
        sx={{
          width: '0%',
          height: '0%',
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  switch (currentSegment) {
    case 'branding-landing':
    case '':
      return (
        <Box sx={{ flexGrow: 1, p: 4, bgcolor: '#f5f7fa', overflowY: 'auto' }}>
          {/* Welcome Banner Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Welcome to Sarvotham's Spine Care
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Your journey to a healthier spine starts here. We are dedicated to providing the best care for our patients.
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => onNavigate('contact')}>
              Book an Appointment
            </Button>
          </Paper>

          <Divider sx={{ my: 4 }} />

          {/* Mission & Services Cards */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
            Our Commitment to You
          </Typography>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 112, 204, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 50px rgba(0, 112, 204, 0.3)',
    },
  }}
>
  <Box sx={{ position: 'relative', height: 350 }}>
    <CardMedia
      component="img"
      image="https://media.istockphoto.com/id/1404179486/photo/anesthetist-working-in-operating-theatre-wearing-protecive-gear-checking-monitors-while.jpg?s=612x612&w=0&k=20&c=gecZ0b-nDIuMOvRIt8Qyam-eSx6RBdUzn5yDh0nNEvM="
      alt="Doctor and patient consultation"
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.85)',
        transition: 'filter 0.3s ease',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(2,112,204,0.3) 60%, rgba(2,112,204,0.7) 100%)',
      }}
    />
  </Box>

  <CardContent sx={{ flexGrow: 1 }}>
    <Typography
      variant="h4"
      component="h2"
      sx={{
        fontWeight: 900,
        color: 'primary.main',
        mb: 2,
        letterSpacing: '0.05em',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}
    >
      Our Mission
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontSize: '1.125rem',
        color: 'text.secondary',
        lineHeight: 1.75,
      }}
    >
      We are committed to providing compassionate, comprehensive, and state-of-the-art spine care.
      Our goal is to improve the quality of life for every patient through personalized treatment plans
      and a holistic approach to health and wellness.
    </Typography>
  </CardContent>
</Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0, 118, 255, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(0, 118, 255, 0.3)',
    },
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  }}
>
  <Box sx={{ position: 'relative' }}>
    <CardMedia
      component="img"
      height="250"
      image="https://asianheartinstitute.org/wp-content/uploads/2023/12/home-banner-mob.webp"
      alt="Spinal cord model"
      sx={{
        width: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.95)',
      }}
    />
    {/* subtle overlay */}
    <Box
      sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(33,150,243,0.3) 0%, rgba(255,255,255,0.5) 100%)',
        pointerEvents: 'none',
      }}
    />
  </Box>
  <CardContent sx={{ flexGrow: 1, p: 3 }}>
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
      Advanced Services
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
      We offer a wide range of services, including advanced diagnostics, non-surgical treatments like physical therapy and injections, and minimally invasive surgical procedures. Our expert team ensures you receive the most effective care tailored to your needs.
    </Typography>
  </CardContent>
</Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Quick Links Section */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', '&:hover': { bgcolor: 'primary.light' }, cursor: 'pointer' }} onClick={() => onNavigate('my-health')}>
                <LocalHospitalIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">My Health</Typography>
                <Typography variant="body2" color="text.secondary">View your health overview.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', '&:hover': { bgcolor: 'primary.light' }, cursor: 'pointer' }} onClick={() => onNavigate('my-bills')}>
                <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">My Bills</Typography>
                <Typography variant="body2" color="text.secondary">Review your billing history.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', '&:hover': { bgcolor: 'primary.light' }, cursor: 'pointer' }} onClick={() => onNavigate('contact')}>
                <ContactMailIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Contact Us</Typography>
                <Typography variant="body2" color="text.secondary">Get in touch with our team.</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* FAQ Section */}
          <Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Frequently Asked Questions (FAQ)
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">What types of spine conditions do you treat?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We treat a variety of conditions, including herniated discs, spinal stenosis, sciatica, scoliosis, and degenerative disc disease. Our comprehensive approach ensures we address both simple and complex cases.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">How can I book an appointment?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  You can book an appointment by navigating to the "Contact" page and filling out the form, or by calling our clinic directly at the number provided.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Do you accept my insurance?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We work with most major insurance providers. Please contact our billing department to verify your specific coverage. You can find their details on the "Contact" page.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      );
    case 'home':
      return <HomePage patient={patient} />;
    case 'my-health':
      return <MyHealthPage patient={patient} onNavigate={onNavigate} onViewMedicalRecords={onViewMedicalRecords} />;
    case 'my-bills':
      return <MyBillsPage patient={patient} />;
    case 'services':
      return <ServicesPage />;
    case 'contact':
      return <ContactPage patient={patient} />;
   // src/Patient/PatientDashboard.jsx (modified snippet)
// ...
case 'edit-profile':
  // The patient prop contains the userId
  return <EditProfilePage patient={patient} userId={patient._id} onBack={() => onNavigate('home')} onSave={onSaveProfile} />;
// ...
      return (
        <Box
          sx={{
            mt: 0,
            p: 0,
            m: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1">Sorry, the page you are looking for doesn't exist.</Typography>
        </Box>
      );
  }
}

DashboardPageContent.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  patient: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  onNavigate: PropTypes.func.isRequired,
  onViewMedicalRecords: PropTypes.func,
  onSaveProfile: PropTypes.func.isRequired,
};

// Custom Header Component to show both image and title
const CustomHeader = ({ onNavigate }) => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    onClick={() => onNavigate('')}
  >
    <img
      src="https://imgs.search.brave.com/srz2pFGVJKd8v0use2RG82Xv1K4W-GTPkTsfWDKshFk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mcGlt/YWdlcy53aXRoZmxv/YXRzLmNvbS9hY3R1/YWwvNjQ3ZDgxYzFl/YWRhNDEwMDAxYWQ4/YzJmLmpwZWc"
      alt="Sarvotham Spine Care"
      style={{ height: '40px', marginRight: '10px' }}
    />
    <Typography
      variant="h6"
      component="div"
      sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary', display: { xs: 'none', md: 'block' } }}
    >
      Sarvotham Spine Care
    </Typography>
  </Box>
);

CustomHeader.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

const PatientDashboard = () => {
  const [currentSegment, setCurrentSegment] = useState('');
  const [patient, setPatient] = useState({
    name: '',
    email: '',
    profilePic: '',
    userId: '',
    phoneNumber: '',
  });
  const [loadingPatientData, setLoadingPatientData] = useState(true);

  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState({
    medicalRecordId: null,
    appointmentId: null
  });

  useEffect(() => {
    console.log('[PatientDashboard] Loading patient data from sessionStorage');
    (async () => {
      setLoadingPatientData(true);
      try {
        const storedUserId = sessionStorage.getItem('userId');
        const storedUsername = sessionStorage.getItem('username');
        const storedEmail = sessionStorage.getItem('email');
        const storedProfilePic = sessionStorage.getItem('profilePic');
        const storedPhoneNumber = sessionStorage.getItem('phoneNumber');

        console.log('[PatientDashboard] Retrieved user data:', { storedUserId, storedUsername, storedEmail });

        if (storedUserId && storedUsername && storedEmail) {
          setPatient({
            name: storedUsername,
            email: storedEmail,
            profilePic: storedProfilePic || `${import.meta.env.VITE_PATIENT_SERVICE_URL}/default-profile.png`,
            userId: storedUserId,
            phoneNumber: storedPhoneNumber || 'N/A',
          });
        } else {
          console.warn('[PatientDashboard] User data incomplete, redirecting to login');
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('[PatientDashboard] Error loading patient data:', err);
      } finally {
        setLoadingPatientData(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    console.log('[PatientDashboard] logout triggered: clearing session and redirecting');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleProfilePicChange = (base64String) => {
    console.log('[PatientDashboard] Profile picture change requested:', base64String);
    setPatient((prev) => ({ ...prev, profilePic: base64String }));
  };

  const handleSaveProfile = (updatedData) => {
    console.log('[PatientDashboard] Saving profile data:', updatedData);
    setPatient((prev) => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      phoneNumber: updatedData.phoneNumber,
    }));
    // In a real app, you'd also save this to sessionStorage and the backend
  };

  const handleNavigate = (segment) => {
    console.log('[PatientDashboard] Navigate called with segment:', segment);
    if (!segment.startsWith('medical-records') && !segment.startsWith('prescriptions') && !segment.startsWith('lab-reports')) {
      console.log('[PatientDashboard] Clearing selectedMedicalRecordId and appointmentId');
      setSelectedMedicalRecord({ medicalRecordId: null, appointmentId: null });
    }
    const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
    setCurrentSegment(normalizedSegment);
  };

  const handleViewMedicalRecords = (medicalRecordId, appointmentId) => {
    console.log('[PatientDashboard] View Medical Records for ID:', medicalRecordId, 'and Appointment ID:', appointmentId);
    setSelectedMedicalRecord({ medicalRecordId, appointmentId });
    setCurrentSegment('medical-records');
  };

  const handleBackFromMedicalRecords = () => {
    console.log('[PatientDashboard] Back from medical records');
    setSelectedMedicalRecord({ medicalRecordId: null, appointmentId: null });
    setCurrentSegment('my-health');
  };

  const renderPageContent = () => {
    console.log('[PatientDashboard] renderPageContent. currentSegment:', currentSegment, 'selectedMedicalRecordId:', selectedMedicalRecord.medicalRecordId, 'selectedAppointmentId:', selectedMedicalRecord.appointmentId);

    if (loadingPatientData) {
      return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (currentSegment.startsWith('prescriptions/')) {
      const recordId = currentSegment.split('/')[1];
      console.log('[PatientDashboard] Rendering PrescriptionsPage for recordId:', recordId);
      return <PrescriptionsPage medicalRecordId={recordId} onBack={() => setCurrentSegment('medical-records')} />;
    }

    if (currentSegment.startsWith('lab-reports/')) {
      const recordId = currentSegment.split('/')[1];
      console.log('[PatientDashboard] Rendering LabReportsPage for recordId:', recordId);
      return <LabReportsPage medicalRecordId={recordId} onBack={() => setCurrentSegment('medical-records')} />;
    }

    if (currentSegment === 'medical-records' && selectedMedicalRecord.medicalRecordId) {
      console.log('[PatientDashboard] Rendering MedicalRecordsPage for recordId:', selectedMedicalRecord.medicalRecordId, 'and appointmentId:', selectedMedicalRecord.appointmentId);
      return (
        <MedicalRecordsPage
          medicalRecordId={selectedMedicalRecord.medicalRecordId}
          appointmentId={selectedMedicalRecord.appointmentId}
          onBack={handleBackFromMedicalRecords}
          onNavigate={handleNavigate}
        />
      );
    }

    console.log('[PatientDashboard] Rendering DashboardPageContent for segment:', currentSegment);
    return (
      <DashboardPageContent
        currentSegment={currentSegment}
        loading={loadingPatientData}
        patient={patient}
        onNavigate={handleNavigate}
        onViewMedicalRecords={handleViewMedicalRecords}
        onSaveProfile={handleSaveProfile}
      />
    );
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Box sx={{ width: '100vw', height: '100vh', p: 0, m: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AppProvider
            navigation={NAVIGATION}
            router={{ pathname: currentSegment, navigate: handleNavigate }}
            theme={theme}
            branding={{
              title: "Sarvotham Spine Care",
              logo: (
                <img
                  src="https://imgs.search.brave.com/I3lfsdq9k6y3txb8rAS9ukU5dwws1WPVNNQq7NQEIXI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ibHVlLW1lZGlj/YWwtZW1lcmdlbmN5/LXN0YXItbGlmZS13/aXRoLXdoaXRlLWNh/ZHVjZXVzLW1lZGlj/YWwtc3ltYm9sLXdo/aXRlLWJhY2tncm91/bmQtM2QtcmVuZGVy/aW5nXzQ3NjYxMi0x/NTA1NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
                  alt="Hospital Logo"
                  style={{ height: '40px' }}
                />
              ),
              onClick: () => handleNavigate(''),
            }}
          >
            <DashboardLayout
              sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
              slots={{
                drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigate} />,
                toolbarAccount: () => (
                  <ProfileMenu
                    patient={patient}
                    onLogout={handleLogout}
                    onProfilePicChange={handleProfilePicChange}
                    loading={loadingPatientData}
                    onNavigate={handleNavigate}
                  />
                ),
                toolbarTitle: () => <CustomHeader onNavigate={handleNavigate} />,
              }}
            >
              {renderPageContent()}
            </DashboardLayout>
          </AppProvider>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default PatientDashboard;