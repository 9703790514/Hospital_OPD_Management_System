// // import React, { useState, useEffect } from 'react';
// // import PropTypes from 'prop-types';

// // import Box from '@mui/material/Box';
// // import Typography from '@mui/material/Typography';
// // import Avatar from '@mui/material/Avatar';
// // import Menu from '@mui/material/Menu';
// // import MenuItem from '@mui/material/MenuItem';
// // import IconButton from '@mui/material/IconButton';
// // import Tooltip from '@mui/material/Tooltip';
// // import List from '@mui/material/List';
// // import ListItemButton from '@mui/material/ListItemButton';
// // import ListItemIcon from '@mui/material/ListItemIcon';
// // import ListItemText from '@mui/material/ListItemText';
// // import { createTheme, ThemeProvider } from '@mui/material/styles';
// // import CircularProgress from '@mui/material/CircularProgress';

// // import DashboardIcon from '@mui/icons-material/Dashboard';
// // import ScienceIcon from '@mui/icons-material/Science'; // Sample Management / Lab Tests
// // import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Test Results
// // import BiotechIcon from '@mui/icons-material/Biotech'; // Equipment Management
// // import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Quality Control
// // import ScheduleIcon from '@mui/icons-material/Schedule'; // Schedule
// // import SettingsIcon from '@mui/icons-material/Settings'; // Settings
// // import LogoutIcon from '@mui/icons-material/Logout';

// // import { AppProvider } from '@toolpad/core/AppProvider';
// // import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // // Import Lab Technician specific page components - Ensure these files exist and export default
// // import LabTechnicianDashboardOverview from './LabTechnicianDashboardOverview';
// // import LabTechnicianSampleManagement from './LabTechnicianSampleManagement';
// // import LabTechnicianTestResults from './LabTechnicianTestResults';
// // import LabTechnicianEquipment from './LabTechnicianEquipment';
// // import LabTechnicianQualityControl from './LabTechnicianQualityControl';
// // import LabTechnicianSchedule from './LabTechnicianSchedule';
// // import LabTechnicianSettings from './LabTechnicianSettings';


// // // Utility: Generate consistent color for avatar background based on name string
// // function stringToColor(string) {
// //   let hash = 0;
// //   for (let i = 0; i < string.length; i += 1) {
// //     hash = string.charCodeAt(i) + ((hash << 5) - hash);
// //   }
// //   let color = '#';
// //   for (let i = 0; i < 3; i += 1) {
// //     const value = (hash >> (i * 8)) & 0xff;
// //     color += `00${value.toString(16)}`.slice(-2);
// //   }
// //   return color;
// // }

// // // Utility: Get initials and style for avatar
// // function stringAvatar(name) {
// //   const initials = name
// //     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
// //     : 'US';
// //   return {
// //     sx: { bgcolor: stringToColor(name || 'Default User') },
// //     children: initials,
// //   };
// // }

// // // Define navigation items with segments, titles and icons
// // const LAB_TECHNICIAN_NAVIGATION = [
// //   { kind: 'header', title: 'Lab Navigation' },
// //   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
// //   { segment: 'sample-management', title: 'Sample Management', icon: <ScienceIcon /> },
// //   { segment: 'test-results', title: 'Test Results', icon: <AssignmentTurnedInIcon /> },
// //   { segment: 'equipment', title: 'Equipment', icon: <BiotechIcon /> },
// //   { segment: 'quality-control', title: 'Quality Control', icon: <CheckCircleOutlineIcon /> },
// //   { segment: 'schedule', title: 'My Schedule', icon: <ScheduleIcon /> },
// //   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// // ];

// // // Material-UI theme for consistency in colors and typography
// // const theme = createTheme({
// //   palette: {
// //     mode: 'light',
// //     primary: {
// //       main: '#1976d2', // Calming Blue (hospital-friendly)
// //       contrastText: '#fff',
// //     },
// //     secondary: {
// //       main: '#388e3c', // Green for action / confirmation
// //     },
// //     background: {
// //       default: '#f5f7fa',
// //       paper: '#ffffff',
// //     },
// //     error: {
// //       main: '#d32f2f', // Red for errors/warnings
// //     },
// //     text: {
// //       primary: '#202124',
// //       secondary: '#5f6368',
// //     },
// //   },
// //   typography: {
// //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
// //     h6: {
// //       fontWeight: 600,
// //       fontSize: '1.25rem',
// //     },
// //     body1: {
// //       fontSize: '1rem',
// //     },
// //   },
// //   components: {
// //     MuiTypography: {
// //       styleOverrides: {
// //         root: {
// //           lineHeight: 1.5,
// //         },
// //       },
// //     },
// //   },
// // });

