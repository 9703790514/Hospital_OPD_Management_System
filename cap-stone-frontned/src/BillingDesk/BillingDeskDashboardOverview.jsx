import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { formatDistanceToNow, parseISO } from 'date-fns';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const BillingDeskDashboardOverview = ({ billingDeskUser }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(import.meta.env.VITE_BILL_SERVICE_URL + '/api/bills');
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error('Failed to fetch bills: ' + response.status + ' ' + response.statusText + ' - ' + errorBody);
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  // Stats calculations as before
  const totalBillsGenerated = bills.length;
  const totalAmountBilled = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalAmountReceived = bills.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0);
  const totalOutstandingPayments = bills.reduce((sum, bill) => sum + (bill.balanceDue || 0), 0);
  const numberOfPendingInvoices = bills.filter(bill => bill.balanceDue > 0).length;
  const numberOfPaidBills = bills.filter(bill => bill.balanceDue === 0 && bill.totalAmount > 0).length;

  const recentBillingActivities = bills
    .filter(bill => bill.updatedAt || bill.createdAt)
    .map(bill => {
      const dateString = bill.updatedAt || bill.createdAt;
      const timestamp = parseISO(dateString);
      let text = '';
      if (bill.balanceDue === 0 && bill.totalAmount > 0) {
        text = `Payment received for Bill ${bill.billId || bill.id} (Patient: ${bill.patientId})`;
      } else {
        text = `New bill generated for Patient ${bill.patientId} (Bill ID: ${bill.billId || bill.id})`;
      }
      return {
        id: bill.id,
        text,
        time: formatDistanceToNow(timestamp, { addSuffix: true }),
        timestamp,
      };
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Bills Generated',
      value: totalBillsGenerated,
      icon: <ReceiptLongIcon sx={{ fontSize: 40, color: '#1976d2' }} />,  // Blue
      cardColor: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', // Light blue gradient
      shadowColor: 'rgba(25, 118, 210, 0.3)',
    },
    {
      label: 'Total Amount Billed',
      value: `â‚¹${totalAmountBilled.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,  // Purple
      cardColor: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', // Light purple gradient
      shadowColor: 'rgba(156, 39, 176, 0.3)',
    },
    {
      label: 'Total Amount Received',
      value: `â‚¹${totalAmountReceived.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CurrencyRupeeIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,   // Green
      cardColor: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', // Light green gradient
      shadowColor: 'rgba(46, 125, 50, 0.3)',
    },
    {
      label: 'Outstanding Payments',
      value: `â‚¹${totalOutstandingPayments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <ScheduleIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,  // Red
      cardColor: 'linear-gradient(135deg, #ffebee, #ffcdd2)', // Light red gradient
      shadowColor: 'rgba(211,47,47,0.3)',
    },
    {
      label: 'Pending Invoices',
      value: numberOfPendingInvoices,
      icon: <ReceiptLongIcon sx={{ fontSize: 40, color: '#f57c00' }} />,  // Orange
      cardColor: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', // Light orange gradient
      shadowColor: 'rgba(245, 124, 0, 0.3)',
    },
    {
      label: 'Bills Marked Paid',
      value: numberOfPaidBills,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#0288d1' }} />, // Dark cyan blue
      cardColor: 'linear-gradient(135deg, #e1f5fe, #b3e5fc)', // Light cyan gradient
      shadowColor: 'rgba(2, 136, 209, 0.3)',
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            boxShadow: '0 10px 30px rgba(2, 136, 209, 0.15)',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ mt: 3, color: '#1976d2', fontWeight: 600 }}>
            Loading billing data...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <Alert severity="error" sx={{ mt: 10, fontWeight: 600, backgroundColor: '#ffebee', color: '#d32f2f' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Error: {error}
          </Typography>
          <Typography variant="body1">
            Failed to load billing data. Please check the server connection and try again.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', backgroundColor: '#fafafa', borderRadius: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          mb: 5,
          fontWeight: 900,
          background: 'linear-gradient(90deg, #1976d2, #9c27b0, #2e7d32)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Billing Desk Dashboard Overview
      </Typography>

      <Grid container spacing={4} justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }}>
        {stats.map(({ label, value, icon, cardColor, shadowColor }, index) => (
          <Grid item xs={4} sm={4} md={3} key={index}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: 'center',
                background: cardColor,
                boxShadow: `0 12px 20px ${shadowColor}`,
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px) scale(1.02)',
                  boxShadow: `0 20px 30px ${shadowColor.replace('0.3', '0.45')}`,
                },
              }}
            >
              <CardContent>
                {icon}
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: '#222' }}>
                  {value}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#555', fontWeight: 600, mt: 1 }}>
                  {label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={8}
        sx={{
          mt: 8,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
          boxShadow: '0 15px 40px rgba(25, 118, 210, 0.2)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
          Recent Billing Activities
        </Typography>
        {recentBillingActivities.length > 0 ? (
          recentBillingActivities.map(({ id, text, time }) => (
            <Box
              key={id}
              sx={{
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #ccc',
                '&:last-child': { borderBottom: 'none', mb: 0 },
                cursor: 'default',
                transition: 'background-color 0.25s ease',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#e3f2fd' },
                px: 1,
              }}
            >
              <Typography variant="body1" sx={{ color: '#333', fontWeight: 600 }}>
                {text}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b778d', fontStyle: 'italic' }}>
                {time}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#9e9e9e' }}>
            No recent billing activities.
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: 8, opacity: 0.65, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
          This overview provides key financial and billing metrics for the billing desk.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskDashboardOverview.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskDashboardOverview;
