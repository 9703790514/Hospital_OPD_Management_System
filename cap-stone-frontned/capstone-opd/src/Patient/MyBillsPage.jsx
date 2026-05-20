// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Grid from '@mui/material/Grid';
// import Divider from '@mui/material/Divider';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import Button from '@mui/material/Button';
// import Chip from '@mui/material/Chip';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import PaymentIcon from '@mui/icons-material/Payment';

// const MyBillsPage = ({ patient }) => {
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBills = async () => {
//       if (!patient || !patient.userId) {
//         setError('Patient ID not available. Please log in to view your bills.');
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`http://localhost:2009/api/bills?patientId=${patient.userId}`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch bills: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         setBills(data);
//       } catch (err) {
//         console.error('Error fetching bills:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBills();
//   }, [patient]);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', bgcolor: '#f5f7fa' }}>
//         <CircularProgress color="primary" />
//         <Typography variant="h6" sx={{ ml: 3, fontWeight: 500, color: 'primary.dark' }}>
//           Loading your bills...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ mt: 4, textAlign: 'center' }}>
//         <Alert severity="error">Error: {error}</Alert>
//         <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//           Could not load your bills. Please try again later.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ mt: 5, width: '100%', px: { xs: 1, sm: 3, md: 6, lg: 12 }, mb: 8 }}>
//       <Box
//         sx={{
//           background: 'linear-gradient(90deg, #1976d2, #42a5f5 70%)',
//           borderRadius: 3,
//           mb: 6,
//           px: { xs: 2, md: 5 },
//           py: { xs: 4, md: 5 },
//           color: '#fff',
//           boxShadow: '0 2px 20px 0 rgba(25, 118, 210, 0.09)',
//           textAlign: 'center'
//         }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: 700 }}>My Bills & Payments</Typography>
//         <Typography variant="h6" sx={{ mt: 1, opacity: 0.92, color: '#f2fafe' }}>
//           View your invoices, payment history, and billing information below.
//         </Typography>
//       </Box>

//       <Grid container spacing={4} justifyContent="center">
//         {bills.length === 0 ? (
//           <Grid item xs={12}>
//             <Typography variant="h6" color="text.secondary" sx={{ mt: 6, textAlign: 'center', fontWeight: 500 }}>
//               No bills found for your account.
//             </Typography>
//           </Grid>
//         ) : (
//           bills.map((bill) => (
//             <Grid item xs={12} sm={6} md={4} key={bill.id}>
//               <Card
//                 elevation={6}
//                 sx={{
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   borderRadius: 3,
//                   transition: 'box-shadow 0.2s',
//                   bgcolor: '#ffffff',
//                   boxShadow: '0 4px 20px rgba(66,165,245,0.10)',
//                   '&:hover': {
//                     boxShadow: '0 10px 24px 0 rgba(33, 150, 243, 0.16)',
//                     borderColor: 'primary.main'
//                   }
//                 }}
//               >
//                 <CardHeader
//                   avatar={<ReceiptLongIcon color="primary" />}
//                   title={`Bill #${bill.billId || bill.id}`}
//                   titleTypographyProps={{ fontWeight: 700, fontSize: '1.15rem' }}
//                   subheader={
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
//                       <PaymentIcon sx={{ mr: 0.7, color: 'primary.light' }} fontSize="inherit" />
//                       <Typography variant="subtitle2" color="text.secondary">
//                         {new Date(bill.billDate).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                   }
//                   sx={{ pb: 0 }}
//                 />
//                 <Divider />
//                 <CardContent sx={{ pt: 2 }}>
//                   <Box sx={{ mb: 1.2 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Payment Method:</strong> {bill.paymentMethod || <em>N/A</em>}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Transaction ID:</strong> {bill.transactionId || <em>N/A</em>}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Issued By:</strong> {bill.issuedByUserId || <em>N/A</em>}
//                     </Typography>
//                   </Box>
//                   <Divider sx={{ my: 2 }} />
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h6" color="primary.main">
//                       â‚¹ {Number(bill.totalAmount).toLocaleString()}
//                     </Typography>
//                     <Chip
//                       label={bill.balanceDue === 0 ? 'Paid' : 'Pending'}
//                       color={bill.balanceDue === 0 ? 'success' : 'warning'}
//                       variant="filled"
//                       sx={{ fontWeight: 600, px: 1.5 }}
//                     />
//                   </Box>
//                   {bill.balanceDue > 0 && (
//                     <Typography variant="caption" color="warning.main" sx={{ mt: 0.75, display: 'block' }}>
//                       Balance Due: â‚¹ {Number(bill.balanceDue).toLocaleString()}
//                     </Typography>
//                   )}
//                   {bill.billDocumentUrl && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="primary"
//                       sx={{ mt: 3, fontWeight: 600, borderRadius: 2, width: '100%' }}
//                       href={bill.billDocumentUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View PDF Invoice
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>
//     </Box>
//   );
// };

// MyBillsPage.propTypes = {
//   patient: PropTypes.shape({
//     userId: PropTypes.string.isRequired,
//   }).isRequired,
// };

// export default MyBillsPage;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Grid from '@mui/material/Grid';
// import Divider from '@mui/material/Divider';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import Button from '@mui/material/Button';
// import Chip from '@mui/material/Chip';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import PaymentIcon from '@mui/icons-material/Payment';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// const MyBillsPage = ({ patient }) => {
//   const [patientDetails, setPatientDetails] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [bills, setBills] = useState([]);
//   const [loadingPatient, setLoadingPatient] = useState(true);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);
//   const [loadingBills, setLoadingBills] = useState(false);
//   const [errorPatient, setErrorPatient] = useState(null);
//   const [errorAppointments, setErrorAppointments] = useState(null);
//   const [errorBills, setErrorBills] = useState(null);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

//   // Step 1: Fetch patient details using the userId
//   useEffect(() => {
//     const fetchPatientDetails = async () => {
//       if (!patient || !patient.userId) {
//         setErrorPatient('Patient userId is not available. Please log in.');
//         setLoadingPatient(false);
//         return;
//       }

//       setLoadingPatient(true);
//       setErrorPatient(null);

//       try {
//         const response = await fetch(`http://localhost:2008/api/patients/user/${patient.userId}`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         // Assuming the API returns an array and we need the first item
//         if (data && data.length > 0) {
//           setPatientDetails(data[0]);
//         } else {
//           setErrorPatient('Patient details not found for this user.');
//         }
//       } catch (err) {
//         console.error('Error fetching patient details:', err);
//         setErrorPatient(err.message);
//       } finally {
//         setLoadingPatient(false);
//       }
//     };

//     fetchPatientDetails();
//   }, [patient]);

//   // Step 2: Fetch appointments using the _id from the fetched patient details
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!patientDetails || !patientDetails._id) {
//         // Wait until patientDetails are fetched or handle the error
//         if (!loadingPatient) {
//           setAppointments([]);
//           setLoadingAppointments(false);
//         }
//         return;
//       }

//       setLoadingAppointments(true);
//       setErrorAppointments(null);

//       try {
//         const response = await fetch(`http://localhost:2010/api/appointments/patient/${patientDetails._id}`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         setAppointments(data);
//       } catch (err) {
//         console.error('Error fetching appointments:', err);
//         setErrorAppointments(err.message);
//       } finally {
//         setLoadingAppointments(false);
//       }
//     };

//     if (patientDetails) {
//       fetchAppointments();
//     }
//   }, [patientDetails, loadingPatient]); // Depend on patientDetails to trigger the fetch

//   // Fetch bills for a specific appointment
//   const handleViewBills = async (appointmentId) => {
//     setSelectedAppointmentId(appointmentId);
//     setLoadingBills(true);
//     setErrorBills(null);
//     setBills([]);

//     try {
//       const response = await fetch(`http://localhost:2009/api/bills/appointments/${appointmentId}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch bills for appointment ${appointmentId}: ${response.status} ${response.statusText}`);
//       }
//       const data = await response.json();
//       setBills(data);
//     } catch (err) {
//       console.error('Error fetching bills:', err);
//       setErrorBills(err.message);
//     } finally {
//       setLoadingBills(false);
//     }
//   };

//   const renderAppointmentsTable = () => (
//     <Box sx={{ mt: 5, width: '100%' }}>
//       <Typography variant="h4" gutterBottom>Your Appointments</Typography>
//       {loadingPatient || loadingAppointments ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : errorPatient || errorAppointments ? (
//         <Alert severity="error">{errorPatient || errorAppointments}</Alert>
//       ) : appointments.length === 0 ? (
//         <Typography variant="h6" color="text.secondary" align="center">No appointments found.</Typography>
//       ) : (
//         <TableContainer component={Paper} elevation={3}>
//           <Table aria-label="appointments table">
//             <TableHead sx={{ bgcolor: 'primary.main' }}>
//               <TableRow>
//                 <TableCell sx={{ color: 'white' }}>Date</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Time</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Reason</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Status</TableCell>
//                 <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {appointments.map((appointment) => (
//                 <TableRow key={appointment.id} hover>
//                   <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
//                   <TableCell>{new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
//                   <TableCell>{appointment.reasonForVisit}</TableCell>
//                   <TableCell><Chip label={appointment.status} color={appointment.status === 'Completed' ? 'success' : 'info'} /></TableCell>
//                   <TableCell align="right">
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => handleViewBills(appointment.id)}
//                     >
//                       View Bills
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );

//   const renderBillsSection = () => (
//     <Box sx={{ mt: 5, width: '100%', px: { xs: 1, sm: 3, md: 6, lg: 12 }, mb: 8 }}>
//       <Button
//         onClick={() => setSelectedAppointmentId(null)}
//         sx={{ mb: 3 }}
//       >
//         â† Back to Appointments
//       </Button>
//       <Box
//         sx={{
//           background: 'linear-gradient(90deg, #1976d2, #42a5f5 70%)',
//           borderRadius: 3,
//           mb: 6,
//           px: { xs: 2, md: 5 },
//           py: { xs: 4, md: 5 },
//           color: '#fff',
//           boxShadow: '0 2px 20px 0 rgba(25, 118, 210, 0.09)',
//           textAlign: 'center'
//         }}
//       >
//         <Typography variant="h4" sx={{ fontWeight: 700 }}>Bills for Appointment</Typography>
//         <Typography variant="h6" sx={{ mt: 1, opacity: 0.92, color: '#f2fafe' }}>
//           Details for appointment on {selectedAppointmentId}.
//         </Typography>
//       </Box>

//       {loadingBills ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : errorBills ? (
//         <Alert severity="error">{errorBills}</Alert>
//       ) : bills.length === 0 ? (
//         <Typography variant="h6" color="text.secondary" align="center">No bills found for this appointment.</Typography>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {bills.map((bill) => (
//             <Grid item xs={12} sm={6} md={4} key={bill.id}>
//               <Card
//                 elevation={6}
//                 sx={{
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   borderRadius: 3,
//                   transition: 'box-shadow 0.2s',
//                   bgcolor: '#ffffff',
//                   boxShadow: '0 4px 20px rgba(66,165,245,0.10)',
//                   '&:hover': {
//                     boxShadow: '0 10px 24px 0 rgba(33, 150, 243, 0.16)',
//                     borderColor: 'primary.main'
//                   }
//                 }}
//               >
//                 <CardHeader
//                   avatar={<ReceiptLongIcon color="primary" />}
//                   title={`Bill #${bill.billId || bill.id}`}
//                   titleTypographyProps={{ fontWeight: 700, fontSize: '1.15rem' }}
//                   subheader={
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
//                       <PaymentIcon sx={{ mr: 0.7, color: 'primary.light' }} fontSize="inherit" />
//                       <Typography variant="subtitle2" color="text.secondary">
//                         {new Date(bill.billDate).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                   }
//                   sx={{ pb: 0 }}
//                 />
//                 <Divider />
//                 <CardContent sx={{ pt: 2 }}>
//                   <Box sx={{ mb: 1.2 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Payment Method:</strong> {bill.paymentMethod || <em>N/A</em>}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Transaction ID:</strong> {bill.transactionId || <em>N/A</em>}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <strong>Issued By:</strong> {bill.issuedByUserId || <em>N/A</em>}
//                     </Typography>
//                   </Box>
//                   <Divider sx={{ my: 2 }} />
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h6" color="primary.main">
//                       â‚¹ {Number(bill.totalAmount).toLocaleString()}
//                     </Typography>
//                     <Chip
//                       label={bill.balanceDue === 0 ? 'Paid' : 'Pending'}
//                       color={bill.balanceDue === 0 ? 'success' : 'warning'}
//                       variant="filled"
//                       sx={{ fontWeight: 600, px: 1.5 }}
//                     />
//                   </Box>
//                   {bill.balanceDue > 0 && (
//                     <Typography variant="caption" color="warning.main" sx={{ mt: 0.75, display: 'block' }}>
//                       Balance Due: â‚¹ {Number(bill.balanceDue).toLocaleString()}
//                     </Typography>
//                   )}
//                   {bill.billDocumentUrl && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="primary"
//                       sx={{ mt: 3, fontWeight: 600, borderRadius: 2, width: '100%' }}
//                       href={bill.billDocumentUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View PDF Invoice
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );

//   return (
//     <Box sx={{ mt: 5, width: '100%', px: { xs: 1, sm: 3, md: 6, lg: 12 }, mb: 8 }}>
//       <Box
//         sx={{
//           background: 'linear-gradient(90deg, #1976d2, #42a5f5 70%)',
//           borderRadius: 3,
//           mb: 6,
//           px: { xs: 2, md: 5 },
//           py: { xs: 4, md: 5 },
//           color: '#fff',
//           boxShadow: '0 2px 20px 0 rgba(25, 118, 210, 0.09)',
//           textAlign: 'center'
//         }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: 700 }}>My Bills & Payments</Typography>
//         <Typography variant="h6" sx={{ mt: 1, opacity: 0.92, color: '#f2fafe' }}>
//           View your invoices, payment history, and billing information below.
//         </Typography>
//       </Box>

//       {selectedAppointmentId ? renderBillsSection() : renderAppointmentsTable()}
//     </Box>
//   );
// };

// MyBillsPage.propTypes = {
//   patient: PropTypes.shape({
//     userId: PropTypes.string.isRequired,
//   }).isRequired,
// };

// export default MyBillsPage;

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Zoom,
} from '@mui/material';
import {
  ReceiptLong as ReceiptLongIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define a custom Material-UI theme for a clean and modern medical aesthetic.
// This theme uses a fresh color palette and updated component styles for a premium feel.
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h3: { fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.06em' },
    h4: { fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em' },
    h5: { fontWeight: 800, fontSize: '1.8rem' },
    h6: { fontWeight: 700, fontSize: '1.4rem' },
    body1: { fontSize: '1.05rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
  },
  palette: {
    primary: { main: '#0077b6', light: '#48a9e0', dark: '#005f93' },
    secondary: { main: '#48cae4', light: '#7be1ff', dark: '#37a5be' },
    success: { main: '#00b400', light: '#33d433', dark: '#008b00' },
    error: { main: '#e63946' },
    warning: { main: '#ffb703' },
    info: { main: '#0096c7' },
    background: { default: '#f0f4f8', paper: '#ffffff' },
    text: { primary: '#2d3748', secondary: '#718096' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(5, { xs: 2, md: 5 }),
  color: theme.palette.common.white,
  boxShadow: '0 12px 40px rgba(0, 119, 182, 0.4)',
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    background: 'rgba(255,255,255,0.08)',
    transform: 'rotate(45deg)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 100,
    height: 100,
    background: 'rgba(255,255,255,0.05)',
    transform: 'rotate(-45deg)',
    borderRadius: '50%',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'box-shadow 0.3s, transform 0.3s',
  minHeight: '300px',
  '&:hover': {
    boxShadow: theme.shadows[10],
    transform: 'translateY(-4px)',
  },
}));

const BillItemDetail = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

const NoDataPlaceholder = ({ message, icon }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    textAlign: 'center',
    color: 'text.secondary',
  }}>
    <Box sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
      {message}
    </Typography>
  </Box>
);