// // // Profile menu component with logout and profile pic change
// // function LabTechnicianProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const open = Boolean(anchorEl);

// //   const handleOpen = (event) => {
// //     setAnchorEl(event.currentTarget);
// //   };
// //   const handleClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleFileChange = (e) => {
// //     if (e.target.files && e.target.files[0]) {
// //       onProfilePicChange(e.target.files[0]);
// //       handleClose(); // Close menu after selection
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //         <CircularProgress size={24} color="inherit" />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <>
// //       <Tooltip title="Open Profile Menu">
// //         <IconButton
// //           onClick={handleOpen}
// //           size="small"
// //           sx={{ ml: 2 }}
// //           aria-controls={open ? 'profile-menu' : undefined}
// //           aria-haspopup="true"
// //           aria-expanded={open ? 'true' : undefined}
// //           aria-label="User profile menu"
// //         >
// //           {user.profilePic ? (
// //             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 40, height: 40 }} />
// //           ) : (
// //             <Avatar {...stringAvatar(user.name)} sx={{ width: 40, height: 40 }} />
// //           )}
// //         </IconButton>
// //       </Tooltip>

// //       <Menu
// //         id="profile-menu"
// //         anchorEl={anchorEl}
// //         open={open}
// //         onClose={handleClose}
// //         onClick={handleClose}
// //         PaperProps={{
// //           elevation: 4,
// //           sx: {
// //             mt: 1.5,
// //             minWidth: 240,
// //             p: 2,
// //             boxShadow:
// //               'rgb(0 0 0 / 0.2) 0px 2px 8px',
// //           },
// //         }}
// //         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
// //         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
// //       >
// //         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //           {user.profilePic ? (
// //             <Avatar alt={user.name} src={user.profilePic} sx={{ width: 64, height: 64, mr: 2 }} />
// //           ) : (
// //             <Avatar {...stringAvatar(user.name)} sx={{ width: 64, height: 64, mr: 2 }} />
// //           )}
// //           <Box>
// //             <Typography variant="h6" noWrap>
// //               {user.name}
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary" noWrap>
// //               {user.email}
// //             </Typography>
// //           </Box>
// //         </Box>

// //         <MenuItem>
// //           <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%' }}>
// //             Change Profile Picture
// //           </label>
// //           <input
// //             id="upload-profile-pic"
// //             type="file"
// //             accept="image/*"
// //             onChange={handleFileChange}
// //             style={{ display: 'none' }}
// //           />
// //         </MenuItem>

// //         <MenuItem
// //           onClick={() => {
// //             onLogout();
// //           }}
// //           sx={{ color: 'error.main' }}
// //         >
// //           <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
// //           Logout
// //         </MenuItem>
// //       </Menu>
// //     </>
// //   );
// // }

// // LabTechnicianProfileMenu.propTypes = {
// //   user: PropTypes.shape({
// //     name: PropTypes.string.isRequired,
// //     email: PropTypes.string.isRequired,
// //     profilePic: PropTypes.string,
// //   }).isRequired,
// //   onLogout: PropTypes.func.isRequired,
// //   onProfilePicChange: PropTypes.func.isRequired,
// //   loading: PropTypes.bool,
// // };

