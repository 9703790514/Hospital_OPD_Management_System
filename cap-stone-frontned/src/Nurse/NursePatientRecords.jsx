import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
    Chip, CircularProgress, Alert, Button, Divider, List, ListItem,
    ListItemIcon, ListItemText, Grid, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotesIcon from '@mui/icons-material/Notes';
import RoomIcon from '@mui/icons-material/Room';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WcIcon from '@mui/icons-material/Wc';

const APPOINTMENTS_API_URL = `${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments';
const VITALS_API_URL = `${import.meta.env.VITE_NURSE_CHECKUP_SERVICE_URL}/api/nurse-checkups';
const PATIENTS_API_URL = `${import.meta.env.VITE_PATIENT_SERVICE_URL}/api/patients';

const App = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [vitalsData, setVitalsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        appointmentId: '',
        patientId: '',
        date: new Date().toISOString(),
        vitals: {
            bloodPressure: { systolic: '', diastolic: '', unit: 'mmHg' },
            bloodSugar: { value: '', unit: 'mg/dL' },
            pulseRate: '',
            respiratoryRate: '',
            temperature: { value: '', unit: 'F' },
            oxygenSaturation: { value: '', unit: '%' },
            weightKg: '',
            heightCm: '',
        },
        notes: ''
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const appointmentsResponse = await fetch(APPOINTMENTS_API_URL);
                if (!appointmentsResponse.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const appointmentsData = await appointmentsResponse.json();

                const patientPromises = appointmentsData.map(appointment =>
                    fetch(`${PATIENTS_API_URL}/${appointment.patientId}`).then(res => {
                        if (!res.ok) {
                            return { id: appointment.patientId, error: 'Not found' };
                        }
                        return res.json();
                    })
                );

                const patientDataList = await Promise.all(patientPromises);

                const combinedAppointments = appointmentsData.map(appointment => {
                    const patient = patientDataList.find(p => p._id === appointment.patientId);
                    return { ...appointment, patient };
                });

                setAppointments(combinedAppointments);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchVitals = async () => {
            if (!selectedAppointment) return;

            setLoading(true);
            setError(null);

            try {
                const vitalsResponse = await fetch(`${VITALS_API_URL}/appointment/${selectedAppointment.id}`);

                if (!vitalsResponse.ok) {
                    if (vitalsResponse.status === 404) {
                        setVitalsData(null);
                        setIsEditing(true);
                        setFormData(prev => ({
                            ...prev,
                            appointmentId: selectedAppointment.id,
                            patientId: selectedAppointment.patientId
                        }));
                        return;
                    }
                    throw new Error('Failed to fetch vitals data.');
                }

                const data = await vitalsResponse.json();

                if (data && data.id) {
                    setVitalsData(data);
                    setIsEditing(false);
                    setFormData({
                        ...data,
                        vitals: {
                            ...data.vitals,
                            bloodPressure: {
                                ...data.vitals.bloodPressure,
                                systolic: data.vitals.bloodPressure.systolic || '',
                                diastolic: data.vitals.bloodPressure.diastolic || '',
                            }
                        }
                    });
                } else {
                    setVitalsData(null);
                    setIsEditing(true);
                    setFormData(prev => ({
                        ...prev,
                        appointmentId: selectedAppointment.id,
                        patientId: selectedAppointment.patientId
                    }));
                }
            } catch (err) {
                setError('Could not retrieve vitals. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (selectedAppointment) {
            fetchVitals();
        }
    }, [selectedAppointment]);

    const handleViewVitals = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleBack = () => {
        setSelectedAppointment(null);
        setVitalsData(null);
        setIsEditing(false);
    };

    const handleVitalsInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                vitals: {
                    ...prev.vitals,
                    [parent]: {
                        ...prev.vitals[parent],
                        [child]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                vitals: {
                    ...prev.vitals,
                    [name]: value
                }
            }));
        }
    };

    const handleSaveVitals = async () => {
        setLoading(true);
        setError(null);

        const vitalsToSave = {
            ...formData,
            vitals: {
                ...formData.vitals,
                bloodPressure: {
                    ...formData.vitals.bloodPressure,
                    systolic: Number(formData.vitals.bloodPressure.systolic),
                    diastolic: Number(formData.vitals.bloodPressure.diastolic),
                },
                bloodSugar: {
                    ...formData.vitals.bloodSugar,
                    value: Number(formData.vitals.bloodSugar.value),
                },
                pulseRate: Number(formData.vitals.pulseRate),
                respiratoryRate: Number(formData.vitals.respiratoryRate),
                temperature: {
                    ...formData.vitals.temperature,
                    value: Number(formData.vitals.temperature.value),
                },
                oxygenSaturation: {
                    ...formData.vitals.oxygenSaturation,
                    value: Number(formData.vitals.oxygenSaturation.value),
                },
                weightKg: Number(formData.vitals.weightKg),
                heightCm: Number(formData.vitals.heightCm),
            }
        };

        try {
            const url = vitalsData
                ? `${VITALS_API_URL}/${vitalsData.id}`
                : VITALS_API_URL;
            const method = vitalsData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vitalsToSave),
            });

            if (!response.ok) {
                throw new Error('Failed to save vitals data.');
            }

            const savedData = await response.json();
            setVitalsData(savedData);
            setIsEditing(false);
        } catch (err) {
            setError('Could not save vitals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, maxWidth: 960, mx: 'auto' }}>
                <Alert severity="error">Error: {error}</Alert>
            </Box>
        );
    }

    if (selectedAppointment) {
        const patientData = selectedAppointment.patient;

        const renderVitalsView = () => (
            <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                    Vitals for Appointment {selectedAppointment.id}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Patient Details</Typography>
                {patientData ? (
                    <List disablePadding>
                        <ListItem>
                            <ListItemIcon><PersonIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Name" secondary={`${patientData.first_name} ${patientData.last_name}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CakeIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Date of Birth" secondary={patientData.date_of_birth} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><WcIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Gender" secondary={patientData.gender} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Contact" secondary={patientData.contact_number} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><LocationOnIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Address" secondary={patientData.address} />
                        </ListItem>
                    </List>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                        Patient details not found.
                    </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Vitals Data</Typography>
                {vitalsData ? (
                    <List>
                        <ListItem>
                            <ListItemIcon><FavoriteIcon color="error" /></ListItemIcon>
                            <ListItemText primary="Pulse Rate" secondary={`${vitalsData.vitals.pulseRate} bpm`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><BloodtypeIcon color="info" /></ListItemIcon>
                            <ListItemText primary="Blood Pressure" secondary={`${vitalsData.vitals.bloodPressure.systolic}/${vitalsData.vitals.bloodPressure.diastolic} ${vitalsData.vitals.bloodPressure.unit}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><ThermostatIcon color="warning" /></ListItemIcon>
                            <ListItemText primary="Temperature" secondary={`${vitalsData.vitals.temperature.value} Â°${vitalsData.vitals.temperature.unit}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><MonitorHeartIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Respiratory Rate" secondary={`${vitalsData.vitals.respiratoryRate} breaths/min`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><BloodtypeIcon color="success" /></ListItemIcon>
                            <ListItemText primary="Blood Oxygen" secondary={`${vitalsData.vitals.oxygenSaturation.value}${vitalsData.vitals.oxygenSaturation.unit}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><FitnessCenterIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Weight" secondary={`${vitalsData.vitals.weightKg} kg`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><HeightIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Height" secondary={`${vitalsData.vitals.heightCm} cm`} />
                        </ListItem>
                    </List>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                        No vitals data found.
                    </Typography>
                )}

                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                        {vitalsData ? 'Edit Vitals' : 'Add Vitals'}
                    </Button>
                </Box>
            </Paper>
        );

        const renderVitalsForm = () => (
            <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                    {vitalsData ? 'Edit Vitals' : 'Add New Vitals'}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Patient Details</Typography>
                {patientData ? (
                    <List disablePadding sx={{ mb: 2 }}>
                        <ListItem>
                            <ListItemIcon><PersonIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Name" secondary={`${patientData.first_name} ${patientData.last_name}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CakeIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Date of Birth" secondary={patientData.date_of_birth} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon color="action" /></ListItemIcon>
                            <ListItemText primary="Contact" secondary={patientData.contact_number} />
                        </ListItem>
                    </List>
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                        Patient details not available.
                    </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pulse Rate (bpm)"
                            name="pulseRate"
                            value={formData.vitals.pulseRate}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Systolic Blood Pressure (mmHg)"
                            name="bloodPressure.systolic"
                            value={formData.vitals.bloodPressure.systolic}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Diastolic Blood Pressure (mmHg)"
                            name="bloodPressure.diastolic"
                            value={formData.vitals.bloodPressure.diastolic}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Blood Sugar (mg/dL)"
                            name="bloodSugar.value"
                            value={formData.vitals.bloodSugar.value}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Temperature (Â°F)"
                            name="temperature.value"
                            value={formData.vitals.temperature.value}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Respiratory Rate (breaths/min)"
                            name="respiratoryRate"
                            value={formData.vitals.respiratoryRate}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Oxygen Saturation (%)"
                            name="oxygenSaturation.value"
                            value={formData.vitals.oxygenSaturation.value}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Weight (kg)"
                            name="weightKg"
                            value={formData.vitals.weightKg}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Height (cm)"
                            name="heightCm"
                            value={formData.vitals.heightCm}
                            onChange={handleVitalsInputChange}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="success" onClick={handleSaveVitals}>
                        Save Vitals
                    </Button>
                    {vitalsData && (
                        <Button variant="outlined" color="info" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    )}
                </Box>
            </Paper>
        );

        return (
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: 'auto', width: '100%' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                >
                    Back to Appointments
                </Button>

                {isEditing ? renderVitalsForm() : renderVitalsView()}
            </Box>
        );
    }

    // Filter to today's appointments only
   // Get today's date in local time as YYYY-MM-DD
const today = new Date();
const todayDateOnly = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

const todaysAppointments = appointments.filter(appt => {
  if (!appt.appointmentDate) return false;
  const apptDate = new Date(appt.appointmentDate); // parse Instant
  const apptDateOnly = `${apptDate.getFullYear()}-${String(apptDate.getMonth() + 1).padStart(2,'0')}-${String(apptDate.getDate()).padStart(2,'0')}`;
  return apptDateOnly === todayDateOnly;
});


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: 'auto', width: '100%' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
                Patient Appointments for Today
            </Typography>

            <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    View and Manage Today's Appointments
                </Typography>

                {todaysAppointments.length > 0 ? (
                    todaysAppointments.map((appointment) => (
                        <Accordion key={appointment.id} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${appointment.id}-content`}
                                id={`panel-${appointment.id}-header`}
                                sx={{ bgcolor: '#e3f2fd', borderRadius: 'inherit', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}
                            >
                                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                                    <EventNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Appointment for {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : 'Patient details loading...'}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <LocalHospitalIcon fontSize="small" sx={{ mr: 1 }} /> Patient ID:
                                    <Chip label={appointment.patientId} size="small" color="info" sx={{ ml: 1 }} />
                                </Typography>

                                {appointment.patient ? (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Patient Name:
                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                {`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                                            </Typography>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                            <CakeIcon fontSize="small" sx={{ mr: 1 }} /> Date of Birth:
                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                {appointment.patient.date_of_birth}
                                            </Typography>
                                        </Typography>
                                    </>
                                ) : (
                                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <CircularProgress size={20} />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                            Loading patient details...
                                        </Typography>
                                    </Box>
                                )}

                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} /> Date & Time:
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {appointment.appointmentDate} at {new Date(appointment.appointmentTime).toLocaleTimeString()}
                                    </Typography>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <RoomIcon fontSize="small" sx={{ mr: 1 }} /> Room:
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {appointment.roomNumber}
                                    </Typography>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <NotesIcon fontSize="small" sx={{ mr: 1 }} /> Reason for Visit:
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {appointment.reasonForVisit}
                                    </Typography>
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <NotesIcon fontSize="small" sx={{ mr: 1 }} /> Status:
                                    <Chip label={appointment.status} size="small" color={appointment.status === 'Completed' ? 'success' : 'warning'} sx={{ ml: 1 }} />
                                </Typography>
                                
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<MonitorHeartIcon />}
                                    sx={{ mt: 2 }}
                                    onClick={() => handleViewVitals(appointment)}
                                >
                                    View Vitals
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography align="center" color="text.secondary">
                        No appointments found for today.
                    </Typography>
                )}
            </Paper>

            <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    This section displays a list of patient appointments scheduled for today only.
                </Typography>
            </Box>
        </Box>
    );
};

export default App;
