import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Divider, Chip, CircularProgress, Alert, Button, ListItemIcon
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';

const APPOINTMENTS_API_URL = `${import.meta.env.VITE_APPOINTMENT_SERVICE_URL}/api/appointments';
const BILLS_API_BASE_URL = `${import.meta.env.VITE_BILL_SERVICE_URL}/api/bills/appointments';
const BILL_TYPE = 'Consultation';

// ------ Helpers to handle backend Instant ------
const formatDate = (instantString) => {
  if (!instantString) return 'N/A';
  return new Date(instantString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (instantString) => {
  if (!instantString) return 'N/A';
  return new Date(instantString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NursePatientCare = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(APPOINTMENTS_API_URL);
        if (!res.ok) throw new Error(`Failed to fetch appointments: ${res.status}`);
        const data = await res.json();

        // ---- Filter for today's appointments using date-only (UTC) ----
     // Today's date in local time
const today = new Date();
const todayDateOnly = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const todaysAppointments = data.filter(appt => {
  if (!appt.appointmentDate) return false;
  const apptDateObj = new Date(appt.appointmentDate); // parse Instant
  const apptDateOnly = `${apptDateObj.getFullYear()}-${String(apptDateObj.getMonth() + 1).padStart(2, '0')}-${String(apptDateObj.getDate()).padStart(2, '0')}`;
  return apptDateOnly === todayDateOnly;
});

        setAppointments(todaysAppointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchBillData = async () => {
      if (!selectedAppointmentId) return;
      setLoading(true);
      setError(null);
      setBillData(null);
      try {
        const res = await fetch(`${BILLS_API_BASE_URL}/${selectedAppointmentId}/type/${BILL_TYPE}`);
        if (!res.ok) {
          if (res.status === 204) {
            setError(`No ${BILL_TYPE} bill found for this appointment.`);
            return;
          }
          throw new Error(`Failed to fetch bill data: ${res.status}`);
        }
        const text = await res.text();
        if (!text) {
          setError(`No ${BILL_TYPE} bill found for this appointment.`);
          return;
        }
        const data = JSON.parse(text);
        if (Array.isArray(data) && data.length > 0) {
          setBillData(data[0]);
        } else {
          setError(`No ${BILL_TYPE} bill found for this appointment.`);
        }
      } catch (err) {
        setError(`Could not process bill data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBillData();
  }, [selectedAppointmentId]);

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
  };

  const handleBack = () => {
    setSelectedAppointmentId(null);
    setBillData(null);
    setError(null);
  };

  if (loading) {
    return <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <CircularProgress />
    </Box>;
  }

  // ======= BILL VIEW =======
  if (selectedAppointmentId) {
    return (
      <Box sx={{ p:{ xs:2, md:4 }, maxWidth:960, mx:'auto', width:'100%' }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb:3 }}>
          Back to Appointments
        </Button>
        <Paper elevation={6} sx={{ p:{ xs:2, md:4 }, borderRadius:3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight:'bold', mb:3 }}>
            <ReceiptIcon sx={{ mr:1 }} />
            {BILL_TYPE} Bill Details
          </Typography>
          {billData ? (
            <List>
              <ListItem><ListItemIcon><EventNoteIcon /></ListItemIcon>
                <ListItemText primary="Appointment ID" secondary={billData.appointmentId} />
              </ListItem>
              <ListItem><ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Patient ID" secondary={billData.patientId} />
              </ListItem>
              <ListItem><ListItemIcon><ReceiptIcon /></ListItemIcon>
                <ListItemText primary="Bill ID" secondary={billData.billId} />
              </ListItem>
              <Divider sx={{ my:2 }}/>
              <ListItem><ListItemIcon><AttachMoneyIcon color="success" /></ListItemIcon>
                <ListItemText primary="Total Amount" secondary={`$${billData.totalAmount}`} />
              </ListItem>
              <ListItem><ListItemIcon><PaidIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Amount Paid" secondary={`$${billData.amountPaid}`} />
              </ListItem>
              <ListItem><ListItemIcon><AccountBalanceWalletIcon color="warning" /></ListItemIcon>
                <ListItemText primary="Balance Due" secondary={`$${billData.balanceDue}`} />
              </ListItem>
              <ListItem><ListItemIcon><CreditCardIcon color="info" /></ListItemIcon>
                <ListItemText primary="Payment Method" secondary={billData.paymentMode} />
              </ListItem>
              <Divider sx={{ my:2 }}/>
              <ListItem><ListItemIcon><AccessTimeIcon /></ListItemIcon>
                <ListItemText primary="Bill Date" secondary={formatDate(billData.billDate)} />
              </ListItem>
              <ListItem><ListItemIcon><LocalHospitalIcon /></ListItemIcon>
                <ListItemText primary="Issued By" secondary={`User ID: ${billData.issuedByUserId}`} />
              </ListItem>
              <ListItem><ListItemIcon><PaymentIcon /></ListItemIcon>
                <ListItemText primary="Transaction ID" secondary={billData.transactionId} />
              </ListItem>
            </List>
          ) : (
            <Typography align="center" color="text.secondary" sx={{ mt:2 }}>No bill available.</Typography>
          )}
        </Paper>
      </Box>
    );
  }

  // ======= APPOINTMENTS LIST VIEW =======
  return (
    <Box sx={{ p:{ xs:2, md:4 }, maxWidth:960, mx:'auto', width:'100%' }}>
      <Typography variant="h4" align="center" sx={{ fontWeight:'bold', mb:4 }}>Today's Appointments</Typography>
      <Paper elevation={6} sx={{ p:{ xs:2, md:4 }, borderRadius:3 }}>
        <Typography variant="h5" sx={{ mb:3, fontWeight:'bold' }}>Scheduled for Today</Typography>
        <List>
          {appointments.length > 0 ? appointments.map((appt, idx) => (
            <React.Fragment key={appt.id}>
              <ListItem sx={{ cursor:'pointer', py:2, '&:hover':{ bgcolor:'#f5f5f5' }}} onClick={() => handleAppointmentClick(appt.id)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor:'primary.main', width:60, height:60 }}>
                    <EventNoteIcon fontSize="large" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight:'bold' }}>
                      Appointment ID: {appt.id} <Chip label={appt.status} size="small" color={appt.status==='Completed'?'success':'warning'} sx={{ ml:1 }} />
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        <AccessTimeIcon sx={{ fontSize:16, mr:0.5, verticalAlign:'middle' }}/>
                        Date: {formatDate(appt.appointmentDate)} at {formatTime(appt.appointmentTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocalHospitalIcon sx={{ fontSize:16, mr:0.5, verticalAlign:'middle' }}/>
                        Reason: {appt.reasonForVisit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <RoomIcon sx={{ fontSize:16, mr:0.5, verticalAlign:'middle' }}/>
                        Room: {appt.roomNumber}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {idx < appointments.length-1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          )) : <Typography align="center" color="text.secondary">No appointments for today.</Typography>}
        </List>
      </Paper>
    </Box>
  );
};

export default NursePatientCare;