// // // Main page content renderer based on current segment
// // function LabTechnicianDashboardPageContent({ currentSegment, loading, labTechnician }) {
// //   if (loading) {
// //     return (
// //       <Box
// //         sx={{
// //           width: '100%',
// //           height: '100%',
// //           minHeight: '100vh',
// //           minWidth: '100vw',
// //           display: 'flex',
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //           p: 0,
// //           m: 0,
// //         }}
// //       >
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   switch (currentSegment) {
// //     case 'dashboard': return <LabTechnicianDashboardOverview labTechnician={labTechnician} />;
// //     case 'sample-management': return <LabTechnicianSampleManagement labTechnician={labTechnician} />;
// //     case 'test-results': return <LabTechnicianTestResults labTechnician={labTechnician} />;
// //     case 'equipment': return <LabTechnicianEquipment labTechnician={labTechnician} />;
// //     case 'quality-control': return <LabTechnicianQualityControl labTechnician={labTechnician} />;
// //     case 'schedule': return <LabTechnicianSchedule labTechnician={labTechnician} />;
// //     case 'settings': return <LabTechnicianSettings labTechnician={labTechnician} />;
// //     default:
// //       return (
// //         <Box
// //           sx={{
// //             py: 6,
// //             px: 3,
// //             maxWidth: 960,
// //             mx: 'auto',
// //             display: 'flex',
// //             flexDirection: 'column',
// //             alignItems: 'center',
// //             bgcolor: '#fff',
// //             borderRadius: 2,
// //             boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
// //           }}
// //         >
// //           <Typography variant="h4" gutterBottom>Page Not Found</Typography>
// //           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
// //             The page you are looking for does not exist.
// //           </Typography>
// //         </Box>
// //       );
// //   }
// // }

// // LabTechnicianDashboardPageContent.propTypes = {
// //   currentSegment: PropTypes.string.isRequired,
// //   loading: PropTypes.bool,
// //   labTechnician: PropTypes.shape({
// //     userId: PropTypes.string,
// //     name: PropTypes.string,
// //     email: PropTypes.string,
// //     profilePic: PropTypes.string,
// //   }),
// // };

// // // Sidebar navigation listing all segments
// // function SidebarNavigation({ currentSegment, onNavigate }) {
// //   return (
// //     <List sx={{ width: 240, bgcolor: 'background.paper' }}>
// //       {LAB_TECHNICIAN_NAVIGATION.map((item, idx) =>
// //         item.kind === 'header' ? (
// //           <Typography key={idx} variant="subtitle2" sx={{ p: 2, color: 'text.secondary', userSelect: 'none' }}>
// //             {item.title}
// //           </Typography>
// //         ) : (
// //           <ListItemButton
// //             key={item.segment}
// //             selected={currentSegment === item.segment}
// //             onClick={() => onNavigate(item.segment)}
// //             sx={{ userSelect: 'none' }}
// //           >
// //             <ListItemIcon>{item.icon}</ListItemIcon>
// //             <ListItemText primary={item.title} />
// //           </ListItemButton>
// //         )
// //       )}
// //     </List>
// //   );
// // }

// // SidebarNavigation.propTypes = {
// //   currentSegment: PropTypes.string.isRequired,
// //   onNavigate: PropTypes.func.isRequired,
// // };

// // // Main LabTechnicianDashboard component tying everything
// // export const LabTechnicianDashboard = () => {
// //   const [currentSegment, setCurrentSegment] = useState('dashboard');

// //   const [labTechnicianUser, setLabTechnicianUser] = useState({
// //     userId: '',
// //     name: '',
// //     email: '',
// //     profilePic: '',
// //   });
// //   const [loadingLabTechData, setLoadingLabTechData] = useState(true);

// //   useEffect(() => {
// //     const loadLabTechData = async () => {
// //       setLoadingLabTechData(true);

// //       const storedUserId = sessionStorage.getItem('userId');
// //       const storedUsername = sessionStorage.getItem('username');
// //       const storedEmail = sessionStorage.getItem('email');
// //       const storedProfilePic = sessionStorage.getItem('profilePic');

// //       if (storedUserId && storedUsername && storedEmail) {
// //         setLabTechnicianUser({
// //           userId: storedUserId,
// //           name: storedUsername,
// //           email: storedEmail,
// //           profilePic: storedProfilePic || 'http://localhost:2004/default-labtech.png',
// //         });
// //       } else {
// //         window.location.href = '/login';
// //       }
// //       setLoadingLabTechData(false);
// //     };
// //     loadLabTechData();
// //   }, []);

// //   const handleLogout = () => {
// //     sessionStorage.clear();
// //     window.location.href = '/login';
// //   };

// //   const handleProfilePicChange = (file) => {
// //     const newPicUrl = URL.createObjectURL(file);
// //     setLabTechnicianUser((prev) => ({ ...prev, profilePic: newPicUrl }));
// //   };

// //   const handleNavigationChange = (segment) => {
// //     const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
// //     console.log('Navigating to segment:', normalizedSegment);
// //     setCurrentSegment(normalizedSegment);
// //   };

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <Box
// //         sx={{
// //           width: '100vw',
// //           height: '100vh',
// //           p: 0,
// //           m: 0,
// //           display: 'flex',
// //           flexDirection: 'column',
// //           overflow: 'hidden',
// //         }}
// //       >
// //         <AppProvider
// //           navigation={LAB_TECHNICIAN_NAVIGATION}
// //           router={{
// //             pathname: currentSegment,
// //             navigate: handleNavigationChange,
// //           }}
// //           theme={theme}
// //           branding={{ title: 'Sarvotham\'s Spine Care - Lab Technician' }}
// //         >
// //           <DashboardLayout
// //             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
// //             slots={{
// //               drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
// //               toolbarAccount: () => (
// //                 <LabTechnicianProfileMenu
// //                   user={labTechnicianUser}
// //                   onLogout={handleLogout}
// //                   onProfilePicChange={handleProfilePicChange}
// //                   loading={loadingLabTechData}
// //                 />
// //               ),
// //             }}
// //           >
// //             <LabTechnicianDashboardPageContent currentSegment={currentSegment} loading={loadingLabTechData} labTechnician={labTechnicianUser} />
// //           </DashboardLayout>
// //         </AppProvider>
// //       </Box>
// //     </ThemeProvider>
// //   );
// // };

// // LabTechnicianDashboard.propTypes = {
// //   // No props used, component manages its own state and session data
// // };

// // export default LabTechnicianDashboard;
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
// import ScienceIcon from '@mui/icons-material/Science';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import BiotechIcon from '@mui/icons-material/Biotech';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ScheduleIcon from '@mui/icons-material/Schedule';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// import LabTechnicianDashboardOverview from './LabTechnicianDashboardOverview';
// import LabTechnicianSampleManagement from './LabTechnicianSampleManagement';
// import LabTechnicianTestResults from './LabTechnicianTestResults';
// import LabTechnicianEquipment from './LabTechnicianEquipment';
// import LabTechnicianQualityControl from './LabTechnicianQualityControl';
// import LabTechnicianSchedule from './LabTechnicianSchedule';
// import LabTechnicianSettings from './LabTechnicianSettings';
// import LabTechnicianProfileMenu from './LabTechnicianProfileMenu';

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

// function stringAvatar(name) {
//   const initials = name
//     ? name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'US';
//   return {
//     sx: { bgcolor: stringToColor(name || 'Default User') },
//     children: initials,
//   };
// }

// const LAB_TECHNICIAN_NAVIGATION = [
//   { kind: 'header', title: 'Lab Navigation' },
//   { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
//   { segment: 'sample-management', title: 'Sample Management', icon: <ScienceIcon /> },
//   { segment: 'test-results', title: 'Test Results', icon: <AssignmentTurnedInIcon /> },
//   { segment: 'equipment', title: 'Equipment', icon: <BiotechIcon /> },
//   { segment: 'quality-control', title: 'Quality Control', icon: <CheckCircleOutlineIcon /> },
//   { segment: 'schedule', title: 'My Schedule', icon: <ScheduleIcon /> },
//   { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
// ];

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#1976d2', contrastText: '#fff' },
//     secondary: { main: '#388e3c' },
//     background: { default: '#f5f7fa', paper: '#ffffff' },
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

// function LabTechnicianDashboardPageContent({ currentSegment, loading, labTechnician }) {
//   if (loading) {
//     return (
//       <Box sx={{ width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0, m: 0 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }
//   switch (currentSegment) {
//     case 'dashboard': return <LabTechnicianDashboardOverview labTechnician={labTechnician} />;
//     case 'sample-management': return <LabTechnicianSampleManagement labTechnician={labTechnician} />;
//     case 'test-results': return <LabTechnicianTestResults labTechnician={labTechnician} />;
//     case 'equipment': return <LabTechnicianEquipment labTechnician={labTechnician} />;
//     case 'quality-control': return <LabTechnicianQualityControl labTechnician={labTechnician} />;
//     case 'schedule': return <LabTechnicianSchedule labTechnician={labTechnician} />;
//     case 'settings': return <LabTechnicianSettings labTechnician={labTechnician} />;
//     default:
//       return (
//         <Box sx={{ py: 6, px: 3, maxWidth: 960, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)' }}>
//           <Typography variant="h4" gutterBottom>Page Not Found</Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, textAlign: 'center' }}>
//             The page you are looking for does not exist.
//           </Typography>
//         </Box>
//       );
//   }
// }

// LabTechnicianDashboardPageContent.propTypes = {
//   currentSegment: PropTypes.string.isRequired,
//   loading: PropTypes.bool,
//   labTechnician: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//     profilePic: PropTypes.string,
//   }),
// };

// function SidebarNavigation({ currentSegment, onNavigate }) {
//   return (
//     <List sx={{ width: 240, bgcolor: 'background.paper' }}>
//       {LAB_TECHNICIAN_NAVIGATION.map((item, idx) =>
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

// export const LabTechnicianDashboard = () => {
//   const [currentSegment, setCurrentSegment] = useState('dashboard');
//   const [labTechnicianUser, setLabTechnicianUser] = useState({
//     userId: '', name: '', email: '', profilePic: '',
//   });
//   const [loadingLabTechData, setLoadingLabTechData] = useState(true);

//   useEffect(() => {
//     const loadLabTechData = async () => {
//       setLoadingLabTechData(true);
//       const storedUserId = sessionStorage.getItem('userId');
//       const storedUsername = sessionStorage.getItem('username');
//       const storedEmail = sessionStorage.getItem('email');
//       const storedProfilePic = sessionStorage.getItem('profilePic');

//       if (storedUserId && storedUsername && storedEmail) {
//         setLabTechnicianUser({
//           userId: storedUserId,
//           name: storedUsername,
//           email: storedEmail,
//           profilePic: storedProfilePic || 'http://localhost:2004/default-labtech.png',
//         });
//       } else {
//         window.location.href = '/login';
//       }
//       setLoadingLabTechData(false);
//     };
//     loadLabTechData();
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleProfilePicChange = (newPicDataUrl) => {
//     setLabTechnicianUser((prev) => ({ ...prev, profilePic: newPicDataUrl }));
//   };

//   const handleNavigationChange = (segment) => {
//     const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
//     setCurrentSegment(normalizedSegment);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: '100vw', height: '100vh', p: 0, m: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
//         <AppProvider
//           navigation={LAB_TECHNICIAN_NAVIGATION}
//           router={{ pathname: currentSegment, navigate: handleNavigationChange }}
//           theme={theme}
//           branding={{ title: "Sarvotham's Spine Care - Lab Technician" }}
//         >
//           <DashboardLayout
//             sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
//             slots={{
//               drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
//               toolbarAccount: () => (
//                 !loadingLabTechData && labTechnicianUser.userId ? (
//                   <LabTechnicianProfileMenu
//                     user={labTechnicianUser}
//                     onLogout={handleLogout}
//                     onProfilePicChange={handleProfilePicChange}
//                     loading={loadingLabTechData}
//                   />
//                 ) : (
//                   <CircularProgress size={24} sx={{ mr: 2 }} />
//                 )
//               ),
//             }}
//           >
//             <LabTechnicianDashboardPageContent currentSegment={currentSegment} loading={loadingLabTechData} labTechnician={labTechnicianUser} />
//           </DashboardLayout>
//         </AppProvider>
//       </Box>
//     </ThemeProvider>
//   );
// };

// LabTechnicianDashboard.propTypes = {};
// export default LabTechnicianDashboard;
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
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BiotechIcon from '@mui/icons-material/Biotech';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import LabTechnicianDashboardOverview from './LabTechnicianDashboardOverview';
import LabTechnicianSampleManagement from './LabTechnicianSampleManagement';
import LabTechnicianTestResults from './LabTechnicianTestResults';
import LabTechnicianEquipment from './LabTechnicianEquipment';
import LabTechnicianQualityControl from './LabTechnicianQualityControl';
import LabTechnicianSchedule from './LabTechnicianSchedule';
import LabTechnicianSettings from './LabTechnicianSettings';
import LabTechnicianProfileMenu from './LabTechnicianProfileMenu';

// Helper function to generate a color from a string
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Helper function to create an avatar from a user's name
function stringAvatar(name) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'US';
  return {
    sx: { bgcolor: stringToColor(name || 'Default User') },
    children: initials,
  };
}

// Sidebar navigation items
const LAB_TECHNICIAN_NAVIGATION = [

  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'sample-management', title: 'Sample Management', icon: <ScienceIcon /> },
  { segment: 'equipment', title: 'Lab Test Prices', icon: <BiotechIcon /> },
  { segment: 'quality-control', title: 'About US ', icon: <CheckCircleOutlineIcon /> },
  { segment: 'schedule', title: 'Contact US', icon: <ScheduleIcon /> },
  // { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
];

