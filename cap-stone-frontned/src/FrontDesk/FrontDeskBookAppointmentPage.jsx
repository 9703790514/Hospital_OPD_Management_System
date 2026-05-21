// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Paper,
//   CircularProgress,
//   Alert,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import DescriptionIcon from '@mui/icons-material/Description';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// const FrontDeskBookAppointmentPage = ({ doctorId, patientId, onBack, frontDeskUser }) => {
//   const [doctorName, setDoctorName] = useState('');
//   // Use patientIdInput as the state variable to manage the patient ID field
//   // Initialize it with the patientId prop if provided, otherwise empty
//   const [patientIdInput, setPatientIdInput] = useState(patientId || '');
//   const [appointmentDate, setAppointmentDate] = useState(''); // Will now hold a selected slot string
//   const [appointmentTime, setAppointmentTime] = useState('');
//   const [reasonForVisit, setReasonForVisit] = useState('');
//   const [roomNumber, setRoomNumber] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
//   const [submissionMessage, setSubmissionMessage] = useState('');

//   // New states for availability and existing appointments
//   const [doctorAvailability, setDoctorAvailability] = useState(null);
//   const [loadingAvailability, setLoadingAvailability] = useState(true);
//   const [availabilityError, setAvailabilityError] = useState(null);

//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [existingAppointments, setExistingAppointments] = useState([]);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);
//   const [appointmentsError, setAppointmentsError] = useState(null);

//   // Helper to get day name from date string (e.g., "2025-07-30" -> "WEDNESDAY")
//   const getWeekdayName = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString + 'T00:00:00'); // Add T00:00:00 to avoid timezone issues for date-only input
//     const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
//     return days[date.getDay()];
//   };

//   // Helper to format an Instant (ISO string) into HH:MM
//   const formatInstantToTime = (isoString) => {
//     if (!isoString) return '';
//     return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//   };

//   // Fetch doctor details if doctorId is provided (coming from doctor details page)
//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       if (doctorId) {
//         try {
//           // Doctor details API is on port 2005
//           const response = await fetch(`http://localhost:2005/api/doctors/${doctorId}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch doctor details for pre-fill.');
//           }
//           const data = await response.json();
//           setDoctorName(`Dr. ${data.firstName} ${data.lastName}`);
//         } catch (err) {
//           console.error('Error fetching doctor details:', err);
//           // Don't block the page, just log the error
//         }
//       }
//     };
//     fetchDoctorDetails();
//   }, [doctorId]);

//   // Fetch doctor availability (now also on port 2005)
//   useEffect(() => {
//     const fetchDoctorAvailability = async () => {
//       if (!doctorId) {
//         setAvailabilityError("Doctor ID is not available for fetching availability.");
//         setLoadingAvailability(false);
//         return;
//       }

//       setLoadingAvailability(true);
//       setAvailabilityError(null);

//       try {
//         // Doctor availability API is also on port 2005
//         const response = await fetch(`http://localhost:2005/api/doctor-availabilities/byDoctorId/${doctorId}`);

//         if (response.ok) {
//           const data = await response.json();
//           setDoctorAvailability(data);
//           console.log("Doctor availability fetched:", data);
//         } else if (response.status === 404) {
//           setDoctorAvailability(null); // No availability found
//           console.log("No availability found for this doctor.");
//         } else {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch doctor availability: ${response.status} - ${errorText}`);
//         }
//       } catch (err) {
//         console.error("Error fetching doctor availability:", err);
//         setAvailabilityError(err.message || "Failed to load doctor availability.");
//       } finally {
//         setLoadingAvailability(false);
//       }
//     };

//     fetchDoctorAvailability();
//   }, [doctorId]);

//   // Fetch existing appointments and calculate available time slots (now also on port 2005)
//   useEffect(() => {
//     const updateAvailableSlots = async () => {
//       setAvailableTimeSlots([]); // Clear previous slots
//       setAppointmentTime(''); // Clear selected time

//       if (!appointmentDate || !doctorId || !doctorAvailability) {
//         return; // Cannot determine slots without date, doctor, and availability
//       }

//       setLoadingAppointments(true);
//       setAppointmentsError(null);

//       const selectedDay = getWeekdayName(appointmentDate);
//       const today = new Date();
//       const selectedDateTime = new Date(appointmentDate);

//       // Check if selected date is in the past
//       if (selectedDateTime < today && selectedDateTime.toDateString() !== today.toDateString()) {
//         setAppointmentsError("Cannot book appointments in the past.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Check for leave dates
//       const isLeaveDay = doctorAvailability.leaveDates.some(leaveDateStr => {
//         const leaveDate = new Date(leaveDateStr);
//         return leaveDate.toDateString() === selectedDateTime.toDateString();
//       });

//       if (isLeaveDay) {
//         setAppointmentsError(`Dr. ${doctorName.split(' ')[1]} is on leave on ${new Date(appointmentDate).toLocaleDateString()}.`);
//         setLoadingAppointments(false);
//         return;
//       }

//       const dailySlotInfo = doctorAvailability.dailySlots.find(
//         (ds) => ds.day === selectedDay
//       );

//       if (!dailySlotInfo || dailySlotInfo.slots.length === 0) {
//         setAppointmentsError("No slots available for this doctor on the selected day.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Convert TimeRange objects to "HH:MM-HH:MM" strings for easier processing
//       let formattedBaseSlots = dailySlotInfo.slots.map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean); // Filter out any null/empty strings if formatting fails

//       let formattedBreakSlots = (dailySlotInfo.breakSlots || []).map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean);

//       // Filter out break slots from base slots
//       let currentAvailableSlots = formattedBaseSlots.filter(slotString => {
//         const [slotStartStr, slotEndStr] = slotString.split('-');
//         // Convert times to minutes from midnight for robust overlap comparison
//         const slotStartMinutes = parseInt(slotStartStr.split(':')[0]) * 60 + parseInt(slotStartStr.split(':')[1]);
//         const slotEndMinutes = parseInt(slotEndStr.split(':')[0]) * 60 + parseInt(slotEndStr.split(':')[1]);

//         return !formattedBreakSlots.some(bSlotString => {
//           const [bStartStr, bEndStr] = bSlotString.split('-');
//           const bStartMinutes = parseInt(bStartStr.split(':')[0]) * 60 + parseInt(bStartStr.split(':')[1]);
//           const bEndMinutes = parseInt(bEndStr.split(':')[0]) * 60 + parseInt(bEndStr.split(':')[1]);

//           // Check for overlap: slot starts before break ends AND slot ends after break starts
//           return (slotStartMinutes < bEndMinutes && slotEndMinutes > bStartMinutes);
//         });
//       });


//       // Fetch existing appointments for the selected date and doctor (now on port 2005)
//       try {
//         // IMPORTANT: Ensure your backend for appointments returns appointmentTime as an ISO string
//         // if it's stored as Instant.
//         const response = await fetch(`http://localhost:2010/api/appointments/doctor/${doctorId}/date/${appointmentDate}`);
//         if (!response.ok) {
//           // Check for 204 No Content if no appointments are found
//           if (response.status === 204) {
//             setExistingAppointments([]);
//             console.log("No existing appointments found for this doctor on this date (204 No Content).");
//           } else {
//             const errorText = await response.text();
//             throw new Error(`Failed to fetch existing appointments: ${response.status} - ${errorText}`);
//           }
//         } else {
//           const data = await response.json();
//           setExistingAppointments(data);
//         }

