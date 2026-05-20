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
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import MedicationIcon from '@mui/icons-material/Medication';
// import HealingIcon from '@mui/icons-material/Healing';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // Fixed imports without trailing spaces and added missing:
// import NurseDashboardOverview from './NurseDashboardOverview';
// import NursePatientCare from './NursePatientCare';   // Added missing
// import NursePatientRecords from './NursePatientRecords';
// import NurseSchedule from './NurseSchedule';
// import NurseMedication from './NurseMedication';
// //import NurseVitals from './NurseVitals';             // Added missing
// import NurseSettings from './NurseSettings';


// // Utils for avatar background color and initials
// function stringToColor(name) {
//   let hash = 0;
//   for (let i = 0; i < name.length; i += 1) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'US';
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default User') },
//     children: initials,
//   };
// }

// // Navigation items for sidebar
// const NURSE_NAVIGATION = [
//   { kind: 'header', title: 'Nurse Navigation' },
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'patient-care', title: 'Patient Care', icon: <PeopleOutlineIcon /> },
//   { segment: 'patient-records', title: 'Patient Records', icon: <AssignmentIcon /> },
//   { segment: 'schedule', title: 'My Schedule', icon: <EventNoteIcon /> },
//   { segment: 'medication', title: 'Medication Admin.', icon: <MedicationIcon /> },
//   { segment: 'vitals', title: 'Vitals & Obs.', icon: <HealingIcon /> },
//   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// // Material UI theme, kept same as your original
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#1976d2', contrastText: '#fff' },
//     secondary: { main: '#388e3c' },
//     background: { default: '#f5f7fa', paper: '#fff' },
//     error: { main: '#d32f2f' },
//     text: { primary: '#202124', secondary: '#5f6368' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h6: { fontWeight: 600, fontSize: '1.25rem' },
//     body1: { fontSize: '1rem' },
//   },
//   components: {
//     MuiTypography: { styleOverrides: { root: { lineHeight: 1.5 } } },
//   },
// });

// // Profile menu with logout and profile picture upload
// function NurseProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = e => setAnchorEl(e.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleFileChange = e => {
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
//           sx: { mt: 1.5, minWidth: 240, p: 2, boxShadow: 'rgb(0 0 0 / 0.2) 0px 2px 8px' },
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
//             <Typography variant="h6" noWrap>{user.name}</Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
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

//         <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
//           <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// NurseProfileMenu.propTypes = {
//   user: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     profilePic: PropTypes.string, 
//   }).isRequired,
//   onLogout: PropTypes.func.isRequired,
//   onProfilePicChange: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
// };


// // Main content renderer for each segment
// function NurseDashboardPageContent({ currentSegment, loading, nurse }) {
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
//     case 'dashboard': return <NurseDashboardOverview nurse={nurse} />;
//     case 'patient-care': return <NursePatientCare nurse={nurse} />;
//     case 'patient-records': return <NursePatientRecords nurse={nurse} />;
//     case 'schedule': return <NurseSchedule nurse={nurse} />;
//     case 'medication': return <NurseMedication nurse={nurse} />;
//     case 'vitals': return <NurseVitals nurse={nurse} />;
//     case 'settings': return <NurseSettings nurse={nurse} />;
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
//             boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom>Page Not Found</Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// NurseDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   nurse: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };


// // Sidebar navigation component
// function SidebarNavigation({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper' }}>
//       {NURSE_NAVIGATION.map((item, idx) =>
//         item.kind === 'header' ? (
//           <Typography key={idx} variant="subtitle2" sx={{ p: 2, color: 'text.secondary', userSelect: 'none' }}>
//             {item.title}
//           </Typography>
//         ) : (
//           <ListItemButton
//             key={item.segment}
//             selected={currentSegment === item.segment}
//             onClick={() => onNavigate(item.segment)}
//             sx={{ userSelect: 'none' }}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.title} />
//           </ListItemButton>
//         )
//       )}
//     </List>
//   );
// }

// SidebarNavigation.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };


// // Main NurseDashboard component
// export const NurseDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');

//   const [nurseUser, setNurseUser] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     profilePic: '',
//   });
//   const [loadingNurseData, setLoadingNurseData] = useState(true);

