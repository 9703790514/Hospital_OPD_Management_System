// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material/Divider';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import GroupIcon from '@mui/icons-material/Group';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // Import Doctor specific page components
// import DoctorDashboardOverview from './DoctorDashboardOverview';
// import DoctorPatientList from './DoctorPatientList';
// import DoctorAppointments from './DoctorAppointments';
// import DoctorPrescriptions from './DoctorPrescriptions';
// import DoctorMySchedule from './DoctorMySchedule';
// import DoctorSettings from './DoctorSettings';
// import DoctorTodayAppointments from './DoctorTodayAppointments';
// import DoctorMedicalRecordsPage from './DoctorMedicalRecordsPage';
// import DoctorPrescriptionsPage from './DoctorPrescriptionsPage';
// import DoctorDiagnosticTestsPage from './DoctorDiagnosticTestsPage';

// // Utility to generate a consistent color from a string for avatar background
// function stringToColor(string) {
//   let hash = 0;
//   for (let i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// // Utility to create Avatar props with initials fallback
// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'DR'; // Default for Doctor initials
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default Doctor') },
//     children: initials,
//   };
// }

// // --- Navigation items for Doctor Dashboard ---
// const DOCTOR_NAVIGATION = [
//   { kind: 'header', title: 'Doctor Navigation' },
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'patient-list', title: 'Patient List', icon: <GroupIcon /> },
//   { segment: 'appointments', title: 'All Appointments', icon: <EventNoteIcon /> },
//   { segment: 'today-appointments', title: 'Today\'s Appointments', icon: <DateRangeIcon /> },
//   { segment: 'prescriptions', title: 'Prescriptions', icon: <LocalPharmacyIcon /> },
//   { segment: 'my-schedule', title: 'My Schedule', icon: <CalendarTodayIcon /> },
//   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// // --- Custom Material-UI Theme (reused for consistency) ---
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2', // Calming Blue (hospital-friendly)
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#388e3c', // Green for action / confirmation
//     },
//     background: {
//       default: '#f5f7fa',
//       paper: '#ffffff',
//     },
//     error: {
//       main: '#d32f2f', // Red for errors/warnings
//     },
//     text: {
//       primary: '#202124',
//       secondary: '#5f6368',
//     },
//     info: { main: '#03a9f4' },
//     success: { main: '#4caf50' },
//     warning: { main: '#ff9800' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h6: {
//       fontWeight: 600,
//       fontSize: '1.25rem',
//     },
//     body1: {
//       fontSize: '1rem',
//     },
//   },
//   components: {
//     MuiTypography: {
//       styleOverrides: {
//         root: {
//           lineHeight: 1.5,
//         },
//       },
//     },
//   },
// });

// // --- Profile Menu Component (reused and adapted for Doctor) ---
// function DoctorProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       onProfilePicChange(e.target.files[0]);
//       handleClose();
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress size={24} color="inherit" />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Tooltip title="Open Profile Menu">
//         <IconButton
//           onClick={handleOpen}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={open ? 'profile-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//           aria-label="User profile menu"
//         >
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 40, height: 40 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 40, height: 40 }} />
//           )}
//         </IconButton>
//       </Tooltip>

//       <Menu
//         id="profile-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 4,
//           sx: {
//             mt: 1.5,
//             minWidth: 240,
//             p: 2,
//             boxShadow:
//               'rgb(0 0 0 / 0.2) 0px 2px 8px',
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 64, height: 64, mr: 2 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 64, height: 64, mr: 2 }} />
//           )}
//           <Box>
//             <Typography variant="h6" noWrap>
//               {user.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>
//               {user.email}
//             </Typography>
//           </Box>
//         </Box>

//         <MenuItem>
//           <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%' }}>
//             Change Profile Picture
//           </label>
//           <input
//             id="upload-profile-pic"
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ display: 'none' }}
//           />
//         </MenuItem>

//         <Divider sx={{ my: 1 }} />

//         <MenuItem
//           onClick={() => {
//             onLogout();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
//           Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// DoctorProfileMenu.propTypes = {
//   user: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     profilePic: PropTypes.string,
//   }).isRequired,
//   onLogout: PropTypes.func.isRequired,
//   onProfilePicChange: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
// };