// Custom theme for consistent styling
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4A90E2', contrastText: '#fff' },
    secondary: { main: '#50E3C2' },
    background: { default: '#F8F9FA', paper: '#ffffff' },
    error: { main: '#D0021B' },
    text: { primary: '#333333', secondary: '#777777' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, fontSize: '2.5rem' },
    h6: { fontWeight: 600, fontSize: '1.2rem', color: '#4A90E2' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.9rem' },
  },
  components: {
    MuiTypography: { styleOverrides: { root: { lineHeight: 1.5 } } },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
});

// Main content component for the dashboard
function LabTechnicianDashboardPageContent({ currentSegment, loading, labTechnician }) {
  // Show a loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0, m: 0 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render content based on the current navigation segment
  switch (currentSegment) {
    case 'dashboard': return <LabTechnicianDashboardOverview labTechnician={labTechnician} />;
    case 'sample-management': return <LabTechnicianSampleManagement labTechnician={labTechnician} />;
    case 'test-results': return <LabTechnicianTestResults labTechnician={labTechnician} />;
    case 'equipment': return <LabTechnicianEquipment labTechnician={labTechnician} />;
    case 'quality-control': return <LabTechnicianQualityControl labTechnician={labTechnician} />;
    case 'schedule': return <LabTechnicianSchedule labTechnician={labTechnician} />;
    case 'settings': return <LabTechnicianSettings labTechnician={labTechnician} />;
    default :
      // Default dashboard view with welcome message and cards
      return (
       <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
      >
        Welcome to the Lab Technician Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 6, maxWidth: 760, mx: 'auto', fontSize: { xs: '1rem', md: '1.125rem' } }}
      >
        Your role is crucial to the hospital's operations. Use this dashboard to efficiently manage your daily
        tasks, from handling patient samples to ensuring rigorous quality control and accurate reporting.
      </Typography>

      {/* Feature Cards Grid */}
      <Grid container spacing={4} alignItems="stretch">
        {/* Sample Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://placehold.co/600x400/D4E0F0/4A90E2?text=Sample+Management"
              alt="Sample Management"
              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ bgcolor: 'primary.light', p: 1.25, borderRadius: '50%', mr: 2, display: 'flex' }}>
                  <SvgIcon component={ScienceIcon} sx={{ color: 'primary.main', fontSize: 36 }} />
                </Box>
                <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                  Sample Management
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Track and manage all incoming patient samples with precision. Ensure accurate labeling, proper storage,
                and timely preparation for analysis to maintain sample integrity and workflow efficiency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://placehold.co/600x400/EAF9F6/50E3C2?text=Reporting"
              alt="Test Results"
              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ bgcolor: '#d4f4e2', p: 1.25, borderRadius: '50%', mr: 2, display: 'flex' }}>
                  <SvgIcon component={AssignmentTurnedInIcon} sx={{ color: '#388e3c', fontSize: 36 }} />
                </Box>
                <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                  Test Results
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Efficiently record, verify, and submit test results directly to patient records. Collaborate with doctors to
                ensure diagnostic findings are complete, accurate, and delivered promptly.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Control */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://placehold.co/600x400/F0D4D4/D0021B?text=Quality+Assurance"
              alt="Quality Control"
              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ bgcolor: '#f4d4d4', p: 1.25, borderRadius: '50%', mr: 2, display: 'flex' }}>
                  <SvgIcon component={CheckCircleOutlineIcon} sx={{ color: 'error.main', fontSize: 36 }} />
                </Box>
                <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                  Quality Control
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Monitor and log quality control checks on laboratory equipment and procedures. Ensure compliance with regulatory
                standards to maintain the accuracy and reliability of results.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Divider before FAQ */}
      <Divider sx={{ my: 6 }} />

      {/* FAQ Section */}
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 4 }}>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="faq1-content"
            id="faq1-header"
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              How do I log a new sample into the system?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Navigate to the Sample Management section and select the ‘Add New Sample’ button. Fill in the patient details,
              sample type, and collection date, then submit to add the sample to the tracking system.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="faq2-content"
            id="faq2-header"
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              How can I verify and submit test results?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              In the Test Results section, review pending test results carefully. Use the validation tools provided to cross-check data
              before submitting to the patient’s medical records.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="faq3-content"
            id="faq3-header"
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              What procedures are involved in quality control?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Quality control includes routine checks of lab equipment calibration, reagent validity, and process adherence.
              All findings should be accurately logged with timestamps and technician comments.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="faq4-content"
            id="faq4-header"
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              Who do I contact if I notice irregularities in test results?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Immediately inform your supervisor and the quality assurance team through the Contact Us section. Timely reporting
              ensures patient safety and maintains hospital standards.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Box>
    </Box>
      );
  }
}

