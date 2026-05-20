import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { styled } from '@mui/system';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%',
}));

const FormContainer = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const LoginPage = () => {
    const navigate = useNavigate();
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
            const response = await fetch(`${import.meta.env.VITE_LOGIN_SERVICE_URL}/api/auth/login`, {
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

                navigate(data.dashboardUrl);
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
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
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
                                onClick={() => navigate('/forgot-password')}
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
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                                    Register here
                                </Link>
                            </Typography>
                        </Box>
                    </StyledPaper>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