// // --- Content for the Dashboard Pages (adapted for Doctor) ---
// function DoctorDashboardPageContent({ currentSegment, loading, doctorUser, selectedMedicalRecordId, onNavigate }) {
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           width: '100%',
//           height: '100%',
//           minHeight: '100vh',
//           minWidth: '100vw',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           p: 0,
//           m: 0,
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   switch (currentSegment) {
//     case 'dashboard': return <DoctorDashboardOverview doctorUser={doctorUser} />;
//     case 'patient-list': return <DoctorPatientList doctorUser={doctorUser} />;
//     case 'appointments': return <DoctorAppointments doctorUser={doctorUser} />;
//     case 'today-appointments':
//       return (
//         <DoctorTodayAppointments
//           doctorUser={doctorUser}
//           onViewMedicalRecords={(medicalRecordId) => {
//             onNavigate(`medical-records-detail/${medicalRecordId}`);
//           }}
//         />
//       );
//     case 'medical-records-detail':
//       // Ensure onNavigate is passed here
//       if (selectedMedicalRecordId) {
//         return <DoctorMedicalRecordsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate('today-appointments')} onNavigate={onNavigate} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for medical records.</Alert>;
//     case 'prescriptions-detail':
//       // Ensure onNavigate is passed here
//       if (selectedMedicalRecordId) {
//         return <DoctorPrescriptionsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for prescriptions.</Alert>;
//     case 'diagnostic-tests-detail':
//       // Ensure onNavigate is passed here
//       if (selectedMedicalRecordId) {
//         return <DoctorDiagnosticTestsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for diagnostic tests.</Alert>;
//     case 'prescriptions': return <DoctorPrescriptions doctorUser={doctorUser} />;
//     case 'my-schedule': return <DoctorMySchedule doctorUser={doctorUser} />;
//     case 'settings': return <DoctorSettings doctorUser={doctorUser} />;
//     default:
//       return (
//         <Box
//           sx={{
//             py: 6,
//             px: 3,
//             maxWidth: 960,
//             mx: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             bgcolor: '#fff',
//             borderRadius: 2,
//             boxShadow:
//               '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom>
//             Page Not Found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// DoctorDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   doctorUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
//   selectedMedicalRecordId: PropTypes.string,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Navigation Sidebar Component ---
// function DoctorNavigationMenu({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider' }}>
//       {DOCTOR_NAVIGATION.map((item, index) => {
//         if (item.kind === 'header') {
//           return (
//             <Typography key={index} variant="subtitle1" sx={{ mt: 2, mb: 1, px: 2, fontWeight: 'bold' }}>
//               {item.title}
//             </Typography>
//           );
//         }
//         return (
//           <ListItemButton
//             key={item.segment}
//             selected={currentSegment === item.segment}
//             onClick={() => onNavigate(item.segment)}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.title} />
//           </ListItemButton>
//         );
//       })}
//     </List>
//   );
// }

// DoctorNavigationMenu.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Main Doctor Dashboard Component ---
// export const DoctorDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');
//   const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);

//   const [doctorUser, setDoctorUser] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     profilePic: '',
//   });
//   const [loadingDoctorData, setLoadingDoctorData] = useState(true);

//   useEffect(() => {
//     const loadDoctorData = async () => {
//       setLoadingDoctorData(true);

//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setDoctorUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-doctor.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }
//       setLoadingDoctorData(false);
//     };
//     loadDoctorData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = async (file) => {
//     const newPicUrl = URL.createObjectURL(file);
//     setDoctorUser((prev) => ({ ...prev, profilePic: newPicUrl }));
//     console.log('Profile picture changed locally. (Doctor)');
//   };

//   const handleNavigationChange = (segment) => {
//     if (segment.startsWith('medical-records-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('medical-records-detail');
//     } else if (segment.startsWith('prescriptions-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('prescriptions-detail');
//     } else if (segment.startsWith('diagnostic-tests-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('diagnostic-tests-detail');
//     }
//     else {
//       setSelectedMedicalRecordId(null);
//       setCurrentSegment(segment.startsWith('/') ? segment.slice(1) : segment);
//     }
//     console.log('Navigating to segment:', segment);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           width: '100vw',
//           height: '100vh',
//           p: 0,
//           m: 0,
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden',
//         }}
//       >
//         <AppProvider
//           navigation={DOCTOR_NAVIGATION}
//           router={{
//             pathname: currentSegment,
//             navigate: handleNavigationChange,
//           }}
//           theme={theme}
//           branding={{ title: 'Sarvotham\'s Spine Care - Doctor' }}
//         >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => (
//                 <DoctorNavigationMenu
//                   currentSegment={currentSegment}
//                   onNavigate={handleNavigationChange}
//                 />
//               ),
//               toolbarAccount: () => (
//                 <DoctorProfileMenu
//                   user={doctorUser}
//                   onLogout={handleLogout}
//                   onProfilePicChange={handleProfilePicChange}
//                   loading={loadingDoctorData}
//                 />
//               ),
//             }}
//           >
//             <DoctorDashboardPageContent
//               currentSegment={currentSegment}
//               loading={loadingDoctorData}
//               doctorUser={doctorUser}
//               selectedMedicalRecordId={selectedMedicalRecordId}
//               onNavigate={handleNavigationChange}
//             />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// DoctorDashboard.propTypes = {
//   // window: PropTypes.func,
// };

// export default DoctorDashboard;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material/Divider';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert'; // Added Alert for consistency

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import GroupIcon from '@mui/icons-material/Group';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
// import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // Icon for Medical Records list

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // Import Doctor specific page components
// import DoctorDashboardOverview from './DoctorDashboardOverview';
// import DoctorPatientList from './DoctorPatientList';
// import DoctorAppointments from './DoctorAppointments';
// import DoctorPrescriptions from './DoctorPrescriptions';
// import DoctorMySchedule from './DoctorMySchedule';
// import DoctorSettings from './DoctorSettings';
// import DoctorTodayAppointments from './DoctorTodayAppointments';
// import DoctorMedicalRecordsPage from './DoctorMedicalRecordsPage'; // Specific medical record detail page
// import DoctorPrescriptionsPage from './DoctorPrescriptionsPage'; // Specific prescriptions page
// import DoctorDiagnosticTestsPage from './DoctorDiagnosticTestsPage'; // Specific diagnostic tests page
// import DoctorMedicalRecords from './DoctorMedicalRecords'; // The list of appointments with medical records

// // Utility to generate a consistent color from a string for avatar background
// function stringToColor(string) {
//   let hash = 0;
//   for (let i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// // Utility to create Avatar props with initials fallback
// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'DR'; // Default for Doctor initials
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default Doctor') },
//     children: initials,
//   };
// }

// // --- Navigation items for Doctor Dashboard ---
// const DOCTOR_NAVIGATION = [
//   { kind: 'header', title: 'Doctor Navigation' },
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'patient-list', title: 'Patient List', icon: <GroupIcon /> },
//   { segment: 'appointments', title: 'All Appointments', icon: <EventNoteIcon /> },
//   { segment: 'today-appointments', title: 'Today\'s Appointments', icon: <DateRangeIcon /> },
//   { segment: 'medical-records', title: 'Medical Records', icon: <MedicalInformationIcon /> }, // Added for the list view
//   { segment: 'prescriptions', title: 'Prescriptions', icon: <LocalPharmacyIcon /> },
//   { segment: 'my-schedule', title: 'My Schedule', icon: <CalendarTodayIcon /> },
//   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// // --- Custom Material-UI Theme (reused for consistency) ---
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2', // Calming Blue (hospital-friendly)
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#388e3c', // Green for action / confirmation
//     },
//     background: {
//       default: '#f5f7fa',
//       paper: '#ffffff',
//     },
//     error: {
//       main: '#d32f2f', // Red for errors/warnings
//     },
//     text: {
//       primary: '#202124',
//       secondary: '#5f6368',
//     },
//     info: { main: '#03a9f4' },
//     success: { main: '#4caf50' },
//     warning: { main: '#ff9800' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h6: {
//       fontWeight: 600,
//       fontSize: '1.25rem',
//     },
//     body1: {
//       fontSize: '1rem',
//     },
//   },
//   components: {
//     MuiTypography: {
//       styleOverrides: {
//         root: {
//           lineHeight: 1.5,
//         },
//       },
//     },
//   },
// });