//         // Filter out already booked slots
//         const bookedTimes = existingAppointments.map(app => {
//           // Assuming app.appointmentTime is an ISO string (Instant) from backend
//           // Extract HH:MM part from the ISO string
//           return formatInstantToTime(app.appointmentTime);
//         });

//         const finalAvailableSlots = currentAvailableSlots.filter(slot => {
//           const [slotStart] = slot.split('-'); // slot is already "HH:MM-HH:MM"
//           return !bookedTimes.includes(slotStart);
//         });

//         setAvailableTimeSlots(finalAvailableSlots);
//         if (finalAvailableSlots.length === 0) {
//           setAppointmentsError("All slots are booked for this day or no availability.");
//         } else {
//           setAppointmentsError(null); // Clear error if slots are found
//         }

//       } catch (err) {
//         console.error("Error fetching existing appointments:", err);
//         setAppointmentsError(err.message || "Failed to load available slots.");
//       } finally {
//         setLoadingAppointments(false);
//       }
//     };

//     updateAvailableSlots();
//   }, [appointmentDate, doctorId, doctorAvailability, doctorName]); // Removed existingAppointments from dependency array


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSubmissionStatus(null);
//     setSubmissionMessage('');

//     // Basic validation
//     if (!patientIdInput || !appointmentDate || !appointmentTime || !reasonForVisit || !doctorName || !doctorId) {
//       setSubmissionStatus('error');
//       setSubmissionMessage('Please fill in all required fields (including Doctor ID).');
//       setLoading(false);
//       return;
//     }

//     // Additional validation against availability and existing bookings
//     if (availabilityError || appointmentsError) {
//       setSubmissionStatus('error');
//       setSubmissionMessage(availabilityError || appointmentsError || 'Cannot book due to availability issues.');
//       setLoading(false);
//       return;
//     }

//     if (!availableTimeSlots.includes(appointmentTime)) {
//         setSubmissionStatus('error');
//         setSubmissionMessage('Selected time slot is not available. Please choose from the list.');
//         setLoading(false);
//         return;
//     }

//     const payload = {
//       patientId: patientIdInput, // Use the state variable for patientId
//       doctorId: doctorId,
//       appointmentDate: appointmentDate,
//       // Send only the start time of the slot for booking, or the full slot string
//       // Adjust this based on what your backend expects for appointmentTime
//       appointmentTime: appointmentTime.split('-')[0], // Sending "HH:MM" start time
//       reasonForVisit: reasonForVisit,
//       status: 'Scheduled', // Default status for new appointments
//       bookedByUserId: frontDeskUser.userId,
//       roomNumber: roomNumber || null, // Send null if optional and empty
//     };

//     console.log('Submitting appointment:', payload);

//     try {
//       // Appointment booking API is on port 2005
//       const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to book appointment: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('Appointment booked successfully:', result);
//       setSubmissionStatus('success');
//       setSubmissionMessage('Appointment booked successfully!');
//       // Clear form after successful submission
//       setPatientIdInput(''); // Clear the patient ID input field
//       if (!doctorId) setDoctorName('');
//       setAppointmentDate('');
//       setAppointmentTime('');
//       setReasonForVisit('');
//       setRoomNumber('');
//       setAvailableTimeSlots([]); // Clear slots for next booking
//       setExistingAppointments([]); // Clear existing appointments
//     } catch (err) {
//       console.error('Error booking appointment:', err);
//       setSubmissionStatus('error');
//       setSubmissionMessage(err.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto', width: '100%' }}>
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 3 }}
//       >
//         Back
//       </Button>

//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Book New Appointment
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
//           Appointment Details
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Patient ID"
//             variant="outlined"
//             fullWidth
//             required
//             value={patientIdInput} // Use patientIdInput state
//             onChange={(e) => setPatientIdInput(e.target.value)} // Update patientIdInput state
//             disabled={!!patientId} // Disable if patientId prop is provided
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//           <TextField
//             label="Doctor Name"
//             variant="outlined"
//             fullWidth
//             required
//             value={doctorName}
//             onChange={(e) => setDoctorName(e.target.value)}
//             disabled={!!doctorId}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//           <TextField
//             label="Appointment Date"
//             type="date"
//             variant="outlined"
//             fullWidth
//             required
//             value={appointmentDate}
//             onChange={(e) => setAppointmentDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />

//           {loadingAvailability || loadingAppointments ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
//               <CircularProgress size={30} />
//               <Typography sx={{ ml: 2 }}>Loading slots...</Typography>
//             </Box>
//           ) : (
//             <>
//               {availabilityError || appointmentsError ? (
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                   {availabilityError || appointmentsError}
//                 </Alert>
//               ) : (
//                 <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} required>
//                   <InputLabel id="appointment-time-label">Appointment Time</InputLabel>
//                   <Select
//                     labelId="appointment-time-label"
//                     id="appointment-time"
//                     value={appointmentTime}
//                     label="Appointment Time"
//                     onChange={(e) => setAppointmentTime(e.target.value)}
//                     startAdornment={<AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />}
//                     disabled={availableTimeSlots.length === 0}
//                   >
//                     <MenuItem value="">
//                       <em>{availableTimeSlots.length === 0 ? "No slots available for this day" : "Select a time"}</em>
//                     </MenuItem>
//                     {availableTimeSlots.map((slot) => (
//                       <MenuItem key={slot} value={slot}>
//                         {slot}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             </>
//           )}

//           <TextField
//             label="Reason for Visit"
//             variant="outlined"
//             fullWidth
//             required
//             multiline
//             rows={3}
//             value={reasonForVisit}
//             onChange={(e) => setReasonForVisit(e.target.value)}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
//             }}
//           />
//           <TextField
//             label="Room Number (Optional)"
//             variant="outlined"
//             fullWidth
//             value={roomNumber}
//             onChange={(e) => setRoomNumber(e.target.value)}
//             sx={{ mb: 4 }}
//             InputProps={{
//               startAdornment: <MeetingRoomIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />

//           {submissionStatus && (
//             <Alert severity={submissionStatus} sx={{ mb: 3 }}>
//               {submissionMessage}
//             </Alert>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventNoteIcon />}
//             disabled={loading || !doctorAvailability || availableTimeSlots.length === 0 || !!appointmentsError || !!availabilityError}
//             sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
//           >
//             {loading ? 'Booking...' : 'Book Appointment'}
//           </Button>
//         </form>
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Efficiently schedule new appointments for patients.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskBookAppointmentPage.propTypes = {
//   doctorId: PropTypes.string,
//   patientId: PropTypes.string, // Added patientId to propTypes
//   onBack: PropTypes.func.isRequired,
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//   }).isRequired,
// };

// export default FrontDeskBookAppointmentPage;


// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Paper,
//   CircularProgress,
//   Alert,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import DescriptionIcon from '@mui/icons-material/Description';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// // Import for DatePicker
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs'; // Import dayjs library

// const FrontDeskBookAppointmentPage = ({ doctorId, patientId, onBack, frontDeskUser }) => {
//   const [doctorName, setDoctorName] = useState('');
//   const [patientIdInput, setPatientIdInput] = useState(patientId || '');
//   const [appointmentDate, setAppointmentDate] = useState(''); // Stores YYYY-MM-DD string
//   const [appointmentTime, setAppointmentTime] = useState('');
//   const [reasonForVisit, setReasonForVisit] = useState('');
//   const [roomNumber, setRoomNumber] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
//   const [submissionMessage, setSubmissionMessage] = useState('');

//   const [doctorAvailability, setDoctorAvailability] = useState(null);
//   const [loadingAvailability, setLoadingAvailability] = useState(true); // Fixed: Correct useState initialization
//   const [availabilityError, setAvailabilityError] = useState(null);

//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [existingAppointments, setExistingAppointments] = useState([]);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);
//   const [appointmentsError, setAppointmentsError] = useState(null);

//   // Helper to get day name from dayjs object (e.g., dayjs().day(1) -> "MONDAY")
//   const getWeekdayNameFromDayjs = (dateObj) => {
//     if (!dateObj) return '';
//     const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
//     return days[dateObj.day()];
//   };

//   // Helper to format an Instant (ISO string) into HH:MM
//   const formatInstantToTime = (isoString) => {
//     if (!isoString) return '';
//     // Ensure the date object is created in UTC to avoid local timezone issues for time extraction
//     const date = new Date(isoString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//   };

//   // Function to determine if a date should be disabled in the DatePicker
//   const shouldDisableDate = (date) => {
//     if (!doctorAvailability) {
//       // If availability is not loaded yet, disable all dates
//       return true;
//     }

//     const today = dayjs().startOf('day'); // Get today's date at midnight
//     // Disable past dates
//     if (date.isBefore(today, 'day')) {
//       return true;
//     }

//     // Check if the date is a leave date
//     const isLeaveDay = doctorAvailability.leaveDates.some(leaveDateStr => {
//       return dayjs(leaveDateStr).isSame(date, 'day');
//     });
//     if (isLeaveDay) {
//       return true;
//     }

//     // Check if the day of the week has any defined slots
//     const dayOfWeek = getWeekdayNameFromDayjs(date);
//     const hasDailySlots = doctorAvailability.dailySlots.some(
//       (ds) => ds.day === dayOfWeek && ds.slots && ds.slots.length > 0
//     );

//     return !hasDailySlots; // Disable if no daily slots are defined for that day
//   };


//   // Fetch doctor details if doctorId is provided (coming from doctor details page)
//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       if (doctorId) {
//         try {
//           const response = await fetch(`http://localhost:2005/api/doctors/${doctorId}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch doctor details for pre-fill.');
//           }
//           const data = await response.json();
//           setDoctorName(`Dr. ${data.firstName} ${data.lastName}`);
//         } catch (err) {
//           console.error('Error fetching doctor details:', err);
//         }
//       }
//     };
//     fetchDoctorDetails();
//   }, [doctorId]);

//   // Fetch doctor availability
//   useEffect(() => {
//     const fetchDoctorAvailability = async () => {
//       if (!doctorId) {
//         setAvailabilityError("Doctor ID is not available for fetching availability.");
//         setLoadingAvailability(false);
//         return;
//       }

//       setLoadingAvailability(true);
//       setAvailabilityError(null);

//       try {
//         const response = await fetch(`http://localhost:2005/api/doctor-availabilities/byDoctorId/${doctorId}`);

//         if (response.ok) {
//           const data = await response.json();
//           setDoctorAvailability(data);
//           console.log("Doctor availability fetched:", data);
//         } else if (response.status === 404) {
//           setDoctorAvailability(null);
//           console.log("No availability found for this doctor.");
//         } else {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch doctor availability: ${response.status} - ${errorText}`);
//         }
//       } catch (err) {
//         console.error("Error fetching doctor availability:", err);
//         setAvailabilityError(err.message || "Failed to load doctor availability.");
//       } finally {
//         setLoadingAvailability(false);
//       }
//     };

//     fetchDoctorAvailability();
//   }, [doctorId]);

//   // Fetch existing appointments and calculate available time slots
//   useEffect(() => {
//     const updateAvailableSlots = async () => {
//       setAvailableTimeSlots([]);
//       setAppointmentTime('');

//       if (!appointmentDate || !doctorId || !doctorAvailability) {
//         return;
//       }

//       setLoadingAppointments(true);
//       setAppointmentsError(null);

//       const selectedDay = getWeekdayNameFromDayjs(dayjs(appointmentDate)); // Use dayjs for weekday
//       const selectedDateTime = dayjs(appointmentDate);

//       // Re-check if selected date is in the past (should be handled by DatePicker, but good for double-check)
//       if (selectedDateTime.isBefore(dayjs().startOf('day'), 'day')) {
//         setAppointmentsError("Cannot book appointments in the past.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Re-check for leave dates (should be handled by DatePicker, but good for double-check)
//       const isLeaveDay = doctorAvailability.leaveDates.some(leaveDateStr => {
//         return dayjs(leaveDateStr).isSame(selectedDateTime, 'day');
//       });

//       if (isLeaveDay) {
//         setAppointmentsError(`Dr. ${doctorName.split(' ')[1]} is on leave on ${selectedDateTime.format('MM/DD/YYYY')}.`);
//         setLoadingAppointments(false);
//         return;
//       }

//       const dailySlotInfo = doctorAvailability.dailySlots.find(
//         (ds) => ds.day === selectedDay
//       );

//       if (!dailySlotInfo || !dailySlotInfo.slots || dailySlotInfo.slots.length === 0) {
//         setAppointmentsError("No slots available for this doctor on the selected day.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Convert TimeRange objects to "HH:MM-HH:MM" strings
//       let formattedBaseSlots = dailySlotInfo.slots.map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean);

//       let formattedBreakSlots = (dailySlotInfo.breakSlots || []).map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean);

//       // Filter out break slots from base slots
//       let currentAvailableSlots = formattedBaseSlots.filter(slotString => {
//         const [slotStartStr, slotEndStr] = slotString.split('-');
//         const slotStartMinutes = parseInt(slotStartStr.split(':')[0]) * 60 + parseInt(slotStartStr.split(':')[1]);
//         const slotEndMinutes = parseInt(slotEndStr.split(':')[0]) * 60 + parseInt(slotEndStr.split(':')[1]);

//         return !formattedBreakSlots.some(bSlotString => {
//           const [bStartStr, bEndStr] = bSlotString.split('-');
//           const bStartMinutes = parseInt(bStartStr.split(':')[0]) * 60 + parseInt(bStartStr.split(':')[1]);
//           const bEndMinutes = parseInt(bEndStr.split(':')[0]) * 60 + parseInt(bEndStr.split(':')[1]);

//           return (slotStartMinutes < bEndMinutes && slotEndMinutes > bStartMinutes);
//         });
//       });

//       try {
//         const response = await fetch(`http://localhost:2010/api/appointments/doctor/${doctorId}/date/${appointmentDate}`);
//         if (!response.ok) {
//           if (response.status === 204) {
//             setExistingAppointments([]);
//             console.log("No existing appointments found for this doctor on this date (204 No Content).");
//           } else {
//             const errorText = await response.text();
//             throw new Error(`Failed to fetch existing appointments: ${response.status} - ${errorText}`);
//           }
//         } else {
//           const data = await response.json();
//           setExistingAppointments(data);
//         }

//         const bookedTimes = existingAppointments.map(app => {
//           return formatInstantToTime(app.appointmentTime);
//         });

//         const finalAvailableSlots = currentAvailableSlots.filter(slot => {
//           const [slotStart] = slot.split('-');
//           return !bookedTimes.includes(slotStart);
//         });

//         setAvailableTimeSlots(finalAvailableSlots);
//         if (finalAvailableSlots.length === 0 && !availabilityError) {
//           setAppointmentsError("All slots are booked for this day or no availability.");
//         } else {
//           setAppointmentsError(null);
//         }

//       } catch (err) {
//         console.error("Error fetching existing appointments:", err);
//         setAppointmentsError(err.message || "Failed to load available slots.");
//       } finally {
//         setLoadingAppointments(false);
//       }
//     };

//     updateAvailableSlots();
//   }, [appointmentDate, doctorId, doctorAvailability, doctorName]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSubmissionStatus(null);
//     setSubmissionMessage('');

//     if (!patientIdInput || !appointmentDate || !appointmentTime || !reasonForVisit || !doctorName || !doctorId) {
//       setSubmissionStatus('error');
//       setSubmissionMessage('Please fill in all required fields (including Doctor ID).');
//       setLoading(false);
//       return;
//     }

//     if (availabilityError || appointmentsError) {
//       setSubmissionStatus('error');
//       setSubmissionMessage(availabilityError || appointmentsError || 'Cannot book due to availability issues.');
//       setLoading(false);
//       return;
//     }

//     if (!availableTimeSlots.includes(appointmentTime)) {
//         setSubmissionStatus('error');
//         setSubmissionMessage('Selected time slot is not available. Please choose from the list.');
//         setLoading(false);
//         return;
//     }

//     const payload = {
//       patientId: patientIdInput,
//       doctorId: doctorId,
//       appointmentDate: appointmentDate,
//       appointmentTime: appointmentTime.split('-')[0],
//       reasonForVisit: reasonForVisit,
//       status: 'Scheduled',
//       bookedByUserId: frontDeskUser.userId,
//       roomNumber: roomNumber || null,
//     };

//     console.log('Submitting appointment:', payload);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to book appointment: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('Appointment booked successfully:', result);
//       setSubmissionStatus('success');
//       setSubmissionMessage('Appointment booked successfully!');
//       setPatientIdInput('');
//       if (!doctorId) setDoctorName('');
//       setAppointmentDate('');
//       setAppointmentTime('');
//       setReasonForVisit('');
//       setRoomNumber('');
//       setAvailableTimeSlots([]);
//       setExistingAppointments([]);
//     } catch (err) {
//       console.error('Error booking appointment:', err);
//       setSubmissionStatus('error');
//       setSubmissionMessage(err.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto', width: '100%' }}>
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 3 }}
//       >
//         Back
//       </Button>