//   useEffect(() => {
//     const loadNurseData = async () => {
//       setLoadingNurseData(true);

//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setNurseUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-nurse.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }

//       setLoadingNurseData(false);
//     };

//     loadNurseData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = async (file) => {
//     const newPicUrl = URL.createObjectURL(file);
//     setNurseUser((prev) => ({ ...prev, profilePic: newPicUrl }));

//     // Here you can add your upload logic to backend if needed
//   };

//   // Navigation state update + debug log
//   const handleNavigationChange = (segment) => {
//     console.log('Navigating to:', segment);
//     setCurrentSegment(segment);
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
//           navigation={NURSE_NAVIGATION}
//           router={{
//             pathname: currentSegment,
//             navigate: handleNavigationChange,
//           }}
//           theme={theme}
//           branding={{ title: "Sarvotham's Spine Care - Nurse" }}
//         >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
//               toolbarAccount: () => (
//                 <NurseProfileMenu
//                   user={nurseUser}
//                   onLogout={handleLogout}
//                   onProfilePicChange={handleProfilePicChange}
//                   loading={loadingNurseData}
//                 />
//               ),
//             }}
//           >
//             <NurseDashboardPageContent currentSegment={currentSegment} loading={loadingNurseData} nurse={nurseUser} />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// NurseDashboard.propTypes = {
//   // No props here because component uses sessionStorage login data
// };

// export default NurseDashboard;
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
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import MedicationIcon from '@mui/icons-material/Medication';
// import HealingIcon from '@mui/icons-material/Healing';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// import NurseDashboardOverview from './NurseDashboardOverview';
// import NursePatientCare from './NursePatientCare';
// import NursePatientRecords from './NursePatientRecords';
// import NurseSchedule from './NurseSchedule';
// import NurseMedication from './NurseMedication';
// import NurseVitals from './NurseVitals';
// import NurseSettings from './NurseSettings';

// // Utility functions for avatar color and initials
// function stringToColor(name) {
//   let hash = 0;
//   for (let i = 0; i < name.length; i += 1) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   return color;
// }

// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'US';
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default User') },
//     children: initials,
//   };
// }

// // Navigation items for sidebar
// const NURSE_NAVIGATION = [
//   { kind: 'header', title: 'Nurse Navigation' },
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'patient-care', title: 'Patient Care', icon: <PeopleOutlineIcon /> },
//   { segment: 'patient-records', title: 'Patient Records', icon: <AssignmentIcon /> },
//   { segment: 'schedule', title: 'My Schedule', icon: <EventNoteIcon /> },
//   { segment: 'medication', title: 'Medication Admin.', icon: <MedicationIcon /> },
//   { segment: 'vitals', title: 'Vitals & Obs.', icon: <HealingIcon /> },
//   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// // Material UI theme configuration
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#1976d2', contrastText: '#fff' },
//     secondary: { main: '#388e3c' },
//     background: { default: '#f5f7fa', paper: '#fff' },
//     error: { main: '#d32f2f' },
//     text: { primary: '#202124', secondary: '#5f6368' },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h6: { fontWeight: 600, fontSize: '1.25rem' },
//     body1: { fontSize: '1rem' },
//   },
//   components: {
//     MuiTypography: { styleOverrides: { root: { lineHeight: 1.5 } } },
//   },
// });

// // Profile menu component
// function NurseProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = e => setAnchorEl(e.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleFileChange = e => {
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
//           sx: { mt: 1.5, minWidth: 240, p: 2, boxShadow: 'rgb(0 0 0 / 0.2) 0px 2px 8px' },
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
//             <Typography variant="h6" noWrap>{user.name}</Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
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

//         <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
//           <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

// NurseProfileMenu.propTypes = {
//   user: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     profilePic: PropTypes.string,
//   }).isRequired,
//   onLogout: PropTypes.func.isRequired,
//   onProfilePicChange: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
// };