// // --- Profile Menu Component (reused and adapted for Doctor) ---
// function DoctorProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       onProfilePicChange(e.target.files[0]);
//       handleClose();
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress size={24} color="inherit" />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Tooltip title="Open Profile Menu">
//         <IconButton
//           onClick={handleOpen}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={open ? 'profile-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//           aria-label="User profile menu"
//         >
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 40, height: 40 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 40, height: 40 }} />
//           )}
//         </IconButton>
//       </Tooltip>

//       <Menu
//         id="profile-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 4,
//           sx: {
//             mt: 1.5,
//             minWidth: 240,
//             p: 2,
//             boxShadow:
//               'rgb(0 0 0 / 0.2) 0px 2px 8px',
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 64, height: 64, mr: 2 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 64, height: 64, mr: 2 }} />
//           )}
//           <Box>
//             <Typography variant="h6" noWrap>
//               {user.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>
//               {user.email}
//             </Typography>
//           </Box>
//         </Box>

//         <MenuItem>
//           <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%' }}>
//             Change Profile Picture
//           </label>
//           <input
//             id="upload-profile-pic"
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ display: 'none' }}
//           />
//         </MenuItem>

//         <Divider sx={{ my: 1 }} />

//         <MenuItem
//           onClick={() => {
//             onLogout();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
//           Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// DoctorProfileMenu.propTypes = {
//   user: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     profilePic: PropTypes.string,
//   }).isRequired,
//   onLogout: PropTypes.func.isRequired,
//   onProfilePicChange: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
// };