//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Book New Appointment
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
//           Appointment Details
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Patient ID"
//             variant="outlined"
//             fullWidth
//             required
//             value={patientIdInput}
//             onChange={(e) => setPatientIdInput(e.target.value)}
//             disabled={!!patientId}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//           <TextField
//             label="Doctor Name"
//             variant="outlined"
//             fullWidth
//             required
//             value={doctorName}
//             onChange={(e) => setDoctorName(e.target.value)}
//             disabled={!!doctorId}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Appointment Date"
//               value={appointmentDate ? dayjs(appointmentDate) : null} // Convert string to dayjs object
//               onChange={(newValue) => {
//                 setAppointmentDate(newValue ? newValue.format('YYYY-MM-DD') : ''); // Store as YYYY-MM-DD string
//               }}
//               shouldDisableDate={shouldDisableDate} // Apply the custom disable logic
//               slotProps={{ // Use slotProps to customize the TextField
//                 textField: {
//                   fullWidth: true,
//                   required: true,
//                   variant: "outlined",
//                   sx: { mb: 3 }, // Apply margin-bottom for consistent spacing
//                   InputLabelProps: { shrink: true },
//                   InputProps: {
//                     startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />,
//                     // By not providing an endAdornment here, we effectively remove the default one
//                   },
//                 },
//               }}
//             />
//           </LocalizationProvider>

//           {loadingAvailability || loadingAppointments ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
//               <CircularProgress size={30} />
//               <Typography sx={{ ml: 2 }}>Loading slots...</Typography>
//             </Box>
//           ) : (
//             <>
//               {availabilityError || appointmentsError ? (
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                   {availabilityError || appointmentsError}
//                 </Alert>
//               ) : (
//                 <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} required>
//                   <InputLabel id="appointment-time-label">Appointment Time</InputLabel>
//                   <Select
//                     labelId="appointment-time-label"
//                     id="appointment-time"
//                     value={appointmentTime}
//                     label="Appointment Time"
//                     onChange={(e) => setAppointmentTime(e.target.value)}
//                     startAdornment={<AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />}
//                     disabled={availableTimeSlots.length === 0}
//                   >
//                     <MenuItem value="">
//                       <em>{availableTimeSlots.length === 0 ? "No slots available for this day" : "Select a time"}</em>
//                     </MenuItem>
//                     {availableTimeSlots.map((slot) => (
//                       <MenuItem key={slot} value={slot}>
//                         {slot}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             </>
//           )}

//           <TextField
//             label="Reason for Visit"
//             variant="outlined"
//             fullWidth
//             required
//             multiline
//             rows={3}
//             value={reasonForVisit}
//             onChange={(e) => setReasonForVisit(e.target.value)}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
//             }}
//           />
//           <TextField
//             label="Room Number (Optional)"
//             variant="outlined"
//             fullWidth
//             value={roomNumber}
//             onChange={(e) => setRoomNumber(e.target.value)}
//             sx={{ mb: 4 }}
//             InputProps={{
//               startAdornment: <MeetingRoomIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />

//           {submissionStatus && (
//             <Alert severity={submissionStatus} sx={{ mb: 3 }}>
//               {submissionMessage}
//             </Alert>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventNoteIcon />}
//             disabled={loading || !doctorAvailability || availableTimeSlots.length === 0 || !!appointmentsError || !!availabilityError}
//             sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
//           >
//             {loading ? 'Booking...' : 'Book Appointment'}
//           </Button>
//         </form>
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Efficiently schedule new appointments for patients.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskBookAppointmentPage.propTypes = {
//   doctorId: PropTypes.string,
//   patientId: PropTypes.string,
//   onBack: PropTypes.func.isRequired,
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//   }).isRequired,
// };

// export default FrontDeskBookAppointmentPage;
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Paper,
//   CircularProgress,
//   Alert,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import PersonIcon from '@mui/icons-material/Person';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import DescriptionIcon from '@mui/icons-material/Description';
// import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// // Import for DatePicker
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs'; // Import dayjs library

// // Import Autocomplete for searchable patient dropdown
// import Autocomplete from '@mui/material/Autocomplete';

// const FrontDeskBookAppointmentPage = ({ doctorId, patientId, onBack, frontDeskUser }) => {
//   const [doctorName, setDoctorName] = useState('');
//   const [patientIdInput, setPatientIdInput] = useState(patientId || ''); // Stores selected patient's _id
//   const [appointmentDate, setAppointmentDate] = useState(''); // Stores YYYY-MM-DD string
//   const [appointmentTime, setAppointmentTime] = useState('');
//   const [reasonForVisit, setReasonForVisit] = useState('');
//   const [roomNumber, setRoomNumber] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
//   const [submissionMessage, setSubmissionMessage] = useState('');

//   const [doctorAvailability, setDoctorAvailability] = useState(null);
//   const [loadingAvailability, setLoadingAvailability] = useState(true);
//   const [availabilityError, setAvailabilityError] = useState(null);

//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [existingAppointments, setExistingAppointments] = useState([]);
//   const [loadingAppointments, setLoadingAppointments] = useState(false);
//   const [appointmentsError, setAppointmentsError] = useState(null);

//   // New states for patient data
//   const [allPatients, setAllPatients] = useState([]);
//   const [loadingPatients, setLoadingPatients] = useState(true);
//   const [patientsError, setPatientsError] = useState(null);
//   const [selectedPatientObject, setSelectedPatientObject] = useState(null); // Stores the full patient object from Autocomplete

//   // Helper to get day name from dayjs object (e.g., dayjs().day(1) -> "MONDAY")
//   const getWeekdayNameFromDayjs = (dateObj) => {
//     if (!dateObj) return '';
//     const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
//     return days[dateObj.day()];
//   };

//   // Helper to format an Instant (ISO string) into HH:MM
//   const formatInstantToTime = (isoString) => {
//     if (!isoString) return '';
//     // Ensure the date object is created in UTC to avoid local timezone issues for time extraction
//     const date = new Date(isoString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//   };

//   // Function to determine if a date should be disabled in the DatePicker
//   const shouldDisableDate = (date) => {
//     if (!doctorAvailability) {
//       // If availability is not loaded yet, disable all dates
//       return true;
//     }

//     const today = dayjs().startOf('day'); // Get today's date at midnight
//     // Disable past dates
//     if (date.isBefore(today, 'day')) {
//       return true;
//     }

//     // Check if the date is a leave date
//     const isLeaveDay = doctorAvailability.leaveDates.some(leaveDateStr => {
//       return dayjs(leaveDateStr).isSame(date, 'day');
//     });
//     if (isLeaveDay) {
//       return true;
//     }

//     // Check if the day of the week has any defined slots
//     const dayOfWeek = getWeekdayNameFromDayjs(date);
//     const hasDailySlots = doctorAvailability.dailySlots.some(
//       (ds) => ds.day === dayOfWeek && ds.slots && ds.slots.length > 0
//     );

//     return !hasDailySlots; // Disable if no daily slots are defined for that day
//   };


//   // Fetch doctor details if doctorId is provided (coming from doctor details page)
//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       if (doctorId) {
//         try {
//           const response = await fetch(`http://localhost:2005/api/doctors/${doctorId}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch doctor details for pre-fill.');
//           }
//           const data = await response.json();
//           setDoctorName(`Dr. ${data.firstName} ${data.lastName}`);
//         } catch (err) {
//           console.error('Error fetching doctor details:', err);
//         }
//       }
//     };
//     fetchDoctorDetails();
//   }, [doctorId]);

//   // Fetch doctor availability
//   useEffect(() => {
//     const fetchDoctorAvailability = async () => {
//       if (!doctorId) {
//         setAvailabilityError("Doctor ID is not available for fetching availability.");
//         setLoadingAvailability(false);
//         return;
//       }

//       setLoadingAvailability(true);
//       setAvailabilityError(null);

//       try {
//         const response = await fetch(`http://localhost:2005/api/doctor-availabilities/byDoctorId/${doctorId}`);

//         if (response.ok) {
//           const data = await response.json();
//           setDoctorAvailability(data);
//           console.log("Doctor availability fetched:", data);
//         } else if (response.status === 404) {
//           setDoctorAvailability(null);
//           console.log("No availability found for this doctor.");
//         } else {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch doctor availability: ${response.status} - ${errorText}`);
//         }
//       } catch (err) {
//         console.error("Error fetching doctor availability:", err);
//         setAvailabilityError(err.message || "Failed to load doctor availability.");
//       } finally {
//         setLoadingAvailability(false);
//       }
//     };

//     fetchDoctorAvailability();
//   }, [doctorId]);

//   // Fetch patient list for the Autocomplete dropdown
//   useEffect(() => {
//     const fetchPatients = async () => {
//       setLoadingPatients(true);
//       setPatientsError(null);
//       try {
//         const response = await fetch(`${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients');
//         if (!response.ok) {
//           throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         setAllPatients(data);

//         // If patientId prop is provided (e.g., from patient management), pre-select the patient
//         if (patientId) {
//           const preSelected = data.find(p => p._id === patientId);
//           if (preSelected) {
//             setSelectedPatientObject(preSelected);
//             setPatientIdInput(preSelected._id);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching patients:", err);
//         setPatientsError(err.message || "Failed to load patient list.");
//       } finally {
//         setLoadingPatients(false);
//       }
//     };
//     fetchPatients();
//   }, [patientId]); // Re-fetch if patientId prop changes

//   // Update patientIdInput when selectedPatientObject changes
//   useEffect(() => {
//     if (selectedPatientObject) {
//       setPatientIdInput(selectedPatientObject._id);
//     } else {
//       setPatientIdInput('');
//     }
//   }, [selectedPatientObject]);


//   // Fetch existing appointments and calculate available time slots
//   useEffect(() => {
//     const updateAvailableSlots = async () => {
//       setAvailableTimeSlots([]);
//       setAppointmentTime('');

//       if (!appointmentDate || !doctorId || !doctorAvailability) {
//         return;
//       }

//       setLoadingAppointments(true);
//       setAppointmentsError(null);

//       const selectedDay = getWeekdayNameFromDayjs(dayjs(appointmentDate)); // Use dayjs for weekday
//       const selectedDateTime = dayjs(appointmentDate);

//       // Re-check if selected date is in the past (should be handled by DatePicker, but good for double-check)
//       if (selectedDateTime.isBefore(dayjs().startOf('day'), 'day')) {
//         setAppointmentsError("Cannot book appointments in the past.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Re-check for leave dates (should be handled by DatePicker, but good for double-check)
//       const isLeaveDay = doctorAvailability.leaveDates.some(leaveDateStr => {
//         return dayjs(leaveDateStr).isSame(selectedDateTime, 'day');
//       });

//       if (isLeaveDay) {
//         setAppointmentsError(`Dr. ${doctorName.split(' ')[1]} is on leave on ${selectedDateTime.format('MM/DD/YYYY')}.`);
//         setLoadingAppointments(false);
//         return;
//       }

//       const dailySlotInfo = doctorAvailability.dailySlots.find(
//         (ds) => ds.day === selectedDay
//       );

//       if (!dailySlotInfo || !dailySlotInfo.slots || dailySlotInfo.slots.length === 0) {
//         setAppointmentsError("No slots available for this doctor on the selected day.");
//         setLoadingAppointments(false);
//         return;
//       }

//       // Convert TimeRange objects to "HH:MM-HH:MM" strings
//       let formattedBaseSlots = dailySlotInfo.slots.map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean);

//       let formattedBreakSlots = (dailySlotInfo.breakSlots || []).map(slotObj => {
//         const start = formatInstantToTime(slotObj.startTime);
//         const end = formatInstantToTime(slotObj.endTime);
//         return `${start}-${end}`;
//       }).filter(Boolean);

//       // Filter out break slots from base slots
//       let currentAvailableSlots = formattedBaseSlots.filter(slotString => {
//         const [slotStartStr, slotEndStr] = slotString.split('-');
//         const slotStartMinutes = parseInt(slotStartStr.split(':')[0]) * 60 + parseInt(slotStartStr.split(':')[1]);
//         const slotEndMinutes = parseInt(slotEndStr.split(':')[0]) * 60 + parseInt(slotEndStr.split(':')[1]);

//         return !formattedBreakSlots.some(bSlotString => {
//           const [bStartStr, bEndStr] = bSlotString.split('-');
//           const bStartMinutes = parseInt(bStartStr.split(':')[0]) * 60 + parseInt(bStartStr.split(':')[1]);
//           const bEndMinutes = parseInt(bEndStr.split(':')[0]) * 60 + parseInt(bEndStr.split(':')[1]);

//           return (slotStartMinutes < bEndMinutes && slotEndMinutes > bStartMinutes);
//         });
//       });

//       try {
//         const response = await fetch(`http://localhost:2010/api/appointments/doctor/${doctorId}/date/${appointmentDate}`);
//         if (!response.ok) {
//           if (response.status === 204) {
//             setExistingAppointments([]);
//             console.log("No existing appointments found for this doctor on this date (204 No Content).");
//           } else {
//             const errorText = await response.text();
//             throw new Error(`Failed to fetch existing appointments: ${response.status} - ${errorText}`);
//           }
//         } else {
//           const data = await response.json();
//           setExistingAppointments(data); // Set the state
//           // Use the 'data' directly for filtering to ensure it's the latest fetched data
//           const bookedTimes = data
//             .filter(app => app.status === 'Scheduled' || app.status === 'Confirmed')
//             .map(app => {
//               return formatInstantToTime(app.appointmentTime);
//             });

//           const finalAvailableSlots = currentAvailableSlots.filter(slot => {
//             const [slotStart] = slot.split('-');
//             return !bookedTimes.includes(slotStart);
//           });

//           setAvailableTimeSlots(finalAvailableSlots);
//           if (finalAvailableSlots.length === 0 && !availabilityError) {
//             setAppointmentsError("All slots are booked for this day or no availability.");
//           } else {
//             setAppointmentsError(null);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching existing appointments:", err);
//         setAppointmentsError(err.message || "Failed to load available slots.");
//       } finally {
//         setLoadingAppointments(false);
//       }
//     };

//     updateAvailableSlots();
//   }, [appointmentDate, doctorId, doctorAvailability, doctorName]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSubmissionStatus(null);
//     setSubmissionMessage('');

//     if (!patientIdInput || !appointmentDate || !appointmentTime || !reasonForVisit || !doctorName || !doctorId) {
//       setSubmissionStatus('error');
//       setSubmissionMessage('Please fill in all required fields (including Patient, Doctor ID).');
//       setLoading(false);
//       return;
//     }

//     if (availabilityError || appointmentsError) {
//       setSubmissionStatus('error');
//       setSubmissionMessage(availabilityError || appointmentsError || 'Cannot book due to availability issues.');
//       setLoading(false);
//       return;
//     }

//     if (!availableTimeSlots.includes(appointmentTime)) {
//         setSubmissionStatus('error');
//         setSubmissionMessage('Selected time slot is not available. Please choose from the list.');
//         setLoading(false);
//         return;
//     }

//     // Construct the full ISO 8601 string for appointmentTime
//     // Combine appointmentDate (YYYY-MM-DD) and appointmentTime (HH:MM)
//     const dateTimeString = `${appointmentDate}T${appointmentTime.split('-')[0]}:00`;
//     const appointmentTimeInstant = dayjs(dateTimeString).toISOString(); // Converts to ISO 8601 UTC string

//     const payload = {
//       patientId: patientIdInput, // Use the selected patient's _id
//       doctorId: doctorId,
//       appointmentDate: appointmentDate,
//       appointmentTime: appointmentTimeInstant, // Send as ISO 8601 Instant string
//       reasonForVisit: reasonForVisit,
//       status: 'Scheduled',
//       bookedByUserId: frontDeskUser.userId,
//       roomNumber: roomNumber || null,
//     };

//     console.log('Submitting appointment:', payload);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to book appointment: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('Appointment booked successfully:', result);
//       setSubmissionStatus('success');
//       setSubmissionMessage('Appointment booked successfully!');
//       // Clear form after successful submission
//       setSelectedPatientObject(null); // Clear selected patient object
//       setPatientIdInput(''); // Clear patient ID input
//       if (!doctorId) setDoctorName('');
//       setAppointmentDate('');
//       setAppointmentTime('');
//       setReasonForVisit('');
//       setRoomNumber('');
//       setAvailableTimeSlots([]);
//       setExistingAppointments([]);
//     } catch (err) {
//       console.error('Error booking appointment:', err);
//       setSubmissionStatus('error');
//       setSubmissionMessage(err.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto', width: '100%' }}>
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={onBack}
//         sx={{ mb: 3 }}
//       >
//         Back
//       </Button>

//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
//         Book New Appointment
//       </Typography>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
//         <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
//           Appointment Details
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           {loadingPatients ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50, mb: 3 }}>
//               <CircularProgress size={20} />
//               <Typography sx={{ ml: 2 }}>Loading patients...</Typography>
//             </Box>
//           ) : patientsError ? (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {patientsError}
//             </Alert>
//           ) : (
//             <Autocomplete
//               id="patient-id-autocomplete"
//               options={allPatients}
//               getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
//               isOptionEqualToValue={(option, value) => option._id === value._id}
//               value={selectedPatientObject}
//               onChange={(event, newValue) => {
//                 setSelectedPatientObject(newValue);
//               }}
//               disabled={!!patientId} // Disable if patientId prop is provided
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Patient"
//                   variant="outlined"
//                   fullWidth
//                   required
//                   sx={{ mb: 3 }}
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <>
//                         <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
//                         {params.InputProps.startAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               sx={{ mb: 3 }} // Apply margin-bottom to the Autocomplete component itself
//             />
//           )}