// // Page content based on current segment
// function NurseDashboardPageContent({ currentSegment, loading, nurse }) {
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
//     case 'dashboard': return <NurseDashboardOverview nurse={nurse} />;
//     case 'patient-care': return <NursePatientCare nurse={nurse} />;
//     case 'patient-records': return <NursePatientRecords nurse={nurse} />;
//     case 'schedule': return <NurseSchedule nurse={nurse} />;
//     case 'medication': return <NurseMedication nurse={nurse} />;
//     case 'vitals': return <NurseVitals nurse={nurse} />;
//     case 'settings': return <NurseSettings nurse={nurse} />;
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
//             boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom>Page Not Found</Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// NurseDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   nurse: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// // Sidebar with navigation items
// function SidebarNavigation({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper' }}>
//       {NURSE_NAVIGATION.map((item, idx) =>
//         item.kind === 'header' ? (
//           <Typography key={idx} variant="subtitle2" sx={{ p: 2, color: 'text.secondary', userSelect: 'none' }}>
//             {item.title}
//           </Typography>
//         ) : (
//           <ListItemButton
//             key={item.segment}
//             selected={currentSegment === item.segment}
//             onClick={() => onNavigate(item.segment)}
//             sx={{ userSelect: 'none' }}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.title} />
//           </ListItemButton>
//         )
//       )}
//     </List>
//   );
// }

// SidebarNavigation.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// // Main NurseDashboard component
// export const NurseDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');

//   const [nurseUser, setNurseUser] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     profilePic: '',
//   });
//   const [loadingNurseData, setLoadingNurseData] = useState(true);

//   useEffect(() => {
//     const loadNurseData = async () => {
//       setLoadingNurseData(true);

//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setNurseUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-nurse.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }

//       setLoadingNurseData(false);
//     };

//     loadNurseData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = async (file) => {
//     const newPicUrl = URL.createObjectURL(file);
//     setNurseUser((prev) => ({ ...prev, profilePic: newPicUrl }));
//     // Add backend upload logic here if needed
//   };

//   const handleNavigationChange = (segment) => {
//     console.log('Navigating to:', segment);
//     setCurrentSegment(segment);
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
//           navigation={NURSE_NAVIGATION}
//           router={{
//             pathname: currentSegment,
//             navigate: handleNavigationChange,
//           }}
//           theme={theme}
//           branding={{ title: "Sarvotham's Spine Care - Nurse" }}
//         >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
//               toolbarAccount: () => (
//                 <NurseProfileMenu
//                   user={nurseUser}
//                   onLogout={handleLogout}
//                   onProfilePicChange={handleProfilePicChange}
//                   loading={loadingNurseData}
//                 />
//               ),
//             }}
//           >
//             <NurseDashboardPageContent currentSegment={currentSegment} loading={loadingNurseData} nurse={nurseUser} />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// NurseDashboard.propTypes = {
//   // No props expected since it derives user from sessionStorage
// };

// export default NurseDashboard;
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
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CircularProgress from '@mui/material/CircularProgress';

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import MedicationIcon from '@mui/icons-material/Medication';
// import HealingIcon from '@mui/icons-material/Healing';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// import NurseDashboardOverview from './NurseDashboardOverview';
// import NursePatientCare from './NursePatientCare';
// import NursePatientRecords from './NursePatientRecords';
// import NurseSchedule from './NurseSchedule';
// import NurseMedication from './NurseMedication';
// import NurseVitals from './NurseVitals';
// import NurseSettings from './NurseSettings';

// // Utility: Generate consistent color for avatar background based on name string
// function stringToColor(name) {
//     let hash = 0;
//     for (let i = 0; i < name.length; i += 1) {
//         hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     let color = '#';
//     for (let i = 0; i < 3; i += 1) {
//         const value = (hash >> (i * 8)) & 0xff;
//         color += `00${value.toString(16)}`.slice(-2);
//     }
//     return color;
// }

// // Utility: Get initials and style for avatar
// function stringAvatar(name) {
//     const initials = name
//         ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//         : 'US';
//     return {
//         sx: { bgcolor: stringToColor(name || 'Default User') },
//         children: initials,
//     };
// }