// // --- Content for the Dashboard Pages (adapted for Doctor) ---
// function DoctorDashboardPageContent({ currentSegment, loading, doctorUser, selectedMedicalRecordId, onNavigate }) {
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           width: '100%',
//           height: '100%',
//           minHeight: '100vh',
//           minWidth: '100vw',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           p: 0,
//           m: 0,
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   switch (currentSegment) {
//     case 'dashboard': return <DoctorDashboardOverview doctorUser={doctorUser} />;
//     case 'patient-list': return <DoctorPatientList doctorUser={doctorUser} />;
//     case 'appointments': return <DoctorAppointments doctorUser={doctorUser} />;
//     case 'today-appointments':
//       return (
//         <DoctorTodayAppointments
//           doctorUser={doctorUser}
//           onViewMedicalRecords={(medicalRecordId) => {
//             onNavigate(`medical-records-detail/${medicalRecordId}`);
//           }}
//         />
//       );
//     case 'medical-records': // Case for the list of medical records (now appointments with medical records)
//       return <DoctorMedicalRecords doctorUser={doctorUser} onNavigate={onNavigate} />;
//     case 'medical-records-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorMedicalRecordsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate('medical-records')} onNavigate={onNavigate} />; // Changed onBack to 'medical-records'
//       }
//       return <Alert severity="error">Medical Record ID not found for medical records.</Alert>;
//     case 'prescriptions-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorPrescriptionsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for prescriptions.</Alert>;
//     case 'diagnostic-tests-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorDiagnosticTestsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for diagnostic tests.</Alert>;
//     case 'prescriptions': return <DoctorPrescriptions doctorUser={doctorUser} />;
//     case 'my-schedule': return <DoctorMySchedule doctorUser={doctorUser} />;
//     case 'settings': return <DoctorSettings doctorUser={doctorUser} />;
//     default:
//       return (
//         <Box
//           sx={{
//             py: 6,
//             px: 3,
//             maxWidth: 960,
//             mx: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             bgcolor: '#fff',
//             borderRadius: 2,
//             boxShadow:
//               '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom>
//             Page Not Found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// DoctorDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   doctorUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
//   selectedMedicalRecordId: PropTypes.string,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Navigation Sidebar Component ---
// function DoctorNavigationMenu({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider' }}>
//       {DOCTOR_NAVIGATION.map((item, index) => {
//         if (item.kind === 'header') {
//           return (
//             <Typography key={index} variant="subtitle1" sx={{ mt: 2, mb: 1, px: 2, fontWeight: 'bold' }}>
//               {item.title}
//             </Typography>
//           );
//         }
//         return (
//           <ListItemButton
//             key={item.segment}
//             selected={currentSegment === item.segment}
//             onClick={() => onNavigate(item.segment)}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.title} />
//           </ListItemButton>
//         );
//       })}
//     </List>
//   );
// }

// DoctorNavigationMenu.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Main Doctor Dashboard Component ---
// export const DoctorDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');
//   const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);

//   const [doctorUser, setDoctorUser] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     profilePic: '',
//   });
//   const [loadingDoctorData, setLoadingDoctorData] = useState(true);

//   useEffect(() => {
//     const loadDoctorData = async () => {
//       setLoadingDoctorData(true);

//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setDoctorUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-doctor.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }
//       setLoadingDoctorData(false);
//     };
//     loadDoctorData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = async (file) => {
//     const newPicUrl = URL.createObjectURL(file);
//     setDoctorUser((prev) => ({ ...prev, profilePic: newPicUrl }));
//     console.log('Profile picture changed locally. (Doctor)');
//   };

//   const handleNavigationChange = (segment) => {
//     if (segment.startsWith('medical-records-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('medical-records-detail');
//     } else if (segment.startsWith('prescriptions-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('prescriptions-detail');
//     } else if (segment.startsWith('diagnostic-tests-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('diagnostic-tests-detail');
//     }
//     else {
//       setSelectedMedicalRecordId(null);
//       setCurrentSegment(segment.startsWith('/') ? segment.slice(1) : segment);
//     }
//     console.log('Navigating to segment:', segment);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           width: '100vw',
//           height: '100vh',
//           p: 0,
//           m: 0,
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden',
//         }}
//       >
//         <AppProvider
//           navigation={DOCTOR_NAVIGATION}
//           router={{
//             pathname: currentSegment,
//             navigate: handleNavigationChange,
//           }}
//           theme={theme}
//           branding={{ title: 'Sarvotham\'s Spine Care - Doctor' }}
//         >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => (
//                 <DoctorNavigationMenu
//                   currentSegment={currentSegment}
//                   onNavigate={handleNavigationChange}
//                 />
//               ),
//               toolbarAccount: () => (
//                 <DoctorProfileMenu
//                   user={doctorUser}
//                   onLogout={handleLogout}
//                   onProfilePicChange={handleProfilePicChange}
//                   loading={loadingDoctorData}
//                 />
//               ),
//             }}
//           >
//             <DoctorDashboardPageContent
//               currentSegment={currentSegment}
//               loading={loadingDoctorData}
//               doctorUser={doctorUser}
//               selectedMedicalRecordId={selectedMedicalRecordId}
//               onNavigate={handleNavigationChange}
//             />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// DoctorDashboard.propTypes = {
//   // window: PropTypes.func,
// };

// export default DoctorDashboard;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material/Divider';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import LogoutIcon from '@mui/icons-material/Logout';
// import InfoIcon from '@mui/icons-material/Info';
// import ContactMailIcon from '@mui/icons-material/ContactMail';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // Import all doctor-specific page components
// import DoctorDashboardOverview from './DoctorDashboardOverview';
// import DoctorAppointments from './DoctorAppointments';
// import DoctorMySchedule from './DoctorMySchedule';
// import DoctorTodayAppointments from './DoctorTodayAppointments';
// import DoctorMedicalRecordsPage from './DoctorMedicalRecordsPage';
// import DoctorPrescriptionsPage from './DoctorPrescriptionsPage';
// import DoctorDiagnosticTestsPage from './DoctorDiagnosticTestsPage';

// // Import the newly created pages
// import AboutUsPage from './AboutUsPage';
// import ContactUsPage from './ContactUsPage';

// // Utility to generate a consistent color from a string for avatar background
// function stringToColor(string) {
//   let hash = 0;
//   for (let i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// // Utility to create Avatar props with initials fallback
// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'DR';
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default Doctor') },
//     children: initials,
//   };
// }

// // --- Navigation items for Doctor Dashboard ---
// const DOCTOR_NAVIGATION = [
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'appointments', title: 'All Appointments', icon: <EventNoteIcon /> },
//   { segment: 'today-appointments', title: 'Today\'s Appointments', icon: <DateRangeIcon /> },
//   { segment: 'my-schedule', title: 'My Schedule', icon: <CalendarTodayIcon /> },
//   { segment: 'about-us', title: 'About Us', icon: <InfoIcon /> },
//   { segment: 'contact-us', title: 'Contact Us', icon: <ContactMailIcon /> },
// ];