NoDataPlaceholder.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

/**
 * MyBillsPage Component displays a patient's appointments and associated bills.
 * It handles fetching patient details, appointments, and bills for a selected appointment.
 */
const MyBillsPage = ({ patient }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
  const [errorPatient, setErrorPatient] = useState(null);
  const [errorAppointments, setErrorAppointments] = useState(null);
  const [errorBills, setErrorBills] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // State for search and sort
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
  const [appointmentSortBy, setAppointmentSortBy] = useState('dateDesc');
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [billSortBy, setBillSortBy] = useState('dateDesc');

  // Step 1: Fetch patient details using the userId
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patient || !patient.userId) {
        setErrorPatient('Patient userId is not available. Please log in.');
        setLoadingPatient(false);
        return;
      }

      setLoadingPatient(true);
      setErrorPatient(null);

      try {
        const response = await fetch(`http://localhost:2008/api/patients/user/${patient.userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setPatientDetails(data[0]);
        } else {
          setErrorPatient('Patient details not found for this user.');
        }
      } catch (err) {
        setErrorPatient(err.message);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatientDetails();
  }, [patient]);

  // Step 2: Fetch appointments using the _id from the fetched patient details
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientDetails?._id) {
        // Only set state if the patient details are null, not just loading
        if (!loadingPatient) {
          setAppointments([]);
          setLoadingAppointments(false);
        }
        return;
      }

      setLoadingAppointments(true);
      setErrorAppointments(null);

      try {
        const response = await fetch(`http://localhost:2010/api/appointments/patient/${patientDetails._id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setErrorAppointments(err.message);
      } finally {
        setLoadingAppointments(false);
      }
    };

    if (patientDetails) {
      fetchAppointments();
    }
  }, [patientDetails, loadingPatient]);

  /**
   * Fetches bills for a specific appointment.
   * @param {string} appointmentId The ID of the appointment to fetch bills for.
   */
  const handleViewBills = async (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setLoadingBills(true);
    setErrorBills(null);
    setBills([]); // Clear previous bills immediately

    try {
      const response = await fetch(`http://localhost:2009/api/bills/appointments/${appointmentId}`);

      if (response.status === 404) {
        // Special handling for 404 - no bills found is a valid scenario.
        setBills([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch bills for appointment ${appointmentId}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setBills(data);
    } catch (err) {
      setErrorBills(err.message);
    } finally {
      setLoadingBills(false);
    }
  };

  // Memoized filtered and sorted appointments
  const filteredAndSortedAppointments = useMemo(() => {
    return appointments
      .filter((appointment) =>
        appointment.reasonForVisit.toLowerCase().includes(appointmentSearchTerm.toLowerCase()) ||
        new Date(appointment.appointmentDate).toLocaleDateString().toLowerCase().includes(appointmentSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (appointmentSortBy === 'dateAsc') {
          return new Date(a.appointmentDate) - new Date(b.appointmentDate);
        } else {
          return new Date(b.appointmentDate) - new Date(a.appointmentDate);
        }
      });
  }, [appointments, appointmentSearchTerm, appointmentSortBy]);

  // Memoized filtered and sorted bills
  const filteredAndSortedBills = useMemo(() => {
    return bills
      .filter((bill) =>
        (bill.billId || '').toLowerCase().includes(billSearchTerm.toLowerCase()) ||
        (bill.paymentMethod || '').toLowerCase().includes(billSearchTerm.toLowerCase()) ||
        (bill.transactionId || '').toLowerCase().includes(billSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (billSortBy === 'dateAsc') {
          return new Date(a.billDate) - new Date(b.billDate);
        } else if (billSortBy === 'dateDesc') {
          return new Date(b.billDate) - new Date(a.billDate);
        } else if (billSortBy === 'amountAsc') {
          return a.totalAmount - b.totalAmount;
        } else {
          return b.totalAmount - a.totalAmount;
        }
      });
  }, [bills, billSearchTerm, billSortBy]);

  const renderAppointmentsTable = () => (
    <Zoom in={!selectedAppointmentId} timeout={600}>
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        <Fade in timeout={1200}>
          <HeaderBox>
            <AccountBalanceWalletIcon sx={{ fontSize: '3.5rem', mb: 1, color: 'secondary.light' }} />
            <Typography variant="h3" sx={{ fontWeight: 700,color: "white" }}>My Bills & Payments</Typography>
            <Typography variant="h6" sx={{ mt: 1, opacity: 0.92, color: '#f2fafe' }}>
              View your invoices, payment history, and billing information.
            </Typography>
          </HeaderBox>
        </Fade>

        {/* Search and Sort Bar for Appointments */}
        <Fade in timeout={1500}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
            <TextField
              label="Search Appointments"
              variant="outlined"
              size="small"
              fullWidth
              value={appointmentSearchTerm}
              onChange={(e) => setAppointmentSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={appointmentSortBy}
                onChange={(e) => setAppointmentSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="dateDesc">Date (Newest)</MenuItem>
                <MenuItem value="dateAsc">Date (Oldest)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Fade>

        {loadingPatient || loadingAppointments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
              Loading Appointments...
            </Typography>
          </Box>
        ) : errorPatient || errorAppointments ? (
          <Alert severity="error">{errorPatient || errorAppointments}</Alert>
        ) : appointments.length === 0 ? (
          <NoDataPlaceholder
            message="No appointments found for this patient."
            icon={<HourglassEmptyIcon sx={{ fontSize: 64 }} />}
          />
        ) : (
          <Fade in timeout={1800}>
            <TableContainer component={Paper} elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
              <Table aria-label="appointments table">
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedAppointments.map((appointment) => (
                    <TableRow key={appointment.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell>{appointment.reasonForVisit}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={appointment.status === 'Completed' ? 'success' : 'info'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="view bills"
                          color="primary"
                          onClick={() => handleViewBills(appointment.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}
      </Box>
    </Zoom>
  );

  const renderBillsSection = () => (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
       <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
  <Button
    variant="outlined"
    color="primary"
    onClick={() => setSelectedAppointmentId(null)}
    startIcon={<ArrowBackIcon />}
    sx={{
      px: 3,
      py: 1.5,
      textTransform: 'none',
      fontWeight: '600',
      minWidth: 140,
      boxShadow: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: 'primary.main',
        color: 'white',
        boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)',
      }
    }}
  >
    Back
  </Button>
</Box>

        <HeaderBox sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700,color : "white" }}>Bills for Appointment</Typography>
          {/* <Typography variant="h6" sx={{ mt: 1, opacity: 0.92, color: 'white' }}>
            Appointment ID: {selectedAppointmentId}
          </Typography> */}
        </HeaderBox>

        {/* Search and Sort Bar for Bills */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <TextField
            label="Search Bills"
            variant="outlined"
            size="small"
            fullWidth
            value={billSearchTerm}
            onChange={(e) => setBillSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={billSortBy}
              onChange={(e) => setBillSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="dateDesc">Date (Newest)</MenuItem>
              <MenuItem value="dateAsc">Date (Oldest)</MenuItem>
              <MenuItem value="amountDesc">Amount (High to Low)</MenuItem>
              <MenuItem value="amountAsc">Amount (Low to High)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loadingBills ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
              Loading Bills...
            </Typography>
          </Box>
        ) : errorBills ? (
          <Alert severity="error">{errorBills}</Alert>
        ) : filteredAndSortedBills.length === 0 ? (
          <NoDataPlaceholder
            message="No bills found for this appointment."
            icon={<HourglassEmptyIcon sx={{ fontSize: 64 }} />}
          />
        ) : (
          <Zoom in={true} timeout={600}>
            <Grid container spacing={4} justifyContent="center">
              {filteredAndSortedBills.map((bill) => (
                <Grid item xs={12} sm={6} md={4} key={bill.id}>
                  <StyledCard elevation={6}>
                    <CardHeader
                      avatar={<ReceiptLongIcon color="primary" sx={{ fontSize: '2rem' }} />}
                      //title={`Bill #${bill.billId || bill.id}`}
                      titleTypographyProps={{ fontWeight: 700, fontSize: '1.25rem' }}
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PaymentIcon sx={{ mr: 0.7, color: 'text.secondary' }} fontSize="inherit" />
                          <Typography variant="body2" color="text.secondary">
                            Date: {new Date(bill.billDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      sx={{ pb: 0 }}
                    />
                    <Divider />
                    <CardContent sx={{ pt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <BillItemDetail>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Payment Method:</strong> {bill.paymentMethod || <em>N/A</em>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Transaction ID:</strong> {bill.transactionId || <em>N/A</em>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Issued By:</strong> {bill.issuedByUserId || <em>N/A</em>}
                        </Typography>
                      </BillItemDetail>
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mt: 'auto', flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h5" color="primary.main" fontWeight={700}>
                            â‚¹ {Number(bill.totalAmount).toLocaleString()}
                          </Typography>
                          <Chip
                            label={bill.balanceDue === 0 ? 'Paid' : 'Pending'}
                            color={bill.balanceDue === 0 ? 'success' : 'warning'}
                            variant="filled"
                          />
                        </Box>
                        {bill.balanceDue > 0 && (
                          <Typography variant="body2" color="warning.main" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
                            Balance Due: â‚¹ {Number(bill.balanceDue).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 3, minHeight: '48px' }}>
                        {bill.billDocumentUrl && (
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            sx={{ fontWeight: 600, borderRadius: 2, width: '100%' }}
                            href={bill.billDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                          >
                            View PDF Invoice
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Zoom>
        )}
      </Box>
    </Fade>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PageContainer>
        {selectedAppointmentId ? renderBillsSection() : renderAppointmentsTable()}
      </PageContainer>
    </ThemeProvider>
  );
};

MyBillsPage.propTypes = {
  /**
   * The patient object, which must contain a userId.
   */
  patient: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default MyBillsPage;
