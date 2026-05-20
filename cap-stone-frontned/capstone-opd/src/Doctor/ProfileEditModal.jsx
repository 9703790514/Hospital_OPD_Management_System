import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// --- Profile Edit Modal Component ---
const ProfileEditModal = ({ open, handleClose, user, onSave }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    // Sync the local form data with the user prop whenever it changes
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveClick = () => {
    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData?.name || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={formData?.email || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="specialty"
          label="Specialty"
          type="text"
          fullWidth
          variant="outlined"
          value={formData?.specialty || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={formData?.phone || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProfileEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProfileEditModal;