// // --- Custom Material-UI Theme ---
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#388e3c',
//     },
//     background: {
//       default: '#f5f7fa',
//       paper: '#ffffff',
//     },
//     error: {
//       main: '#d32f2f',
//     },
//     text: {
//       primary: '#202124',
//       secondary: '#5f6368',
//     },
//     info: { main: '#03a9f4' },
//     success: { main: '#4caf50' },
//     warning: { main: '#ff9800' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h6: {
//       fontWeight: 600,
//       fontSize: '1.25rem',
//     },
//     body1: {
//       fontSize: '1rem',
//     },
//   },
//   components: {
//     MuiTypography: {
//       styleOverrides: {
//         root: {
//           lineHeight: 1.5,
//         },
//       },
//     },
//   },
// });

// // --- Profile Menu Component ---
// function DoctorProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       onProfilePicChange(e.target.files[0]);
//       handleClose();
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress size={24} color="inherit" />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Tooltip title="Open Profile Menu">
//         <IconButton
//           onClick={handleOpen}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={open ? 'profile-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//           aria-label="User profile menu"
//         >
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 40, height: 40 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 40, height: 40 }} />
//           )}
//         </IconButton>
//       </Tooltip>

//       <Menu
//         id="profile-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 4,
//           sx: {
//             mt: 1.5,
//             minWidth: 240,
//             p: 2,
//             boxShadow:
//               'rgb(0 0 0 / 0.2) 0px 2px 8px',
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           {user.profilePic ? (
//             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 64, height: 64, mr: 2 }} />
//           ) : (
//             <Avatar {...stringAvatar(user.name)} sx={{ width: 64, height: 64, mr: 2 }} />
//           )}
//           <Box>
//             <Typography variant="h6" noWrap>
//               {user.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>
//               {user.email}
//             </Typography>
//           </Box>
//         </Box>

//         <MenuItem>
//           <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%' }}>
//             Change Profile Picture
//           </label>
//           <input
//             id="upload-profile-pic"
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ display: 'none' }}
//           />
//         </MenuItem>

//         <Divider sx={{ my: 1 }} />

//         <MenuItem
//           onClick={() => {
//             onLogout();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
//           Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// DoctorProfileMenu.propTypes = {
//   user: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     profilePic: PropTypes.string,
//   }).isRequired,
//   onLogout: PropTypes.func.isRequired,
//   onProfilePicChange: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
// };