//           <TextField
//             label="Doctor Name"
//             variant="outlined"
//             fullWidth
//             required
//             value={doctorName}
//             onChange={(e) => setDoctorName(e.target.value)}
//             disabled={!!doctorId}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Appointment Date"
//               value={appointmentDate ? dayjs(appointmentDate) : null} // Convert string to dayjs object
//               onChange={(newValue) => {
//                 setAppointmentDate(newValue ? newValue.format('YYYY-MM-DD') : ''); // Store as YYYY-MM-DD string
//               }}
//               shouldDisableDate={shouldDisableDate} // Apply the custom disable logic
//               slotProps={{ // Use slotProps to customize the TextField
//                 textField: {
//                   fullWidth: true,
//                   required: true,
//                   variant: "outlined",
//                   sx: { mb: 3 }, // Apply margin-bottom for consistent spacing
//                   InputLabelProps: { shrink: true },
//                   InputProps: {
//                     startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />,
//                     // By not providing an endAdornment here, we effectively remove the default one
//                   },
//                 },
//               }}
//             />
//           </LocalizationProvider>

//           {loadingAvailability || loadingAppointments ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
//               <CircularProgress size={30} />
//               <Typography sx={{ ml: 2 }}>Loading slots...</Typography>
//             </Box>
//           ) : (
//             <>
//               {availabilityError || appointmentsError ? (
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                   {availabilityError || appointmentsError}
//                 </Alert>
//               ) : (
//                 <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} required>
//                   <InputLabel id="appointment-time-label">Appointment Time</InputLabel>
//                   <Select
//                     labelId="appointment-time-label"
//                     id="appointment-time"
//                     value={appointmentTime}
//                     label="Appointment Time"
//                     onChange={(e) => setAppointmentTime(e.target.value)}
//                     startAdornment={<AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />}
//                     disabled={availableTimeSlots.length === 0}
//                   >
//                     <MenuItem value="">
//                       <em>{availableTimeSlots.length === 0 ? "No slots available for this day" : "Select a time"}</em>
//                     </MenuItem>
//                     {availableTimeSlots.map((slot) => (
//                       <MenuItem key={slot} value={slot}>
//                         {slot}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//             </>
//           )}

