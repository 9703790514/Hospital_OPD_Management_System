import { createTheme, ThemeProvider } from '@mui/material/styles';
// ... your other imports
import { WelcomePage } from './Components/WelcomePage';
import { LoginPage } from './Components/LoginPage';
import { RegistrationPage } from './Components/RegistrationPage';
import ForgotPasswordPage from './Components/ForgotPasswordPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PatientDashboard from './Patient/PatientDashboard';
import FrontDeskDashboard from './FrontDesk/FrontDeskDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
import NurseDashboard from './Nurse/NurseDashboard';
import LabTechnicianDashboard from './LabTechnician/LabTechnicianDashboard';
import BillingDeskDashboard from './BillingDesk/BillingDeskDashboard';


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
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontSize: '1rem' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Dashboard Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/frontdesk/dashboard" element={<FrontDeskDashboard />} />
          <Route path="/billing/dashboard" element={<BillingDeskDashboard />} />
          <Route path="/lab/dashboard" element={<LabTechnicianDashboard />} />
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          {/* Other routes can go here */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