// // --- Content for the Dashboard Pages ---
// function DoctorDashboardPageContent({ currentSegment, loading, doctorUser, selectedMedicalRecordId, onNavigate }) {
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           width: '100%',
//           height: '100%',
//           minHeight: '100vh',
//           minWidth: '100vw',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           p: 0,
//           m: 0,
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   switch (currentSegment) {
//     case 'dashboard': return <DoctorDashboardOverview doctorUser={doctorUser} />;
//     case 'appointments': return <DoctorAppointments doctorUser={doctorUser} />;
//     case 'today-appointments':
//       return (
//         <DoctorTodayAppointments
//           doctorUser={doctorUser}
//           onViewMedicalRecords={(medicalRecordId) => {
//             onNavigate(`medical-records-detail/${medicalRecordId}`);
//           }}
//         />
//       );
//     case 'medical-records-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorMedicalRecordsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate('appointments')} onNavigate={onNavigate} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for medical records.</Alert>;
//     case 'prescriptions-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorPrescriptionsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for prescriptions.</Alert>;
//     case 'diagnostic-tests-detail':
//       if (selectedMedicalRecordId) {
//         return <DoctorDiagnosticTestsPage medicalRecordId={selectedMedicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedMedicalRecordId}`)} />;
//       }
//       return <Alert severity="error">Medical Record ID not found for diagnostic tests.</Alert>;
//     case 'my-schedule': return <DoctorMySchedule doctorUser={doctorUser} />;
//     case 'about-us': return <AboutUsPage />;
//     case 'contact-us': return <ContactUsPage />;
//     default:
//       return (
//         <Box
//           sx={{
//             py: 6,
//             px: 3,
//             maxWidth: 960,
//             mx: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             bgcolor: '#fff',
//             borderRadius: 2,
//             boxShadow:
//               '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom>
//             Page Not Found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// DoctorDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   doctorUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
//   selectedMedicalRecordId: PropTypes.string,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Navigation Sidebar Component ---
// function DoctorNavigationMenu({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider' }}>
//       {DOCTOR_NAVIGATION.map((item) => (
//         <ListItemButton
//           key={item.segment}
//           selected={currentSegment === item.segment}
//           onClick={() => onNavigate(item.segment)}
//         >
//           <ListItemIcon>{item.icon}</ListItemIcon>
//           <ListItemText primary={item.title} />
//         </ListItemButton>
//       ))}
//     </List>
//   );
// }

// DoctorNavigationMenu.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// // --- Main Doctor Dashboard Component ---
// export const DoctorDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');
//   const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);

//   const [doctorUser, setDoctorUser] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     profilePic: '',
//   });
//   const [loadingDoctorData, setLoadingDoctorData] = useState(true);

//   useEffect(() => {
//     const loadDoctorData = async () => {
//       setLoadingDoctorData(true);

//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setDoctorUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-doctor.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }
//       setLoadingDoctorData(false);
//     };
//     loadDoctorData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = async (file) => {
//     const newPicUrl = URL.createObjectURL(file);
//     setDoctorUser((prev) => ({ ...prev, profilePic: newPicUrl }));
//     console.log('Profile picture changed locally. (Doctor)');
//   };

//   const handleNavigationChange = (segment) => {
//     if (segment.startsWith('medical-records-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('medical-records-detail');
//     } else if (segment.startsWith('prescriptions-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('prescriptions-detail');
//     } else if (segment.startsWith('diagnostic-tests-detail/')) {
//       const medicalRecordId = segment.split('/')[1];
//       setSelectedMedicalRecordId(medicalRecordId);
//       setCurrentSegment('diagnostic-tests-detail');
//     }
//     else {
//       setSelectedMedicalRecordId(null);
//       setCurrentSegment(segment.startsWith('/') ? segment.slice(1) : segment);
//     }
//     console.log('Navigating to segment:', segment);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           width: '100vw',
//           height: '100vh',
//           p: 0,
//           m: 0,
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden',
//         }}
//       >
//         <AppProvider
//           navigation={DOCTOR_NAVIGATION}
//           router={{
//             pathname: currentSegment,
//             navigate: handleNavigationChange,
//           }}
//           theme={theme}
// branding={{
// Â  Â  Â  title: "Sarvotham Spine Care",
// Â  Â  Â  logo: (
// Â  Â  Â  Â  <img
// Â  Â  Â  Â  Â  src="https://imgs.search.brave.com/I3lfsdq9k6y3txb8rAS9ukU5dwws1WPVNNQq7NQEIXI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ibHVlLW1lZGlj/YWwtZW1lcmdlbmN5/LXN0YXItbGlmZS13/aXRoLXdoaXRlLWNh/ZHVjZXVzLW1lZGlj/YWwtc3ltYm9sLXdo/aXRlLWJhY2tncm91/bmQtM2QtcmVuZGVy/aW5nXzQ3NjYxMi0x/NTA1NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
// Â  Â  Â  Â  Â  alt="Hospital Logo"
// Â  Â  Â  Â  Â  style={{ height: '40px' }}
// Â  Â  Â  Â  />
// Â  Â  Â  ),
// Â  Â  Â  onClick: () => handleNavigate(''),
// Â  Â  }}        >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => (
//                 <DoctorNavigationMenu
//                   currentSegment={currentSegment}
//                   onNavigate={handleNavigationChange}
//                 />
//               ),
//               toolbarAccount: () => (
//                 <DoctorProfileMenu
//                   user={doctorUser}
//                   onLogout={handleLogout}
//                   onProfilePicChange={handleProfilePicChange}
//                   loading={loadingDoctorData}
//                 />
//               ),
//             }}
//           >
//             <DoctorDashboardPageContent
//               currentSegment={currentSegment}
//               loading={loadingDoctorData}
//               doctorUser={doctorUser}
//               selectedMedicalRecordId={selectedMedicalRecordId}
//               onNavigate={handleNavigationChange}
//             />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// DoctorDashboard.propTypes = {
//   // window: PropTypes.func,
// };

// export default DoctorDashboard;
// DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import DoctorDashboardOverview from './DoctorDashboardOverview';
import DoctorAppointments from './DoctorAppointments';
import DoctorTodayAppointments from './DoctorTodayAppointments';
import DoctorMySchedule from './DoctorMySchedule';
import DoctorMedicalRecordsPage from './DoctorMedicalRecordsPage';
import DoctorPrescriptionsPage from './DoctorPrescriptionsPage';
import DoctorDiagnosticTestsPage from './DoctorDiagnosticTestsPage';
import DoctorPersonalDetails from './DoctorPersonalDetails';

import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage';

import DoctorProfileMenu from './DoctorProfileMenu';

// Navigation array
const DOCTOR_NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'appointments', title: 'All Appointments', icon: <EventNoteIcon /> },
  { segment: 'today-appointments', title: "Today's Appointments", icon: <DateRangeIcon /> },
  { segment: 'my-schedule', title: 'My Schedule', icon: <CalendarTodayIcon /> },
  { segment: 'personal-details', title: 'Personal Details', icon: <PersonIcon /> },
  { segment: 'about-us', title: 'About Us', icon: <InfoIcon /> },
  { segment: 'contact-us', title: 'Contact Us', icon: <ContactMailIcon /> },
];

