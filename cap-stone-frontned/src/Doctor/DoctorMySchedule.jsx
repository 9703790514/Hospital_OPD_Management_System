import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Divider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';

// Helper function to format Instant (ISO string) to HH:MM (24-hour format)
const formatInstantToHHMM = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Ensure the date is treated as UTC to prevent timezone issues with fixed times
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const DoctorMySchedule = ({ doctorUser }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for schedule management (raw data from backend)
  const [doctorAvailabilityId, setDoctorAvailabilityId] = useState(null);
  const [dailyAvailability, setDailyAvailability] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);

  // States for adding new slots/breaks/leaves
  const [selectedDayForSlot, setSelectedDayForSlot] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [newBreakStartTime, setNewBreakStartTime] = useState('');
  const [newBreakEndTime, setNewBreakEndTime] = useState('');
  const [newLeaveDate, setNewLeaveDate] = useState('');

  // States for saving feedback
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [availabilitySaveStatus, setAvailabilitySaveStatus] = useState(null); // 'success', 'error'
  const [appointmentUpdateStatus, setAppointmentUpdateStatus] = useState(null); // 'success', 'error', 'loading'

  const DAYS_OF_WEEK = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];

  const fetchData = async () => {
    if (!doctorUser || !doctorUser.userId) {
      setError("Doctor user ID (custom ID) is not available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const doctorCustomId = doctorUser.userId;

    try {
      // 1. Fetch Doctor Details using customId from the Doctor microservice
      const doctorDetailsApiUrl = import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/customId/' + doctorCustomId;
      const doctorDetailsResponse = await fetch(doctorDetailsApiUrl);
      if (!doctorDetailsResponse.ok) {
        const errorText = await doctorDetailsResponse.text();
        throw new Error('Failed to fetch doctor details: ' + doctorDetailsResponse.status + ' - ' + errorText);
      }
      const doctorData = await doctorDetailsResponse.json();
      setDoctorDetails(doctorData);

      const doctorMongoId = doctorData.id;
      if (!doctorMongoId) {
        throw new Error("Could not retrieve MongoDB ID for the doctor.");
      }

      // 2. Fetch Doctor Availability using the MongoDB _id from the Availability microservice
      const doctorAvailabilityApiUrl = import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctor-availabilities/byDoctorId/' + doctorMongoId;
      const doctorAvailabilityResponse = await fetch(doctorAvailabilityApiUrl);

      let availabilityData = null;
      if (doctorAvailabilityResponse.ok) {
        availabilityData = await doctorAvailabilityResponse.json();
        setDoctorAvailabilityId(availabilityData.id);
        setDailyAvailability(availabilityData.dailySlots ? availabilityData.dailySlots.map(day => ({
          day: day.day,
          slots: day.slots || [],
          breakSlots: day.breakSlots || []
        })) : []);
        setLeaveDates(availabilityData.leaveDates || []);
      } else if (doctorAvailabilityResponse.status === 404) {
        setDoctorAvailabilityId(null);
        setDailyAvailability([]);
        setLeaveDates([]);
      } else {
        const errorText = await doctorAvailabilityResponse.text();
        throw new Error('Failed to fetch schedule data: ' + doctorAvailabilityResponse.status + ' - ' + errorText);
      }

      const rawDailySlots = availabilityData ? availabilityData.dailySlots || [] : [];
      const rawLeaveDates = availabilityData ? availabilityData.leaveDates || [] : [];
      const flattenedSchedule = [];

      rawDailySlots.forEach(daySlot => {
        if (daySlot.slots && Array.isArray(daySlot.slots)) {
          daySlot.slots.forEach(timeRange => {
            const formattedStartTime = formatInstantToHHMM(timeRange.startTime);
            const formattedEndTime = formatInstantToHHMM(timeRange.endTime);
            flattenedSchedule.push({
              id: `${daySlot.day}-consultation-${timeRange.startTime}-${timeRange.endTime}`,
              day: daySlot.day,
              time: `${formattedStartTime} - ${formattedEndTime}`,
              type: 'Consultation',
              activity: 'Patient Consultation',
              location: 'Clinic Room',
              status: 'Scheduled',
            });
          });
        }
        if (daySlot.breakSlots && Array.isArray(daySlot.breakSlots)) {
          daySlot.breakSlots.forEach(timeRange => {
            const formattedStartTime = formatInstantToHHMM(timeRange.startTime);
            const formattedEndTime = formatInstantToHHMM(timeRange.endTime);
            flattenedSchedule.push({
              id: `${daySlot.day}-break-${timeRange.startTime}-${timeRange.endTime}`,
              day: daySlot.day,
              time: `${formattedStartTime} - ${formattedEndTime}`,
              type: 'Break',
              activity: 'Break Time',
              location: 'N/A',
              status: 'Flexible',
            });
          });
        }
      });

      if (rawLeaveDates.length > 0) {
        rawLeaveDates.forEach(leaveDate => {
          flattenedSchedule.push({
            id: `leave-${leaveDate}`,
            day: 'Leave',
            date: new Date(leaveDate).toLocaleDateString(),
            time: 'All Day',
            type: 'Leave',
            activity: 'Doctor on Leave',
            location: 'N/A',
            status: 'Cancelled',
          });
        });
      }

      flattenedSchedule.sort((a, b) => {
        if (a.type === 'Leave' && b.type !== 'Leave') return 1;
        if (a.type !== 'Leave' && b.type === 'Leave') return -1;
        if (a.type === 'Leave' && b.type === 'Leave') return a.date.localeCompare(b.date);
        const dayOrderA = DAYS_OF_WEEK.indexOf(a.day);
        const dayOrderB = DAYS_OF_WEEK.indexOf(b.day);
        if (dayOrderA !== dayOrderB) {
          return dayOrderA - dayOrderB;
        }
        const timeA = a.time.split(' - ')[0];
        const timeB = b.time.split(' - ')[0];
        return timeA.localeCompare(timeB);
      });

      setScheduleData(flattenedSchedule);
    } catch (err) {
      setError(err.message || "Failed to load doctor details or schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctorUser.userId]);

  const getStatusColor = (status, type) => {
    if (type === 'Break') return 'warning';
    if (type === 'Leave') return 'error';
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Flexible': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Consultation': return <EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />;
      case 'Break': return <PauseCircleFilledIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />;
      case 'Leave': return <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />;
      default: return null;
    }
  };

  // --- Schedule Management Functions ---
  const createInstantFromTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null;
    const baseDate = dateString === 'All Day' ? '1970-01-01' : dateString;
    return new Date(`${baseDate}T${timeString}:00.000Z`).toISOString();
  };

  const handleAddSlot = () => {
    if (!selectedDayForSlot || !newSlotStartTime || !newSlotEndTime) {
      setAvailabilitySaveStatus('error');
      return;
    }
    const newTimeRange = {
      startTime: createInstantFromTime('1970-01-01', newSlotStartTime),
      endTime: createInstantFromTime('1970-01-01', newSlotEndTime),
    };
    setDailyAvailability((prevAvailability) => {
      const existingDayIndex = prevAvailability.findIndex(
        (item) => item.day === selectedDayForSlot
      );
      if (existingDayIndex !== -1) {
        const updatedDailyAvailability = [...prevAvailability];
        const existingDay = { ...updatedDailyAvailability[existingDayIndex] };
        if (!existingDay.slots.some(s => s.startTime === newTimeRange.startTime && s.endTime === newTimeRange.endTime)) {
          existingDay.slots = [...existingDay.slots, newTimeRange].sort((a, b) => a.startTime.localeCompare(b.startTime));
          updatedDailyAvailability[existingDayIndex] = existingDay;
          return updatedDailyAvailability;
        }
      } else {
        return [...prevAvailability, { day: selectedDayForSlot, slots: [newTimeRange], breakSlots: [] }];
      }
      return prevAvailability;
    });
    setNewSlotStartTime('');
    setNewSlotEndTime('');
    setSelectedDayForSlot('');
    setAvailabilitySaveStatus('success');
  };

  const handleRemoveSlot = (day, slotToRemove) => {
    setDailyAvailability((prevAvailability) =>
      prevAvailability
        .map((item) =>
          item.day === day
            ? { ...item, slots: item.slots.filter((slot) => !(slot.startTime === slotToRemove.startTime && slot.endTime === slotToRemove.endTime)) }
            : item
        )
        .filter((item) => item.slots.length > 0 || item.breakSlots.length > 0)
    );
    setAvailabilitySaveStatus('success');
  };

  const handleAddBreak = () => {
    if (!selectedDayForSlot || !newBreakStartTime || !newBreakEndTime) {
      setAvailabilitySaveStatus('error');
      return;
    }
    const newTimeRange = {
      startTime: createInstantFromTime('1970-01-01', newBreakStartTime),
      endTime: createInstantFromTime('1970-01-01', newBreakEndTime),
    };
    setDailyAvailability((prevAvailability) => {
      const existingDayIndex = prevAvailability.findIndex(
        (item) => item.day === selectedDayForSlot
      );
      if (existingDayIndex !== -1) {
        const updatedDailyAvailability = [...prevAvailability];
        const existingDay = { ...updatedDailyAvailability[existingDayIndex] };
        if (!existingDay.breakSlots.some(b => b.startTime === newTimeRange.startTime && b.endTime === newTimeRange.endTime)) {
          existingDay.breakSlots = [...existingDay.breakSlots, newTimeRange].sort((a, b) => a.startTime.localeCompare(b.startTime));
          updatedDailyAvailability[existingDayIndex] = existingDay;
          return updatedDailyAvailability;
        }
      } else {
        return [...prevAvailability, { day: selectedDayForSlot, slots: [], breakSlots: [newTimeRange] }];
      }
      return prevAvailability;
    });
    setNewBreakStartTime('');
    setNewBreakEndTime('');
    setSelectedDayForSlot('');
    setAvailabilitySaveStatus('success');
  };

  const handleRemoveBreak = (day, breakToRemove) => {
    setDailyAvailability((prevAvailability) =>
      prevAvailability
        .map((item) =>
          item.day === day
            ? { ...item, breakSlots: item.breakSlots.filter((b) => !(b.startTime === breakToRemove.startTime && b.endTime === breakToRemove.endTime)) }
            : item
        )
        .filter((item) => item.slots.length > 0 || item.breakSlots.length > 0)
    );
    setAvailabilitySaveStatus('success');
  };

  const handleAddLeaveDate = () => {
    if (!newLeaveDate) {
      setAvailabilitySaveStatus('error');
      return;
    }
    const leaveInstant = new Date(`${newLeaveDate}T00:00:00.000Z`).toISOString();
    if (leaveDates.includes(leaveInstant)) {
      setAvailabilitySaveStatus('error');
      return;
    }
    setLeaveDates((prevDates) => [...prevDates, leaveInstant].sort());
    setNewLeaveDate('');
    setAvailabilitySaveStatus('success');
  };

  const handleRemoveLeaveDate = (dateToRemove) => {
    setLeaveDates((prevDates) => prevDates.filter((date) => date !== dateToRemove));
    setAvailabilitySaveStatus('success');
  };

  const updateAppointments = async (doctorId, leaveDates, dailyAvailability) => {
    setAppointmentUpdateStatus('loading');
    try {
      const payload = {
        doctorId: doctorId,
        leaveDates: leaveDates,
        dailySlots: dailyAvailability,
      };

      // Use port 2010 for appointments microservice
      const response = await fetch(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments/update-on-schedule-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to update appointments: ' + response.status + ' - ' + errorText);
      }
      setAppointmentUpdateStatus('success');
    } catch (err) {
      setAppointmentUpdateStatus('error');
    }
  };

  const handleSaveAvailability = async () => {
    setSavingAvailability(true);
    setAvailabilitySaveStatus(null);
    setAppointmentUpdateStatus(null);

    const payload = {
      doctorId: doctorDetails.id,
      dailySlots: dailyAvailability,
      leaveDates: leaveDates,
    };

    try {
      let response;
      // Use port 2005 for doctor-availability microservice
      if (doctorAvailabilityId) {
        response = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctor-availabilities/' + doctorAvailabilityId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctor-availabilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to save availability: ' + response.status + ' - ' + errorText);
      }
      setAvailabilitySaveStatus('success');

      // Call a separate API to update appointments after saving availability
      await updateAppointments(doctorDetails.id, leaveDates, dailyAvailability);

      fetchData(); // Re-fetch data to update the displayed schedule table
    } catch (err) {
      setAvailabilitySaveStatus('error');
    } finally {
      setSavingAvailability(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setAvailabilitySaveStatus(null);
    setAppointmentUpdateStatus(null);
  };
  // --- End Schedule Management Functions ---

  return (
  <Box
  sx={{
    width: '100%',
    maxWidth: 1600,
    bgcolor: '#f3f6fb',
    borderRadius: 4,
    boxShadow: '0 20px 45px rgba(20, 60, 110, 0.12)',
    p: { xs: 5, sm: 8 },
    mx: 'auto',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  }}
>
  <Typography
    variant="h4"
    component="h2"
    gutterBottom
    align="center"
    sx={{
      mb: 6,
      fontWeight: 900,
      color: '#0a3d62',
      letterSpacing: 2,
      textTransform: 'uppercase',
      textShadow: '0 1px 10px rgba(16, 40, 80, 0.15)',
      userSelect: 'none',
      fontSize: { xs: '2.75rem', sm: '3.75rem' },
    }}
  >
    My Schedule
  </Typography>

  {loading && (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '220px',
        flexDirection: 'column',
        color: '#00796b',
      }}
    >
      <CircularProgress color="success" sx={{ mb: 4 }} size={64} />
      <Typography variant="h6" fontWeight={700} color="#00796b" letterSpacing={1.2}>
        Loading Doctor Data...
      </Typography>
    </Box>
  )}

  {error && (
    <Alert severity="error" sx={{ mb: 5, fontSize: '1.25rem', fontWeight: '600' }}>
      {error}
    </Alert>
  )}

  {!loading && !error && (
    <>
      {doctorDetails && (
        <Paper
          elevation={7}
          sx={{
            p: { xs: 3, sm: 5 },
            mb: 7,
            borderRadius: 5,
            background: 'linear-gradient(135deg, #bbe1fa, #3282b8)',
            boxShadow: '0 10px 30px rgba(0, 100, 160, 0.1)',
            borderLeft: '8px solid #05668d',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: '900',
              color: '#004d40',
              letterSpacing: 2,
              textShadow: '0 1px 6px rgba(0,77,64,0.3)',
            }}
          >
            Doctor Details
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <PersonIcon color="success" sx={{ fontSize: 28 }} />,
                label: 'Name',
                value: (doctorDetails.firstName || '') + ' ' + (doctorDetails.lastName || ''),
              },
              {
                icon: <WorkIcon color="success" sx={{ fontSize: 28 }} />,
                label: 'Specialization',
                value: doctorDetails.specialization,
              },
              {
                icon: <Typography />,
                label: 'Custom ID',
                value: doctorDetails.customId || 'N/A',
              },
              {
                icon: <Typography />,
                label: 'Email',
                value: doctorDetails.email || 'N/A',
              },
              {
                icon: <Typography />,
                label: 'Contact',
                value: doctorDetails.contactNumber || 'N/A',
              },
            ].map(({ icon, label, value }) => (
              <Grid item xs={12} md={6} key={label}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {icon}
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#004d40', fontSize: '1.1rem' }}>
                    {label}:
                    <Typography component="span" sx={{ fontWeight: 700, ml: 1, fontSize: '1.15rem' }}>
                      {value}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Paper
        elevation={9}
        sx={{
          p: { xs: 5, sm: 7 },
          borderRadius: 5,
          background: 'linear-gradient(145deg, #ffffff, #e3f2fd)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
          mb: 7,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 900,
            color: '#05668d',
            letterSpacing: 1.5,
            mb: 5,
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          Manage My Availability
        </Typography>

        {/* Form content: consultation slots, breaks, leave dates here */}

        {/* You can insert your form controls here wrapped in new Boxes or Grids with consistent spacing and padding, for example: */}

        {/* Consultation Slots Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: '#e8f0fe',
            boxShadow: '0 6px 18px rgba(66, 133, 244, 0.15)',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#1a73e8', mb: 3 }}
          >
            Daily Consultation Slots
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="day-select-label">Day of Week</InputLabel>
                <Select
                  labelId="day-select-label"
                  id="day-select"
                  value={selectedDayForSlot}
                  label="Day of Week"
                  onChange={(e) => setSelectedDayForSlot(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Day</em>
                  </MenuItem>
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                size="small"
                value={newSlotStartTime}
                onChange={(e) => setNewSlotStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="End Time"
                type="time"
                fullWidth
                size="small"
                value={newSlotEndTime}
                onChange={(e) => setNewSlotEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddSlot}
                fullWidth
                size="small"
              >
                Add Slot
              </Button>
            </Grid>
          </Grid>

          <List sx={{ mt: 2 }}>
            {dailyAvailability.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                No daily slots set.
              </Typography>
            ) : (
              dailyAvailability.map((dayData) => (
                <Box
                  key={dayData.day}
                  sx={{
                    mb: 1.5,
                    borderBottom: '1px dashed #a1c2fa',
                    pb: 1.5,
                    backgroundColor: '#f5faff',
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ mb: 1, color: '#0f4c81' }}
                  >
                    {dayData.day}:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1}>
                    {dayData.slots.map((slot, index) => (
                      <Chip
                        key={`${dayData.day}-slot-${index}`}
                        label={`${formatInstantToHHMM(slot.startTime)} - ${formatInstantToHHMM(
                          slot.endTime
                        )}`}
                        onDelete={() => handleRemoveSlot(dayData.day, slot)}
                        deleteIcon={<RemoveCircleOutlineIcon color="error" />}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                  {dayData.breakSlots && dayData.breakSlots.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Breaks:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" spacing={1}>
                        {dayData.breakSlots.map((bSlot, index) => (
                          <Chip
                            key={`${dayData.day}-break-${index}`}
                            label={`${formatInstantToHHMM(bSlot.startTime)} - ${formatInstantToHHMM(
                              bSlot.endTime
                            )}`}
                            onDelete={() => handleRemoveBreak(dayData.day, bSlot)}
                            deleteIcon={<RemoveCircleOutlineIcon color="warning" />}
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              ))
            )}
          </List>
        </Paper>

        {/* Break Times Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: '#fff8e1',
            boxShadow: '0 4px 15px rgba(255, 193, 7, 0.15)',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#ffb300', mb: 3 }}
          >
            Add Daily Break Times
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="day-select-break-label">Day of Week (for Break)</InputLabel>
                <Select
                  labelId="day-select-break-label"
                  id="day-select-break"
                  value={selectedDayForSlot}
                  label="Day of Week (for Break)"
                  onChange={(e) => setSelectedDayForSlot(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Day</em>
                  </MenuItem>
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Break Start Time"
                type="time"
                fullWidth
                size="small"
                value={newBreakStartTime}
                onChange={(e) => setNewBreakStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Break End Time"
                type="time"
                fullWidth
                size="small"
                value={newBreakEndTime}
                onChange={(e) => setNewBreakEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddBreak}
                fullWidth
                size="small"
              >
                Add Break
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Leave Dates Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 6,
            borderRadius: 3,
            bgcolor: '#fce4ec',
            boxShadow: '0 4px 15px rgba(244, 143, 177, 0.15)',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#d81b60', mb: 3 }}
          >
            Doctor Leave Dates
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                label="Leave Date"
                type="date"
                fullWidth
                size="small"
                value={newLeaveDate}
                onChange={(e) => setNewLeaveDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="error"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddLeaveDate}
                fullWidth
                size="small"
              >
                Add Leave
              </Button>
            </Grid>
          </Grid>

          <List sx={{ mt: 3 }}>
            {leaveDates.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 3 }}
              >
                No leave dates set.
              </Typography>
            ) : (
              leaveDates.map((date, index) => (
                <ListItem
                  key={`${date}-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveLeaveDate(date)}
                    >
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: '1px dashed #f8bbd0',
                    mb: 1,
                    backgroundColor: '#fce4ec',
                    borderRadius: 2,
                  }}
                >
                  <ListItemText primary={new Date(date).toLocaleDateString()} />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Paper>
    </>
  )}

  <Box mt={5}>
    <Button
      variant="contained"
      color="secondary"
      startIcon={savingAvailability ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
      onClick={handleSaveAvailability}
      disabled={savingAvailability || !doctorDetails?.id}
      fullWidth
      sx={{
        py: 2,
        fontSize: '1.25rem',
        fontWeight: '900',
        borderRadius: 3,
        boxShadow: '0 8px 35px rgba(5, 102, 141, 0.4)',
        transition: 'transform 0.25s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 14px 48px rgba(5, 102, 141, 0.55)',
        },
      }}
    >
      {savingAvailability ? 'Saving Schedule...' : 'Save My Availability'}
    </Button>
  </Box>

  {scheduleData.length === 0 ? (
    <Alert severity="info" sx={{ mb: 4, fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
      No schedule entries found for this doctor.
    </Alert>
  ) : (
    <Paper
      elevation={9}
      sx={{
        p: { xs: 5, sm: 6 },
        borderRadius: 5,
        background: 'linear-gradient(145deg, #ffffff, #e3f2fd)',
        boxShadow: '0 14px 55px rgba(0,0,0,0.15)',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 5, fontWeight: 900, color: '#05668d', fontSize: { xs: '2rem', sm: '2.6rem' } }}
      >
        Upcoming Activities
      </Typography>

      <TableContainer sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table
          sx={{
            minWidth: 700,
            tableLayout: 'fixed',
          }}
          aria-label="doctor schedule table"
        >
          <TableHead>
            <TableRow sx={{ bgcolor: '#bbdefb' }}>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Day/Date</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#0a3d62' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleData.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#e3f2fb' },
                  cursor: 'default',
                  userSelect: 'none',
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                <TableCell>
                  {row.type === 'Leave' ? row.date || 'N/A' : row.day || 'N/A'}
                </TableCell>
                <TableCell>{row.time || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={row.type || 'N/A'}
                    color={
                      row.type === 'Break'
                        ? 'warning'
                        : row.type === 'Leave'
                        ? 'error'
                        : 'primary'
                    }
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>{row.activity || 'N/A'}</TableCell>
                <TableCell>{row.location || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status || 'Unknown'}
                    color={
                      row.status === 'Scheduled'
                        ? 'info'
                        : row.status === 'Completed'
                        ? 'success'
                        : row.status === 'Cancelled'
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )}

  <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center', fontStyle: 'italic', fontWeight: 600, color: '#444' }}>
    <Typography variant="body2">
      View and manage your personal work schedule and availability.
    </Typography>
  </Box>

  {/* Snackbar components for notifications */}
  {/* Apply consistent styling with rounded corners, shadows and colored icons */}
</Box>
  );
};

DoctorMySchedule.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorMySchedule;
