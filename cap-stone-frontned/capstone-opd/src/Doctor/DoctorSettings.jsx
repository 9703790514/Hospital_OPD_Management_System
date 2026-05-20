import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel, Stack, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';

const DoctorSettings = ({ doctorUser }) => {
  // Static state for settings (can be extended with actual user preferences)
  const [notificationEnabled, setNotificationEnabled] = React.useState(true);
  const [preferredLanguage, setPreferredLanguage] = React.useState('English');
  const [emailUpdates, setEmailUpdates] = React.useState(true);

  const handleSaveSettings = () => {
      notificationEnabled,
      preferredLanguage,
      emailUpdates,
    });
    // In a real application, you would send these settings to a backend API
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Doctor Settings
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          General Preferences
        </Typography>

        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                name="notificationEnabled"
                color="primary"
              />
            }
            label={
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon fontSize="small" sx={{ mr: 1 }} /> Enable Notifications
              </Typography>
            }
            sx={{ justifyContent: 'space-between', mx: 0 }}
          />

          <TextField
            label={
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon fontSize="small" sx={{ mr: 1 }} /> Preferred Language
              </Typography>
            }
            variant="outlined"
            fullWidth
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            select
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="French">French</MenuItem>
            <MenuItem value="German">German</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                name="emailUpdates"
                color="primary"
              />
            }
            label={
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Receive Email Updates
              </Typography>
            }
            sx={{ justifyContent: 'space-between', mx: 0 }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold', alignSelf: 'flex-end' }}
          >
            Save Settings
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Configure your personal dashboard settings and preferences.
        </Typography>
      </Box>
    </Box>
  );
};

DoctorSettings.propTypes = {
  doctorUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default DoctorSettings;