// Theme config
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', contrastText: '#fff' },
    secondary: { main: '#388e3c' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
    error: { main: '#d32f2f' },
    text: { primary: '#202124', secondary: '#5f6368' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    body1: { fontSize: '1rem' },
  },
});

// Navigation Sidebar Component
function DoctorNavigationMenu({ currentSegment, onNavigate }) {
  return (
    <List sx={{ width: 240, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider' }}>
      {DOCTOR_NAVIGATION.map((item) => (
        <ListItemButton key={item.segment} selected={currentSegment === item.segment} onClick={() => onNavigate(item.segment)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      ))}
    </List>
  );
}

DoctorNavigationMenu.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

// Dashboard Content Routing Component
function DoctorDashboardPageContent({ currentSegment, loading, doctorUser, selectedAppointment, onNavigate }) {
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  switch (currentSegment) {
    case 'dashboard':
      return <DoctorDashboardOverview doctorUser={doctorUser} />;
    case 'appointments':
      return <DoctorAppointments doctorUser={doctorUser} />;
    case 'today-appointments':
      return (
        <DoctorTodayAppointments
          doctorUser={doctorUser}
          onViewMedicalRecords={(appointment) => onNavigate(`medical-records-detail/${appointment.medicalRecordId}`, appointment)}
        />
      );
    case 'medical-records-detail': {
      if (selectedAppointment && selectedAppointment.medicalRecordId) {
        return (
          <DoctorMedicalRecordsPage
            medicalRecordId={selectedAppointment.medicalRecordId}
            appointment={selectedAppointment}
            onBack={() => onNavigate('today-appointments')}
            onNavigate={onNavigate}
          />
        );
      }
      return <Alert severity="error">Medical Record or Appointment ID not found.</Alert>;
    }
    case 'prescriptions-detail':
      if (selectedAppointment && selectedAppointment.medicalRecordId) {
        return <DoctorPrescriptionsPage medicalRecordId={selectedAppointment.medicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedAppointment.medicalRecordId}`)} />;
      }
      return <Alert severity="error">Medical Record ID not found for prescriptions.</Alert>;
    case 'diagnostic-tests-detail':
      if (selectedAppointment && selectedAppointment.medicalRecordId) {
        return <DoctorDiagnosticTestsPage medicalRecordId={selectedAppointment.medicalRecordId} onBack={() => onNavigate(`medical-records-detail/${selectedAppointment.medicalRecordId}`)} />;
      }
      return <Alert severity="error">Medical Record ID not found for diagnostic tests.</Alert>;
    case 'my-schedule':
      return <DoctorMySchedule doctorUser={doctorUser} />;
    case 'personal-details':
      return <DoctorPersonalDetails doctorUser={doctorUser} />;
    case 'about-us':
      return <AboutUsPage />;
    case 'contact-us':
      return <ContactUsPage />;
    default:
      return (
        <Box
          sx={{
            py: 6,
            px: 3,
            maxWidth: 1300,
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
            Welcome to Doctor Dashboard
          </Typography>

          <Box
            component="img"
            src="https://max-website20-images.s3.ap-south-1.amazonaws.com/Types_of_Doctors_1c5efbe677.jpg"
            alt="Page Not Found Illustration"
            sx={{ width: '100%', maxWidth: 900, borderRadius: 2, mb: 2 }}
          />

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Sorry, the page you are looking for does not exist or may have been moved. Please check the URL or use the dashboard
            features below to navigate to other sections.
          </Typography>

          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '1100px', maxWidth: 480, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'blue', mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <List disablePadding>
              <ListItemButton component="a" href="/dashboard">
                <ListItemText primary="Dashboard Home" />
              </ListItemButton>
              <ListItemButton component="a" href="/sample-management">
                <ListItemText primary="Sample Management" />
              </ListItemButton>
              <ListItemButton component="a" href="/test-results">
                <ListItemText primary="Test Results" />
              </ListItemButton>
              <ListItemButton component="a" href="/quality-control">
                <ListItemText primary="Quality Control" />
              </ListItemButton>
              <ListItemButton component="a" href="/settings">
                <ListItemText primary="Settings" />
              </ListItemButton>
            </List>
          </Box>

          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '1100px', maxWidth: 1000 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              Frequently Asked Questions
            </Typography>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'medium' }}>
                  How do I navigate back to the dashboard?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Use the â€œDashboard Homeâ€ link above, or click the logo in the top navigation bar to return to the main dashboard.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'medium' }}>
                  What if I continue to see this error?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Please check the URL for typos. If problems persist, contact your system administrator or support team for assistance.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'medium' }}>
                  Can I report a broken link or bug in the system?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Yes, please use the Contact Us section in the dashboard to report issues. Your feedback helps improve the system.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      );
  }
}

DoctorDashboardPageContent.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  selectedAppointment: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
};

// Main DoctorDashboard Component
const DoctorDashboard = () => {
  const [currentSegment, setCurrentSegment] = React.useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [doctorUser, setDoctorUser] = React.useState({
    userId: '',
    name: '',
    email: '',
    profilePic: '',
  });
  const [loadingDoctorData, setLoadingDoctorData] = React.useState(true);

  React.useEffect(() => {
    const loadDoctorData = async () => {
      setLoadingDoctorData(true);

      const storedUserId = sessionStorage.getItem('userId');
      const storedUsername = sessionStorage.getItem('username');
      const storedEmail = sessionStorage.getItem('email');
      const storedProfilePic = sessionStorage.getItem('profilePic');

      if (storedUserId && storedUsername && storedEmail) {
        setDoctorUser({
          userId: storedUserId,
          name: storedUsername,
          email: storedEmail,
          profilePic: storedProfilePic || 'https://placehold.co/200x200/f0f0f0/cccccc?text=Doctor',
        });
      } else {
        window.location.href = '/login';
      }
      setLoadingDoctorData(false);
    };
    loadDoctorData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleProfilePicChange = (file) => {
    const newPicUrl = URL.createObjectURL(file);
    setDoctorUser((prev) => ({ ...prev, profilePic: newPicUrl }));
  };
const handleNavigationChange = (segment, appointment = null) => {
  // For medical records, appointment must be provided and must have medicalRecordId
  if (segment.startsWith('medical-records-detail/')) {
    if (appointment) {
      setSelectedAppointment(appointment);
    } else {
      // If appointment not provided, but last selectedAppointment is valid, reuse
      setSelectedAppointment(selectedAppointment);
    }
    setCurrentSegment('medical-records-detail');
  } 
  // For prescriptions
  else if (segment.startsWith('prescriptions-detail/')) {
    const id = segment.split('/')[1];
    // Always set appointment
    if (appointment) {
      setSelectedAppointment({ ...appointment, medicalRecordId: id });
    } else if (!selectedAppointment || selectedAppointment.medicalRecordId !== id) {
      setSelectedAppointment({ medicalRecordId: id });
    }
    setCurrentSegment('prescriptions-detail');
  }
  // For diagnostic tests
  else if (segment.startsWith('diagnostic-tests-detail/')) {
    const id = segment.split('/')[1];
    if (appointment) {
      setSelectedAppointment({ ...appointment, medicalRecordId: id });
    } else if (!selectedAppointment || selectedAppointment.medicalRecordId !== id) {
      setSelectedAppointment({ medicalRecordId: id });
    }
    setCurrentSegment('diagnostic-tests-detail');
  }
  // Main/other segments
  else {
    setSelectedAppointment(null);
    setCurrentSegment(segment.startsWith('/') ? segment.slice(1) : segment);
  }
};


  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          p: 0,
          m: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <AppProvider
          navigation={DOCTOR_NAVIGATION}
          router={{ pathname: currentSegment, navigate: handleNavigationChange }}
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
            onClick: () => handleNavigationChange('dashboard'),
          }}
        >
          <DashboardLayout
            sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
            slots={{
              drawerContent: () => <DoctorNavigationMenu currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
              toolbarAccount: () => (
                <DoctorProfileMenu
                  user={doctorUser}
                  onLogout={handleLogout}
                  onProfilePicChange={handleProfilePicChange}
                  loading={loadingDoctorData}
                />
              ),
            }}
          >
            <DoctorDashboardPageContent
              currentSegment={currentSegment}
              loading={loadingDoctorData}
              doctorUser={doctorUser}
              selectedAppointment={selectedAppointment}
              onNavigate={handleNavigationChange}
            />
          </DashboardLayout>
        </AppProvider>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorDashboard;
