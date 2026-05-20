import React, { useState, useEffect, forwardRef } from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

// Utility: generate avatar initials and styling
function stringAvatar(name) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'US';
  return {
    sx: { bgcolor: stringToColor(name || 'Default User'), fontWeight: 'bold', fontSize: 20 },
    children: initials,
  };
}

// Utility: Converts a raw Base64 string to a data URI
const toDataURL = (base64) => {
  if (!base64 || base64.startsWith('data:')) {
    return base64;
  }
  return `data:image/png;base64,${base64}`;
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ProfileMenu({ user, onLogout, onProfilePicChange, loading }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [localPic, setLocalPic] = useState(toDataURL(user?.profilePic) || null);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const newPic = toDataURL(user?.profilePic);
    if (newPic && newPic !== localPic && !localPic?.startsWith('blob:')) {
      setLocalPic(newPic);
    }
  }, [user?.profilePic, localPic]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
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

      if (!response.ok) {
        throw new Error('Failed to upload profile picture.');
      }

      const updatedUser = await response.json();
      if (onProfilePicChange) {
        const newImageData = toDataURL(updatedUser.image);
        onProfilePicChange(newImageData);
      }
      setSnackbar({ open: true, message: 'Profile picture updated successfully!', severity: 'success' });
    } catch (error) {
      setLocalPic(toDataURL(user?.profilePic) || null);
      setSnackbar({ open: true, message: 'Failed to update profile picture.', severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

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
            '&:hover': {
              boxShadow: '0 0 8px rgba(25, 118, 210, 0.6)',
            },
          }}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="User profile menu"
          disableRipple
        >
          {localPic ? (
            <Avatar alt={user.name} src={localPic} sx={{ width: 44, height: 44, border: '2px solid #1976d2' }} />
          ) : (
            <Avatar {...stringAvatar(user.name)} sx={{ width: 44, height: 44, border: '2px solid #1976d2' }} />
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
          sx: {
            mt: 1.5,
            minWidth: 320,
            borderRadius: 2,
            p: 2,
            boxShadow: 'rgba(0,0,0,0.24) 0px 8px 16px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {localPic ? (
            <Avatar alt={user.name} src={localPic} sx={{ width: 72, height: 72, mr: 2, border: '3px solid #1976d2' }} />
          ) : (
            <Avatar {...stringAvatar(user.name)} sx={{ width: 72, height: 72, mr: 2, border: '3px solid #1976d2' }} />
          )}
          <Box>
            <Typography variant="h6" fontWeight={700} noWrap>
              {user.name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            User Details
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }} noWrap>
            <strong>User ID:</strong> {user.userId || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }} noWrap>
            <strong>Username:</strong> {user.name || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }} noWrap>
            <strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" noWrap>
            <strong>Email:</strong> {user.email || 'N/A'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <MenuItem
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
          }}
        >
          <label
            htmlFor="upload-profile-pic"
            style={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center' }}
          >
            <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
            Change Profile Picture
          </label>
          <input
            id="upload-profile-pic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </MenuItem>

        <Divider sx={{ my: 2 }} />

        <MenuItem
          onClick={onLogout}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            color: 'error.main',
            fontWeight: 'bold',
            '&:hover': { bgcolor: 'error.main', color: 'white' },
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

ProfileMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
    userId: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onProfilePicChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProfileMenu;