// // Navigation items - must match case string used in the switch for rendering
// // The 'Nurse Navigation' header has been removed.
// const NURSE_NAVIGATION = [
//     { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//     { segment: 'patient-care', title: 'Consultation Fees', icon: <PeopleOutlineIcon /> },
//     { segment: 'patient-records', title: 'Manage Vitals for Patients', icon: <AssignmentIcon /> },
//     { segment: 'schedule', title: 'My Schedule', icon: <EventNoteIcon /> },
//     { segment: 'medication', title: 'Medication Admin.', icon: <MedicationIcon /> },
//     { segment: 'vitals', title: 'Vitals & Obs.', icon: <HealingIcon /> },
//     { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// // Material-UI theme object
// const theme = createTheme({
//     palette: {
//         mode: 'light',
//         primary: { main: '#1976d2', contrastText: '#fff' },
//         secondary: { main: '#388e3c' },
//         background: { default: '#f5f7fa', paper: '#fff' },
//         error: { main: '#d32f2f' },
//         text: { primary: '#202124', secondary: '#5f6368' },
//     },
//     typography: {
//         fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//         h6: { fontWeight: 600, fontSize: '1.25rem' },
//         body1: { fontSize: '1rem' },
//     },
//     components: {
//         MuiTypography: { styleOverrides: { root: { lineHeight: 1.5 } } },
//     },
// });

// // Profile menu component
// function NurseProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);

//     const handleOpen = e => setAnchorEl(e.currentTarget);
//     const handleClose = () => setAnchorEl(null);

//     const handleFileChange = e => {
//         if (e.target.files && e.target.files[0]) {
//             onProfilePicChange(e.target.files[0]);
//             handleClose();
//         }
//     };

//     if (loading) {
//         return (
//             <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <CircularProgress size={24} color="inherit" />
//             </Box>
//         );
//     }

//     return (
//         <>
//             <Tooltip title="Open Profile Menu">
//                 <IconButton
//                     onClick={handleOpen}
//                     size="small"
//                     sx={{ ml: 2 }}
//                     aria-controls={open ? 'profile-menu' : undefined}
//                     aria-haspopup="true"
//                     aria-expanded={open ? 'true' : undefined}
//                     aria-label="User profile menu"
//                 >
//                     {user.profilePic ? (
//                         <Avatar alt={user.name} src={user.profilePic} sx={{ width: 40, height: 40 }} />
//                     ) : (
//                         <Avatar {...stringAvatar(user.name)} sx={{ width: 40, height: 40 }} />
//                     )}
//                 </IconButton>
//             </Tooltip>

