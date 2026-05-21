import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';

// Define a theme for consistency
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', contrastText: '#fff' },
    secondary: { main: '#388e3c' },
    background: { default: '#f5f7fa', paper: '#fff' },
    error: { main: '#d32f2f' },
    success: { main: '#4caf50' },
    text: { primary: '#202124', secondary: '#5f6368' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontSize: '1rem' },
  },
});

// Styled components for a clean layout
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  maxWidth: 450,
  width: '100%',
}));

const FormContainer = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// The functional login page
const LoginPage = ({ setPage }) => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // NOTE: The fetch call to a local host URL is for demonstration purposes.
      // It will not work in the live preview environment.
      const response = await fetch(`${import.meta.env.VITE_LOGIN_SERVICE_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('profilePic', data.profilePic || '');

      } else {
        const errorText = await response.text();
        setError(errorText || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container component="main" maxWidth="sm">
        <StyledPaper elevation={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img
              src="https://imgs.search.brave.com/I3lfsdq9k6y3txb8rAS9ukU5dwws1WPVNNQq7NQEIXI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ibHVlLW1lZGlj/YWwtZW1lcmdlbmN5/LXN0YXItbGlmZS13/aXRoLXdoaXRlLWNh/ZHVjZXVzLW1lZGlj/YWwtc3ltYm9sLXdo/aXRlLWJhY2tncm91/bmQtM2QtcmVuZGVy/aW5nXzQ3NjYxMi0x/NTA1NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
              alt="Sarvotham Spine Care"
              style={{ height: '50px', marginRight: '10px' }}
            />
            <Typography component="h1" variant="h5" color="primary">
              Sarvotham's Spine Care
            </Typography>
          </Box>

          <FormContainer onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />

            <Typography
              variant="body2"
              align="right"
              sx={{ cursor: 'pointer', color: 'primary.main', mb: 1 }}
              onClick={() => setPage('forgot-password')}
            >
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 1, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </FormContainer>

          <Box sx={{ mt: 2 }}>
            {/* Registration link can be added here if needed */}
          </Box>

          
        </StyledPaper>
      </Container>
    </Box>
  );
};

// The updated ForgotPasswordPage component
const ForgotPasswordPage = ({ setPage }) => {
  const theme = useTheme();

  // State to manage the steps of the process: 'email', 'otp', or 'reset-password'
  const [step, setStep] = useState('email');
  // Form state for various fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // User data fetched from the API
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to simulate sending an OTP
  const sendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Step 1: Get user details by email. Mocked API call.
      const userRes = await fetch(`${import.meta.env.VITE_USERS_SERVICE_URL}/api/users/email/${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!userRes.ok) {
        throw new Error('User not found with this email.');
      }
      const userData = await userRes.json();
      
      const fetchedPhoneNumber = userData.phone_number;
      const fetchedUserId = userData._id;

      if (!fetchedPhoneNumber) {
        throw new Error('No phone number found for this user.');
      }
      
      setUserId(fetchedUserId);
      setPhoneNumber(fetchedPhoneNumber);

      // Step 2: Send the OTP to the fetched phone number. Mocked API call.
      const otpRes = await fetch(`${import.meta.env.VITE_OTP_SERVICE_URL}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: fetchedUserId, phone: fetchedPhoneNumber }),
      });

      if (otpRes.ok) {
        setMessage('OTP has been sent to your registered phone number.');
        setStep('otp'); // Move to the OTP verification step
      } else {
        const text = await otpRes.text();
        setError(text || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to simulate OTP verification
  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Verify the OTP using the stored user data and the entered OTP. Mocked API call.
      const verifyRes = await fetch(`${import.meta.env.VITE_OTP_SERVICE_URL}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phone: phoneNumber, otp }),
      });

      if (verifyRes.ok) {
        setMessage('OTP verified successfully. Please enter your new password.');
        setStep('reset-password'); // Move to the password reset step
      } else {
        const text = await verifyRes.text();
        setError(text || 'Invalid or expired OTP.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the password update
  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Send the new password to the backend to update the user. Mocked API call.
      const updateRes = await fetch(`${import.meta.env.VITE_USERS_SERVICE_URL}/api/users/updatePassword/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (updateRes.ok) {
        setMessage('Your password has been reset successfully!');
        // Navigate back to the login page after a short delay
        setTimeout(() => setPage('login'), 3000);
      } else {
        const text = await updateRes.text();
        setError(text || 'Failed to update password. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const resendRes = await fetch(`${import.meta.env.VITE_OTP_SERVICE_URL}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phone: phoneNumber }),
      });

      if (resendRes.ok) {
        setMessage('A new OTP has been sent.');
      } else {
        const text = await resendRes.text();
        setError(text || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 'email') {
      sendOtp();
    } else if (step === 'otp') {
      verifyOtp();
    } else if (step === 'reset-password') {
      handlePasswordReset();
    }
  };

  const getTitle = () => {
    if (step === 'email') return 'Reset Your Password';
    if (step === 'otp') return 'Verify OTP';
    return 'Create New Password';
  };

  const getSubtitle = () => {
    if (step === 'email') return 'Enter your email address to begin the password reset process.';
    if (step === 'otp') return `An OTP has been sent to your phone number ending in ${phoneNumber.slice(-4)}.`;
    return 'Enter your new password below.';
  };

  const getButtonText = () => {
    if (loading) return <CircularProgress size={24} color="inherit" />;
    if (step === 'email') return 'Send OTP';
    if (step === 'otp') return 'Verify OTP';
    return 'Update Password';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container component="main" maxWidth="sm">
        <StyledPaper elevation={6}>
          <Typography variant="h5" color="primary" mb={2} component="h1">
            {getTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            {getSubtitle()}
          </Typography>
          <FormContainer onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            {message && (
              <Typography color="success.main" variant="body2" align="center">
                {message}
              </Typography>
            )}
            {step === 'email' && (
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                type="email"
                placeholder="your.email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            )}
            {step === 'otp' && (
              <>
                <TextField
                  label="OTP"
                  variant="outlined"
                  fullWidth
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </>
            )}
            {step === 'reset-password' && (
              <>
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  placeholder="Enter a new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  placeholder="Confirm your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {getButtonText()}
            </Button>
            {step === 'otp' && (
              <Button
                variant="text"
                fullWidth
                color="primary"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </Button>
            )}
            <Button
              variant="text"
              fullWidth
              color="primary"
              onClick={() => setPage('login')}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </FormContainer>
        </StyledPaper>
      </Container>
    </Box>
  );
};

// The main App component to render the pages
const App = () => {
  const [page, setPage] = useState('login');

  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage setPage={setPage} />;
     case 'register':
        return <RegistrationPage setPage={setPage}/>
      default:
        return <LoginPage setPage={setPage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {renderPage()}
    </ThemeProvider>
  );
};

export default App;
