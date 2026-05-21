import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel, Stack, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'; // For currency settings
import EmailIcon from '@mui/icons-material/Email';

const BillingDeskSettings = ({ billingDeskUser }) => {
  // Static state for settings (can be extended with actual user preferences)
  const [notificationEnabled, setNotificationEnabled] = React.useState(true);
  const [defaultCurrency, setDefaultCurrency] = React.useState('INR');
  const [emailReportFrequency, setEmailReportFrequency] = React.useState('Daily');

  const handleSaveSettings = () => {
    console.log({
      notificationEnabled,
      defaultCurrency,
      emailReportFrequency,
    });
    // In a real application, you would send these settings to a backend API
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Billing Desk Settings
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Financial Preferences
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
                <NotificationsIcon fontSize="small" sx={{ mr: 1 }} /> Enable Payment Notifications
              </Typography>
            }
            sx={{ justifyContent: 'space-between', mx: 0 }}
          />

          <TextField
            label={
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <CurrencyRupeeIcon fontSize="small" sx={{ mr: 1 }} /> Default Currency
              </Typography>
            }
            variant="outlined"
            fullWidth
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            select
          >
            <MenuItem value="INR">Indian Rupee (INR)</MenuItem>
            <MenuItem value="USD">US Dollar (USD)</MenuItem>
            <MenuItem value="EUR">Euro (EUR)</MenuItem>
          </TextField>

          <TextField
            label={
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Email Report Frequency
              </Typography>
            }
            variant="outlined"
            fullWidth
            value={emailReportFrequency}
            onChange={(e) => setEmailReportFrequency(e.target.value)}
            select
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="None">None</MenuItem>
          </TextField>

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
          Configure billing preferences, payment methods, and financial reporting options.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskSettings.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskSettings;