//             <Menu
//                 id="profile-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleClose}
//                 onClick={handleClose}
//                 PaperProps={{
//                     elevation: 4,
//                     sx: { mt: 1.5, minWidth: 240, p: 2, boxShadow: 'rgb(0 0 0 / 0.2) 0px 2px 8px' },
//                 }}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//             >
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     {user.profilePic ? (
//                         <Avatar alt={user.name} src={user.profilePic} sx={{ width: 64, height: 64, mr: 2 }} />
//                     ) : (
//                         <Avatar {...stringAvatar(user.name)} sx={{ width: 64, height: 64, mr: 2 }} />
//                     )}
//                     <Box>
//                         <Typography variant="h6" noWrap>{user.name}</Typography>
//                         <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
//                     </Box>
//                 </Box>

//                 <MenuItem>
//                     <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%' }}>
//                         Change Profile Picture
//                     </label>
//                     <input
//                         id="upload-profile-pic"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                         style={{ display: 'none' }}
//                     />
//                 </MenuItem>

//                 <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
//                     <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//             </Menu>
//         </>
//     );
// }

// NurseProfileMenu.propTypes = {
//     user: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         email: PropTypes.string.isRequired,
//         profilePic: PropTypes.string,
//     }).isRequired,
//     onLogout: PropTypes.func.isRequired,
//     onProfilePicChange: PropTypes.func.isRequired,
//     loading: PropTypes.bool,
// };

// // Page content renderer based on current segment
// function NurseDashboardPageContent({ currentSegment, loading, nurse }) {
//     if (loading) {
//         return (
//             <Box
//                 sx={{
//                     width: '100%',
//                     height: '100%',
//                     minHeight: '100vh',
//                     minWidth: '100vw',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     p: 0,
//                     m: 0,
//                 }}
//             >
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     switch (currentSegment) {
//         case 'dashboard': return <NurseDashboardOverview nurse={nurse} />;
//         case 'patient-care': return <NursePatientCare nurse={nurse} />;
//         case 'patient-records': return <NursePatientRecords nurse={nurse} />;
//         case 'schedule': return <NurseSchedule nurse={nurse} />;
//         case 'medication': return <NurseMedication nurse={nurse} />;
//         case 'vitals': return <NurseVitals nurse={nurse} />;
//         case 'settings': return <NurseSettings nurse={nurse} />;
//         default:
//             return (
//                 <Box
//                     sx={{
//                         py: 6,
//                         px: 3,
//                         maxWidth: 960,
//                         mx: 'auto',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         bgcolor: '#fff',
//                         borderRadius: 2,
//                         boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
//                     }}
//                 >
//                     <Typography variant="h4" gutterBottom>Nurs</Typography>
//                     <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//                         Rambabu
//                     </Typography>
//                 </Box>
//             );
//     }
// }

// NurseDashboardPageContent.propTypes = {
//     currentSegment: PropTypes.string.isRequired,
//     loading: PropTypes.bool,
//     nurse: PropTypes.shape({
//         userId: PropTypes.string,
//         name: PropTypes.string,
//         email: PropTypes.string,
//         profilePic: PropTypes.string,
//     }),
// };

// // Sidebar navigation component
// function SidebarNavigation({ currentSegment, onNavigate }) {
//     return (
//         <List sx={{ width: 240, bgcolor: 'background.paper' }}>
//             {NURSE_NAVIGATION.map((item, idx) =>
//                 item.kind === 'header' ? (
//                     // The navigation header has been removed, so this block will not be rendered.
//                     null
//                 ) : (
//                     <ListItemButton
//                         key={item.segment}
//                         selected={currentSegment === item.segment}
//                         onClick={() => onNavigate(item.segment)}
//                         sx={{ userSelect: 'none' }}
//                     >
//                         <ListItemIcon>{item.icon}</ListItemIcon>
//                         <ListItemText primary={item.title} />
//                     </ListItemButton>
//                 )
//             )}
//         </List>
//     );
// }

// SidebarNavigation.propTypes = {
//     currentSegment: PropTypes.string.isRequired,
//     onNavigate: PropTypes.func.isRequired,
// };

// // Main NurseDashboard component tying everything together
// export const NurseDashboard = () => {
//     const [currentSegment, setCurrentSegment] = useState('dashboard');

//     const [nurseUser, setNurseUser] = useState({
//         userId: '',
//         name: '',
//         email: '',
//         profilePic: '',
//     });
//     const [loadingNurseData, setLoadingNurseData] = useState(true);

//     // Load nurse user data from sessionStorage at mount
//     useEffect(() => {
//         const loadNurseData = async () => {
//             setLoadingNurseData(true);

//             const storedUserId = sessionStorage.getItem('userId');
//             const storedUsername = sessionStorage.getItem('username');
//             const storedEmail = sessionStorage.getItem('email');
//             const storedProfilePic = sessionStorage.getItem('profilePic');

//             if (storedUserId && storedUsername && storedEmail) {
//                 setNurseUser({
//                     userId: storedUserId,
//                     name: storedUsername,
//                     email: storedEmail,
//                     profilePic: storedProfilePic || '/default-nurse.png', // Corrected URL
//                 });
//             } else {
//                 window.location.href = '/login';
//             }
//             setLoadingNurseData(false);
//         };
//         loadNurseData();
//     }, []);

//     // Logout function
//     const handleLogout = () => {
//         sessionStorage.clear();
//         window.location.href = '/login';
//     };

//     // Handle profile picture change (client-side preview)
//     const handleProfilePicChange = (file) => {
//         const newPicUrl = URL.createObjectURL(file);
//         setNurseUser((prev) => ({ ...prev, profilePic: newPicUrl }));
//         // Add server upload logic here if needed
//     };

//     // Navigation change handler
//     const handleNavigationChange = (segment) => {
//         // Ensure the segment does not start with a '/' when setting the state
//         const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
//         console.log('Navigating to segment:', normalizedSegment); // debug log
//         setCurrentSegment(normalizedSegment);
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <Box
//                 sx={{
//                     width: '100vw',
//                     height: '100vh',
//                     p: 0,
//                     m: 0,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     overflow: 'hidden',
//                 }}
//             >
//                 <AppProvider
//                     navigation={NURSE_NAVIGATION}
//                     router={{
//                         pathname: currentSegment,
//                         navigate: handleNavigationChange,
//                     }}
//                     theme={theme}
//                     branding={{ title: "Sarvotham's Spine Care - Nurse" }}
//                 >
//                     <DashboardLayout
//                         sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//                         slots={{
//                             drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
//                             toolbarAccount: () => (
//                                 <NurseProfileMenu
//                                     user={nurseUser}
//                                     onLogout={handleLogout}
//                                     onProfilePicChange={handleProfilePicChange}
//                                     loading={loadingNurseData}
//                                 />
//                             ),
//                         }}
//                     >
//                         <NurseDashboardPageContent currentSegment={currentSegment} loading={loadingNurseData} nurse={nurseUser} />
//                     </DashboardLayout>
//                 </AppProvider>
//             </Box>
//         </ThemeProvider>
//     );
// };

// NurseDashboard.propTypes = {
//     // No props used, component manages its own state and session data
// };

// export default NurseDashboard;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MedicationIcon from '@mui/icons-material/Medication';
import HealingIcon from '@mui/icons-material/Healing';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import NurseDashboardOverview from './NurseDashboardOverview';
import NursePatientCare from './NursePatientCare';
import NursePatientRecords from './NursePatientRecords';
import NurseSchedule from './NurseSchedule';
import NurseMedication from './NurseMedication';
import NurseVitals from './NurseVitals';
import NurseSettings from './NurseSettings';
import ProfileMenu from './ProfileMenu';

// --- Utility Functions ---
function stringToColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'US';
  return {
    sx: { bgcolor: stringToColor(name || 'Default User') },
    children: initials,
  };
}

// --- Navigation and Theme ---
const NURSE_NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'patient-care', title: 'Consultation Fees', icon: <PeopleOutlineIcon /> },
  { segment: 'patient-records', title: 'Manage Vitals for Patients', icon: <AssignmentIcon /> },
  { segment: 'schedule', title: 'Treatment Details', icon: <EventNoteIcon /> },
  { segment: 'medication', title: 'Our Services', icon: <MedicationIcon /> },
   { segment: 'vitals', title: 'Contact US', icon: <HealingIcon /> },
  // { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
];

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