//           <TextField
//             label="Reason for Visit"
//             variant="outlined"
//             fullWidth
//             required
//             multiline
//             rows={3}
//             value={reasonForVisit}
//             onChange={(e) => setReasonForVisit(e.target.value)}
//             sx={{ mb: 3 }}
//             InputProps={{
//               startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
//             }}
//           />
//           <TextField
//             label="Room Number (Optional)"
//             variant="outlined"
//             fullWidth
//             value={roomNumber}
//             onChange={(e) => setRoomNumber(e.target.value)}
//             sx={{ mb: 4 }}
//             InputProps={{
//               startAdornment: <MeetingRoomIcon sx={{ mr: 1, color: 'action.active' }} />,
//             }}
//           />

//           {submissionStatus && (
//             <Alert severity={submissionStatus} sx={{ mb: 3 }}>
//               {submissionMessage}
//             </Alert>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventNoteIcon />}
//             disabled={loading || !doctorAvailability || availableTimeSlots.length === 0 || !!appointmentsError || !!availabilityError}
//             sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
//           >
//             {loading ? 'Booking...' : 'Book Appointment'}
//           </Button>
//         </form>
//       </Paper>

//       <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary">
//           Efficiently schedule new appointments for patients.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// FrontDeskBookAppointmentPage.propTypes = {
//   doctorId: PropTypes.string,
//   patientId: PropTypes.string,
//   onBack: PropTypes.func.isRequired,
//   frontDeskUser: PropTypes.shape({
//     userId: PropTypes.string,
//     name: PropTypes.string,
//     email: PropTypes.string,
//   }).isRequired,
// };

// export default FrontDeskBookAppointmentPage;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