LabTechnicianDashboardPageContent.propTypes = {
  currentSegment: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  labTechnician: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

// Sidebar navigation component
function SidebarNavigation({ currentSegment, onNavigate }) {
  return (
    <List sx={{ width: 240, bgcolor: 'background.paper' }}>
      {LAB_TECHNICIAN_NAVIGATION.map((item, idx) =>
        item.kind === 'header' ? (
          <Typography key={idx} variant="subtitle2" sx={{ p: 2, color: 'text.secondary', userSelect: 'none' }}>
            {item.title}
          </Typography>
        ) : (
          <ListItemButton
            key={item.segment}
            selected={currentSegment === item.segment}
            onClick={() => onNavigate(item.segment)}
            sx={{ userSelect: 'none' }}
          >
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

// Main Lab Technician Dashboard component
export const LabTechnicianDashboard = () => {
  const [currentSegment, setCurrentSegment] = useState('dashboard');
  const [labTechnicianUser, setLabTechnicianUser] = useState({
    userId: '', name: '', email: '', profilePic: '',
  });
  const [loadingLabTechData, setLoadingLabTechData] = useState(true);

  // Effect to load user data from session storage on initial render
  useEffect(() => {
    const loadLabTechData = async () => {
      setLoadingLabTechData(true);
      const storedUserId = sessionStorage.getItem('userId');
      const storedUsername = sessionStorage.getItem('username');
      const storedEmail = sessionStorage.getItem('email');
      const storedProfilePic = sessionStorage.getItem('profilePic');

      if (storedUserId && storedUsername && storedEmail) {
        setLabTechnicianUser({
          userId: storedUserId,
          name: storedUsername,
          email: storedEmail,
          profilePic: storedProfilePic || (import.meta.env.VITE_USERS_SERVICE_URL + '/default-labtech.png'),
        });
      } else {
        // Redirect to login if user data is not found
        window.location.href = '/login';
      }
      setLoadingLabTechData(false);
    };
    loadLabTechData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleProfilePicChange = (newPicDataUrl) => {
    setLabTechnicianUser((prev) => ({ ...prev, profilePic: newPicDataUrl }));
  };

  const handleNavigationChange = (segment) => {
    const normalizedSegment = segment.startsWith('/') ? segment.slice(1) : segment;
    setCurrentSegment(normalizedSegment);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100vw', height: '100vh', p: 0, m: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppProvider
          navigation={LAB_TECHNICIAN_NAVIGATION}
          router={{ pathname: currentSegment, navigate: handleNavigationChange }}
          theme={theme}
          branding={{ title: "Sarvotham's Spine Care - Lab Technician" }}
        >
          <DashboardLayout
            sx={{ flex: 1, p: 0, m: 0, height: '100%' }}
            slots={{
              drawerContent: () => <SidebarNavigation currentSegment={currentSegment} onNavigate={handleNavigationChange} />,
              toolbarAccount: () => (
                !loadingLabTechData && labTechnicianUser.userId ? (
                  <LabTechnicianProfileMenu
                    user={labTechnicianUser}
                    onLogout={handleLogout}
                    onProfilePicChange={handleProfilePicChange}
                    loading={loadingLabTechData}
                  />
                ) : (
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                )
              ),
            }}
          >
            <LabTechnicianDashboardPageContent currentSegment={currentSegment} loading={loadingLabTechData} labTechnician={labTechnicianUser} />
          </DashboardLayout>
        </AppProvider>
      </Box>
    </ThemeProvider>
  );
};

LabTechnicianDashboard.propTypes = {};
export default LabTechnicianDashboard;

