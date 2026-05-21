import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DoctorPrescriptionsPage = ({ medicalRecordId, onBack }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form control states
  const [openFormType, setOpenFormType] = useState(null); // 'Medicine' or 'Test' or null
  const [isAdding, setIsAdding] = useState(false);

  const emptyForm = {
    medicationName: '',
    dosage: '',
    frequency: '',
    route: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    notes: '',
    medicalRecordId,
    prescriptionType: '', // 'Medicine' or 'Test'
  };

  const [newPrescription, setNewPrescription] = useState(emptyForm);

  const prescribedByDoctorId = 'doctor-123';

  // Fetch prescriptions for the medical record
  const fetchPrescriptions = async () => {
    if (!medicalRecordId) {
      setError('Medical Record ID is missing. Cannot fetch prescriptions.');
      setPrescriptions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:2006/api/prescriptions/medical/${medicalRecordId}`);

      if (response.status === 404) {
        // No prescriptions found; treat as empty list, NOT error
        setPrescriptions([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch prescriptions: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions.');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalRecordId]);

  // Open form handler
  const handleOpenForm = (type) => {
    setOpenFormType(type);
    setNewPrescription({ ...emptyForm, prescriptionType: type });
  };

  // Close form handler
  const handleCloseForm = () => {
    setOpenFormType(null);
    setNewPrescription(emptyForm);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  // Add prescription (POST)
  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError(null);

    // Prepare formatted prescription object
    const formattedPrescription = {
      ...newPrescription,
      startDate: newPrescription.startDate ? `${newPrescription.startDate}T00:00:00` : null,
      endDate: newPrescription.endDate ? `${newPrescription.endDate}T00:00:00` : null,
      prescribedByDoctorId,
      prescriptionDate: new Date().toISOString(),
      medicalRecordId,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_MEDICAL_RECORD_SERVICE_URL}/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPrescription),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add prescription: ${response.status} - ${errorText}`);
      }

      // Refresh list on success
      await fetchPrescriptions();
      handleCloseForm();
    } catch (err) {
      setError(err.message || 'Failed to add prescription.');
    } finally {
      setIsAdding(false);
    }
  };

  // Icon and color mapping based on prescriptionType
  const typeProps = (type) =>
    type === 'Medicine'
      ? { color: 'primary', icon: <LocalPharmacyIcon /> }
      : { color: 'secondary', icon: <BiotechIcon /> };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 3 }}>
        Back to Medical Record Details
      </Button>

      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Prescriptions 
      </Typography>

      {/* Add prescription buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<LocalPharmacyIcon />} onClick={() => handleOpenForm('Medicine')}>
          Add Medicine
        </Button>
        <Button variant="contained" color="secondary" startIcon={<BiotechIcon />} onClick={() => handleOpenForm('Test')}>
          Add Test
        </Button>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading Prescriptions...
          </Typography>
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Info message if no prescriptions */}
      {!loading && !error && prescriptions.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 3, fontStyle: 'italic' }}
        >
          No prescriptions found for this medical record.
        </Typography>
      )}

      {/* Prescription list */}
      {!loading && !error && prescriptions.length > 0 && (
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(145deg, #fff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Prescription List
          </Typography>
          <List>
            {prescriptions.map((p, idx) => (
              <React.Fragment key={p.id || idx}>
                <ListItem alignItems="flex-start" sx={{ alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                        <Chip
                          icon={typeProps(p.prescriptionType).icon}
                          label={p.prescriptionType}
                          color={typeProps(p.prescriptionType).color}
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {p.prescriptionType === 'Test' ? 'Test Name' : 'Medication'}: {p.medicationName || 'N/A'}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        {p.prescriptionType === 'Medicine' && (
                          <>
                            <Typography component="span" variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                              Dosage: {p.dosage || 'N/A'} &nbsp; Frequency: {p.frequency || 'N/A'}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              Route: {p.route || 'N/A'}
                            </Typography>
                          </>
                        )}
                        <Typography component="span" variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                          Start: {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                          End: {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                          Notes: {p.notes || 'No notes provided'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Prescribed by Doctor ID: {p.prescribedByDoctorId || 'N/A'}
                          {p.prescriptionDate && <> on {new Date(p.prescriptionDate).toLocaleDateString()}</>}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {idx < prescriptions.length - 1 && <Divider component="li" sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Form dialog for adding prescriptions */}
      <Dialog open={!!openFormType} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {openFormType === 'Medicine' ? 'Add Medicine Prescription' : 'Add Test Prescription'}
        </DialogTitle>
        <form onSubmit={handleAddPrescription}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="medicationName"
              label={openFormType === 'Medicine' ? 'Medication Name' : 'Test Name'}
              type="text"
              fullWidth
              variant="outlined"
              value={newPrescription.medicationName}
              onChange={handleFormChange}
              required
              sx={{ mb: 2 }}
            />
            {openFormType === 'Medicine' && (
              <>
                <TextField
                  margin="dense"
                  name="dosage"
                  label="Dosage"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newPrescription.dosage}
                  onChange={handleFormChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  name="frequency"
                  label="Frequency"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newPrescription.frequency}
                  onChange={handleFormChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  name="route"
                  label="Route"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newPrescription.route}
                  onChange={handleFormChange}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <TextField
              margin="dense"
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newPrescription.startDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newPrescription.endDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="notes"
              label="Notes"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newPrescription.notes}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} disabled={isAdding}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Prescription'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

DoctorPrescriptionsPage.propTypes = {
  medicalRecordId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};

export default DoctorPrescriptionsPage;
