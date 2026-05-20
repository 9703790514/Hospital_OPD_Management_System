// FrontDeskProfileMenu.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

// Utility: generate consistent avatar background color from a string
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

// Utility: create avatar initials and styling
function stringAvatar(name) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'FD';
  return {
    sx: { bgcolor: stringToColor(name || 'Front Desk User'), fontWeight: 'bold', fontSize: 20 },
    children: initials,
  };
}

// Utility to convert Base64 string to Data URL
const toDataURL = (base64) => {
  if (!base64 || base64.startsWith('data:')) return base64;
  return `data:image/png;base64,${base64}`;
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FrontDeskProfileMenu({ user, onLogout, onProfilePicChange, loading, onNavigate }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [localPic, setLocalPic] = useState(toDataURL(user?.profilePic) || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const newPic = toDataURL(user?.profilePic);
    if (newPic && newPic !== localPic && !localPic?.startsWith('blob:')) {
      setLocalPic(newPic);
    }
  }, [user?.profilePic]);

  useEffect(() => {
    setNewName(user?.name || '');
  }, [user?.name]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setIsEditingName(false);
    setIsEditingPassword(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setLocalPic(previewUrl);
      handleClose();
      await handleProfilePicUpload(file);
    }
  };

  const handleProfilePicUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`http://localhost:2002/api/users/${user.userId}/profile-pic`, {
        method: 'PATCH',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload profile picture.');
      const updatedUser = await response.json();
      if (onProfilePicChange) {
        onProfilePicChange(toDataURL(updatedUser.image));
      }
      setSnackbar({ open: true, message: 'Profile picture updated successfully!', severity: 'success' });
    } catch {
      setLocalPic(toDataURL(user?.profilePic) || null);
      setSnackbar({ open: true, message: 'Failed to update profile picture.', severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:2002/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newName }),
      });
      if (!response.ok) throw new Error('Failed to update name.');
      setSnackbar({ open: true, message: 'Name updated successfully!', severity: 'success' });
      handleClose();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update name.', severity: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setSnackbar({ open: true, message: 'Password must be at least 8 characters.', severity: 'error' });
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:2002/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!response.ok) throw new Error('Failed to update password.');
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
      handleClose();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update password.', severity: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderNameUpdateForm = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Update Name</Typography>
      <TextField value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth sx={{ mb: 2 }} disabled={isUpdating} />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button color="error" onClick={handleClose} disabled={isUpdating} startIcon={<CloseIcon />}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleNameUpdate} disabled={isUpdating || !newName.trim()} startIcon={<CheckIcon />}>
          {isUpdating ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );

  const renderPasswordUpdateForm = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Change Password</Typography>
      <TextField 
        label="New Password" type="password" variant="outlined" fullWidth value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} disabled={isUpdating} 
      />
      <TextField 
        label="Confirm New Password" type="password" variant="outlined" fullWidth value={confirmNewPassword} 
        onChange={(e) => setConfirmNewPassword(e.target.value)} sx={{ mb: 2 }} disabled={isUpdating} 
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button color="error" onClick={handleClose} disabled={isUpdating} startIcon={<CloseIcon />}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handlePasswordUpdate} disabled={isUpdating || !newPassword || !confirmNewPassword} startIcon={<CheckIcon />}>
          {isUpdating ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );

  if (loading || isUploading) {
    return (
      <Box sx={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={28} color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Tooltip title="Open Profile Menu" arrow>
        <IconButton
          onClick={handleOpen}
          size="medium"
          sx={{
            ml: 2,
            p: 0,
            borderRadius: '50%',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: `0 0 10px ${theme.palette.primary.main}` },
          }}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="User profile menu"
          disableRipple
        >
          {localPic ? (
            <Avatar alt={user.name} src={localPic} sx={{ width: 44, height: 44, border: `2px solid ${theme.palette.primary.main}` }} />
          ) : (
            <Avatar {...stringAvatar(user.name)} sx={{ width: 44, height: 44, border: `2px solid ${theme.palette.primary.main}` }} />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: { mt: 1.5, minWidth: 320, borderRadius: 2, boxShadow: `rgba(0,0,0,0.24) 0px 8px 16px` },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isEditingName ? renderNameUpdateForm() 
          : isEditingPassword ? renderPasswordUpdateForm() : (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {localPic ? (
                <Avatar alt={user.name} src={localPic} sx={{ width: 72, height: 72, mr: 2, border: `3px solid ${theme.palette.primary.main}` }} />
              ) : (
                <Avatar {...stringAvatar(user.name)} sx={{ width: 72, height: 72, mr: 2, border: `3px solid ${theme.palette.primary.main}` }} />
              )}

              <Box>
                <Typography variant="h6" fontWeight={700} noWrap>{user.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{user.email || 'N/A'}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Account</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }} noWrap><strong>User ID:</strong> {user.userId || 'N/A'}</Typography>
              <Typography variant="body2" noWrap><strong>Email:</strong> {user.email || 'N/A'}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <MenuItem onClick={() => setIsEditingName(true)} sx={{ py: 1.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
              <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              Update Name
            </MenuItem>

            <MenuItem onClick={() => setIsEditingPassword(true)} sx={{ py: 1.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
              <VpnKeyIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              Change Password
            </MenuItem>

            <MenuItem sx={{ py: 1.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
              <label htmlFor="upload-profile-pic" style={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center' }}>
                <CloudUploadIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                Change Profile Picture
              </label>
              <input id="upload-profile-pic" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </MenuItem>

            <Divider sx={{ my: 2 }} />

            <MenuItem onClick={onLogout} sx={{ py: 1.5, px: 2, borderRadius: 1, color: 'error.main', fontWeight: 'bold', '&:hover': { bgcolor: 'error.main', color: 'white' } }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Box>
        )}
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

FrontDeskProfileMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
    userId: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onProfilePicChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onNavigate: PropTypes.func.isRequired,
};