// --- Main Components ---
function HospitalInfo() {
  const faqs = [
    {
      question: "What services does Sarvotham's Spine Care offer?",
      answer: "We provide expert spine care including consultation, diagnostics, physiotherapy, surgical interventions, and rehabilitation programs tailored to your needs.",
    },
    {
      question: "How can I book an appointment?",
      answer: "Appointments can be booked online through our website or by calling our dedicated patient care helpline.",
    },
    {
      question: "Do you accept insurance?",
      answer: "Yes, we accept most major insurance policies. Please contact our billing department for details.",
    },
  ];

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 6 }, maxWidth: 10000, mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        Welcome to Sarvotham's Spine Care
      </Typography>
      <Grid container spacing={4} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <img src="https://i0.wp.com/www.treatathomes.com/wp-content/uploads/2022/01/reasons-to-choose-home-nurse-1.png?fit=640%2C372&ssl=1" alt="Hospital Front View" style={{ width: '1000px', borderRadius: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }} loading="lazy" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
            Excellence in Spine Care and Rehabilitation
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            At Sarvotham's Spine Care, we specialize in advanced spine diagnostics and treatment, combining cutting-edge technology with compassionate care to restore your health and mobility.
          </Typography>
          <Button variant="contained" color="primary" href="/contact" size="large">
            Contact Us
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, idx) => (
        <Accordion key={idx} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${idx}-content`} id={`panel${idx}-header`}>
            <Typography sx={{ fontWeight: 'medium' }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

function NurseDashboardPageContent({ currentSegment, loading, nurse }) {
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0, m: 0 }}>
        <CircularProgress />
      </Box>
    );
  }

  switch (currentSegment) {
    case 'dashboard': return <NurseDashboardOverview nurse={nurse} />;
    case 'patient-care': return <NursePatientCare nurse={nurse} />;
    case 'patient-records': return <NursePatientRecords nurse={nurse} />;
    case 'schedule': return <NurseSchedule nurse={nurse} />;
    case 'medication': return <NurseMedication nurse={nurse} />;
    case 'vitals': return <NurseVitals nurse={nurse} />;
    case 'settings': return <NurseSettings nurse={nurse} />;
    default: return <HospitalInfo />;
  }
}

NurseDashboardPageContent.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  nurse: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

function SidebarNavigation({ currentSegment, onNavigate }) {
  return (
    <List sx={{ width: 240, bgcolor: 'background.paper' }}>
      {NURSE_NAVIGATION.map(item => (
        <ListItemButton key={item.segment} selected={currentSegment === item.segment} onClick={() => onNavigate(item.segment)} sx={{ userSelect: 'none' }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      ))}
    </List>
  );
}

SidebarNavigation.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export const NurseDashboard = () => {
  const [currentSegment, setCurrentSegment] = useState('dashboard');
  const [nurseUser, setNurseUser] = useState({
    userId: '',
    name: '',
    email: '',
    profilePic: '',
  });
  const [loadingNurseData, setLoadingNurseData] = useState(true);

  useEffect(() => {
    const loadNurseData = async () => {
      setLoadingNurseData(true);
      const storedUserId = sessionStorage.getItem('userId');
      const storedUsername = sessionStorage.getItem('username');
      const storedEmail = sessionStorage.getItem('email');
      const storedProfilePic = sessionStorage.getItem('profilePic');
      const storedPhoneNumber = sessionStorage.getItem('phoneNumber');

      if (storedUserId && storedUsername && storedEmail) {
        if (storedProfilePic) {
          setNurseUser({
            userId: storedUserId,
            name: storedUsername,
            email: storedEmail,
            profilePic: storedProfilePic,
            phoneNumber: storedPhoneNumber,
          });
        } else {
          try {
            const response = await fetch(`http://localhost:2002/api/users/${storedUserId}/image`);
            if (response.ok) {
              const imageBlob = await response.blob();
              const reader = new FileReader();
              reader.readAsDataURL(imageBlob);
              reader.onloadend = () => {
                const base64data = reader.result;
                setNurseUser({
                  userId: storedUserId,
                  name: storedUsername,
                  email: storedEmail,
                  profilePic: base64data,
                  phoneNumber: storedPhoneNumber,
                });
                sessionStorage.setItem('profilePic', base64data);
              };
            } else {
              setNurseUser({
                userId: storedUserId,
                name: storedUsername,
                email: storedEmail,
                profilePic: null,
                phoneNumber: storedPhoneNumber,
              });
            }
          } catch (error) {
            setNurseUser({
              userId: storedUserId,
              name: storedUsername,
              email: storedEmail,
              profilePic: null,
              phoneNumber: storedPhoneNumber,
            });
          }
        }
      } else {
        window.location.href = '/login';
      }
      setLoadingNurseData(false);
    };
    loadNurseData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleProfilePicChange = (newPicUrl) => {
    setNurseUser((prev) => ({ ...prev, profilePic: newPicUrl }));
    sessionStorage.setItem('profilePic', newPicUrl);
  };

  const handleNavigationChange = (segment) => {
    const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
    setCurrentSegment(normalizedSegment);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100vw', height: '100vh', p: 0, m: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppProvider
          navigation={NURSE_NAVIGATION}
          router={{ pathname: currentSegment, navigate: handleNavigationChange }}
          theme={theme}
          branding={{ title: "Sarvotham's Spine Care - Nurse" }}
        >
          <DashboardLayout
            sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
            slots={{
              drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
              toolbarAccount: () => (
                // ✅ CORRECTED: Conditional rendering to prevent the TypeError.
                // This ensures 'ProfileMenu' only renders when 'nurseUser' has a 'userId'.
                !loadingNurseData && nurseUser.userId ? (
                  <ProfileMenu
                    user={nurseUser}
                    onLogout={handleLogout}
                    onProfilePicChange={handleProfilePicChange}
                    loading={loadingNurseData}
                  />
                ) : (
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                )
              ),
            }}
          >
            <NurseDashboardPageContent currentSegment={currentSegment} loading={loadingNurseData} nurse={nurseUser} />
          </DashboardLayout>
        </AppProvider>
      </Box>
    </ThemeProvider>
  );
};

export default NurseDashboard;