const FrontDeskBookAppointmentPage = ({ doctorId, patientId, onBack, frontDeskUser }) => {
  // Form states
  const [doctorName, setDoctorName] = useState('');
  const [patientIdInput, setPatientIdInput] = useState(patientId || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const [doctorAvailability, setDoctorAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(null);

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [allPatients, setAllPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  const [selectedPatientObject, setSelectedPatientObject] = useState(null);

  // Helper: Get day name from dayjs object
  const getWeekdayNameFromDayjs = (dateObj) => {
    if (!dateObj) return '';
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[dateObj.day()];
  };

  // Format ISO date-time string to HH:mm
  const formatInstantToTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Disable unavailable dates in DatePicker
  const shouldDisableDate = (date) => {
    if (!doctorAvailability) return true;
    const today = dayjs().startOf('day');
    if (date.isBefore(today, 'day')) return true;
    const isLeaveDay = doctorAvailability.leaveDates.some(ld => dayjs(ld).isSame(date, 'day'));
    if (isLeaveDay) return true;
    const dayOfWeek = getWeekdayNameFromDayjs(date);
    return !doctorAvailability.dailySlots.some(ds => ds.day === dayOfWeek && ds.slots && ds.slots.length > 0);
  };

  // Fetch doctor details
  useEffect(() => {
    if (!doctorId) return;
    fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + doctorId)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch doctor details.');
        return res.json();
      })
      .then(data => setDoctorName('Dr. ' + data.firstName + ' ' + data.lastName))
      .catch(console.error);
  }, [doctorId]);

  // Fetch doctor availability
  useEffect(() => {
    if (!doctorId) {
      setAvailabilityError('Doctor ID is missing.');
      setLoadingAvailability(false);
      return;
    }
    setLoadingAvailability(true);
    setAvailabilityError(null);
    fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctor-availabilities/byDoctorId/' + doctorId)
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 404) return null;
        return res.text().then(text => { throw new Error(text); });
      })
      .then(data => setDoctorAvailability(data))
      .catch(err => setAvailabilityError(err.message || 'Failed to load availability.'))
      .finally(() => setLoadingAvailability(false));
  }, [doctorId]);

  // Fetch patients list
  useEffect(() => {
    setLoadingPatients(true);
    setPatientsError(null);
    fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch patients: ' + res.status);
        return res.json();
      })
      .then(data => {
        setAllPatients(data);
        if (patientId) {
          const preSelect = data.find(p => p._id === patientId);
          if (preSelect) {
            setSelectedPatientObject(preSelect);
            setPatientIdInput(preSelect._id);
          }
        }
      })
      .catch(err => setPatientsError(err.message || 'Failed to load patients.'))
      .finally(() => setLoadingPatients(false));
  }, [patientId]);

  // Sync patient ID and object
  useEffect(() => {
    setPatientIdInput(selectedPatientObject ? selectedPatientObject._id : '');
  }, [selectedPatientObject]);

  // Fetch appointments and available slots for selected date
  useEffect(() => {
    setAvailableTimeSlots([]);
    setAppointmentTime('');
    if (!appointmentDate || !doctorId || !doctorAvailability) return;

    setLoadingAppointments(true);
    setAppointmentsError(null);

    const selectedDay = getWeekdayNameFromDayjs(dayjs(appointmentDate));
    const selectedDateTime = dayjs(appointmentDate);

    if (selectedDateTime.isBefore(dayjs().startOf('day'), 'day')) {
      setAppointmentsError('Cannot book appointments in the past.');
      setLoadingAppointments(false);
      return;
    }

    const isLeaveDay = doctorAvailability.leaveDates.some(ld => dayjs(ld).isSame(selectedDateTime, 'day'));
    if (isLeaveDay) {
      setAppointmentsError('Dr. ' + doctorName.split(' ')[1] + ' is on leave on ' + selectedDateTime.format('MM/DD/YYYY') + '.');
      setLoadingAppointments(false);
      return;
    }

    const dailySlotInfo = doctorAvailability.dailySlots.find(ds => ds.day === selectedDay);
    if (!dailySlotInfo || !dailySlotInfo.slots || dailySlotInfo.slots.length === 0) {
      setAppointmentsError('No slots available for this doctor on selected day.');
      setLoadingAppointments(false);
      return;
    }

    const formattedBaseSlots = dailySlotInfo.slots.map(slot =>
      `${formatInstantToTime(slot.startTime)}-${formatInstantToTime(slot.endTime)}`
    ).filter(Boolean);

    const formattedBreakSlots = (dailySlotInfo.breakSlots || []).map(slot =>
      `${formatInstantToTime(slot.startTime)}-${formatInstantToTime(slot.endTime)}`
    ).filter(Boolean);

    const filteredSlots = formattedBaseSlots.filter(slotStr => {
      const [slotStartStr, slotEndStr] = slotStr.split('-');
      const slotStartMinutes = parseInt(slotStartStr.split(':')[0]) * 60 + parseInt(slotStartStr.split(':')[1]);
      const slotEndMinutes = parseInt(slotEndStr.split(':')[0]) * 60 + parseInt(slotEndStr.split(':')[1]);
      return !formattedBreakSlots.some(bSlotStr => {
        const [bStartStr, bEndStr] = bSlotStr.split('-');
        const bStartMinutes = parseInt(bStartStr.split(':')[0]) * 60 + parseInt(bStartStr.split(':')[1]);
        const bEndMinutes = parseInt(bEndStr.split(':')[0]) * 60 + parseInt(bEndStr.split(':')[1]);
        return (slotStartMinutes < bEndMinutes && slotEndMinutes > bStartMinutes);
      });
    });

    fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments/doctor/' + doctorId + '/date/' + appointmentDate)
      .then(res => {
        if (!res.ok) {
          if (res.status === 204) return [];
          return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
      })
      .then(existingApps => {
        setExistingAppointments(existingApps);
        const bookedTimes = existingApps
          .filter(app => app.status === 'Scheduled' || app.status === 'Confirmed')
          .map(app => formatInstantToTime(app.appointmentTime));

        const finalAvailableSlots = filteredSlots.filter(slot => {
          const [slotStart] = slot.split('-');
          return !bookedTimes.includes(slotStart);
        });

        setAvailableTimeSlots(finalAvailableSlots);

        if (finalAvailableSlots.length === 0 && !availabilityError) {
          setAppointmentsError('All slots are booked or unavailable.');
        } else {
          setAppointmentsError(null);
        }
      })
      .catch(err => setAppointmentsError(err.message || 'Failed to load slots.'))
      .finally(() => setLoadingAppointments(false));
  }, [appointmentDate, doctorId, doctorAvailability, doctorName]);

  // Create Medical Record helper
  const createMedicalRecord = async (patientId, doctorId, reason) => {
    const diagnoses = ['Healthy', 'Mild Strain', 'Inflammation', 'Degenerative disc disease', 'Routine Check-up'];
    const treatments = ['Continue current lifestyle', 'Physical therapy', 'Prescribe anti-inflammatory medication', 'Suggest follow-up in 6 months', 'Referral to specialist'];
    const notesArr = ['Normal vitals, no concerns.', 'Patient reports no pain.', 'Discussed prevention methods.', 'Patient appears to be in good health.'];

    const payload = {
      patient_id: patientId,
      doctor_id: doctorId,
      record_date: new Date().toISOString(),
      chief_complaint: reason,
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      treatment_plan: treatments[Math.floor(Math.random() * treatments.length)],
      notes: notesArr[Math.floor(Math.random() * notesArr.length)],
      created_by_user_id: frontDeskUser.userId,
    };

    const response = await fetch(import.meta.env.VITE_MEDICAL_RECORD_SERVICE_URL + '/api/medical-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Failed to create medical record: ' + response.status + ' - ' + text);
    }

    const createdRecord = await response.json();
    return createdRecord.id || createdRecord._id;
  };

  // Form submit - book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSubmissionStatus(null);
    setSubmissionMessage('');

    // Validate required fields
    if (!patientIdInput || !appointmentDate || !appointmentTime || !reasonForVisit || !doctorName || !doctorId) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (availabilityError || appointmentsError) {
      setSubmissionStatus('error');
      setSubmissionMessage(availabilityError || appointmentsError);
      setLoading(false);
      return;
    }

    if (!availableTimeSlots.includes(appointmentTime)) {
      setSubmissionStatus('error');
      setSubmissionMessage('Selected time slot not available.');
      setLoading(false);
      return;
    }

    try {
      const medicalRecordId = await createMedicalRecord(patientIdInput, doctorId, reasonForVisit);

      // Prepare ISO 8601 strings for appointmentDate and appointmentTime (Instant compatible)
      const formattedAppointmentDate = dayjs(appointmentDate).startOf('day').toISOString(); // "YYYY-MM-DDT00:00:00Z"
      const slotStart = appointmentTime.split('-')[0];
      const formattedAppointmentTime = dayjs('1970-01-01T' + slotStart + ':00').toISOString(); // Dummy date with time

      const payload = {
        patientId: patientIdInput,
        doctorId,
        medicalRecordId,
        appointmentDate: formattedAppointmentDate,  // camelCase
        appointmentTime: formattedAppointmentTime,  // camelCase
        reasonForVisit,
        status: 'Scheduled',
        bookedByUserId: frontDeskUser.userId,
        roomNumber: roomNumber || null,
        notes: reasonForVisit,
      };


      const response = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error('Failed to book appointment: ' + response.status + ' - ' + text);
      }

      const result = await response.json();
      setSubmissionStatus('success');
      setSubmissionMessage('Appointment booked successfully!');

      // Reset form
      setSelectedPatientObject(null);
      setPatientIdInput('');
      if (!doctorId) setDoctorName('');
      setAppointmentDate('');
      setAppointmentTime('');
      setReasonForVisit('');
      setRoomNumber('');
      setAvailableTimeSlots([]);
      setExistingAppointments([]);
    } catch (err) {
      setSubmissionStatus('error');
      setSubmissionMessage(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (option.first_name || '') + ' ' + (option.last_name || '') + ' ' + (option._id || ''),
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 3 }}>
        Back
      </Button>

      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Book New Appointment
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Appointment Details
        </Typography>

        <form onSubmit={handleSubmit}>
          {loadingPatients ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50, mb: 3 }}>
              <CircularProgress size={20} />
              <Typography sx={{ ml: 2 }}>Loading patients...</Typography>
            </Box>
          ) : patientsError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {patientsError}
            </Alert>
          ) : (
            <Autocomplete
              id="patient-id-autocomplete"
              options={allPatients}
              getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' (ID: ' + option._id + ')'}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={selectedPatientObject}
              onChange={(event, newValue) => {
                setSelectedPatientObject(newValue);
              }}
              disabled={!!patientId}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Patient"
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 3 }}
            />
          )}

          <TextField
            label="Doctor Name"
            variant="outlined"
            fullWidth
            required
            value={doctorName}
            disabled={!!doctorId}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Appointment Date"
              value={appointmentDate ? dayjs(appointmentDate) : null}
              onChange={(newValue) => setAppointmentDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
              shouldDisableDate={shouldDisableDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: 'outlined',
                  sx: { mb: 3 },
                  InputLabelProps: { shrink: true },
                  InputProps: {
                    startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />,
                  },
                },
              }}
            />
          </LocalizationProvider>

          <Typography variant="body1" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />
            Select Appointment Time
          </Typography>
          {(loadingAvailability || loadingAppointments) ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, mb: 3 }}>
              <CircularProgress size={30} />
              <Typography sx={{ ml: 2 }}>Loading slots...</Typography>
            </Box>
          ) : availabilityError || appointmentsError ? (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {availabilityError || appointmentsError}
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mb: 3,
                
                justifyContent: availableTimeSlots.length === 0 ? 'center' : 'flex-start',
              }}
            >
              {availableTimeSlots.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    flexGrow: 1,
                    maxWidth: 400,
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    backgroundColor: '#e3f2fd',
                    color: '#0277bd',
                    borderRadius: 3,
                    boxShadow: '0 4px 14px rgba(2, 119, 189, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  No slots available for this day.
                </Alert>
              ) : (
                availableTimeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={appointmentTime === slot ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setAppointmentTime(slot)}
                    sx={{
                      py: 1.25,
                      px: 4,
                      borderRadius: 3,
                      minWidth: 80,
                      boxShadow: appointmentTime === slot
                        ? '0 10px 30px rgba(2, 119, 189, 0.6)'
                        : '0 5px 15px rgba(2, 119, 189, 0.25)',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 14px 40px rgba(2, 119, 189, 0.75)',
                        transform: 'translateY(-3px)',
                      },
                      color: appointmentTime === slot ? '#fff' : '#0277bd',
                      borderColor: '#0277bd',
                    }}
                  >
                    {slot}
                  </Button>
                ))
              )}
            </Box>
          )}

          <TextField
            label="Reason for Visit"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={3}
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <DescriptionIcon sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
              ),
            }}
          />

          <TextField
            label="Room Number (Optional)"
            variant="outlined"
            fullWidth
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: <MeetingRoomIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          {submissionStatus && (
            <Alert severity={submissionStatus} sx={{ mb: 3 }}>
              {submissionMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventNoteIcon />}
            disabled={loading || !doctorAvailability || availableTimeSlots.length === 0 || !!appointmentsError || !!availabilityError}
            sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Efficiently schedule new appointments for patients.
        </Typography>
      </Box>
    </Box>
  );
};

FrontDeskBookAppointmentPage.propTypes = {
  doctorId: PropTypes.string,
  patientId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default FrontDeskBookAppointmentPage;
