import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt'; // For receipt/invoice icon
import RefundIcon from '@mui/icons-material/Refresh'; // For refund icon

const BillingDeskPayments = ({ billingDeskUser }) => {
  // Static data for demonstration
  const paymentsData = [
    {
      id: 1,
      paymentId: 'PAY-001',
      patientName: 'John Doe',
      amount: 1500.00,
      date: '2025-07-28',
      method: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 2,
      paymentId: 'PAY-002',
      patientName: 'Jane Smith',
      amount: 2300.50,
      date: '2025-07-27',
      method: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 3,
      paymentId: 'PAY-003',
      patientName: 'Robert Johnson',
      amount: 800.00,
      date: '2025-07-25',
      method: 'Cash',
      status: 'Completed',
    },
    {
      id: 4,
      paymentId: 'PAY-004',
      patientName: 'Alice Wonderland',
      amount: 450.00,
      date: '2025-07-28',
      method: 'Credit Card',
      status: 'Pending', // Example of a pending payment
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Refunded': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon fontSize="small" />;
      case 'Pending': return <PaymentIcon fontSize="small" />;
      case 'Refunded': return <RefundIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleRecordPayment = () => {
    // Implement logic to open a form for recording a new payment
  };

  const handleViewReceipt = (paymentId) => {
    // Implement logic to view or download payment receipt
  };

  const handleProcessRefund = (paymentId) => {
    // Implement logic to process a refund
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Payment Processing
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            All Payments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleRecordPayment}
            sx={{ py: 1, px: 2, fontWeight: 'bold' }}
          >
            Record New Payment
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="payments table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Payment ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentsData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell component="th" scope="row">
                    {row.paymentId}
                  </TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>â‚¹{row.amount.toFixed(2)}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      icon={getStatusIcon(row.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {row.status === 'Completed' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ReceiptIcon />}
                        onClick={() => handleViewReceipt(row.id)}
                        sx={{ mr: 1 }}
                      >
                        Receipt
                      </Button>
                    )}
                    {row.status === 'Completed' && ( // Only allow refund for completed payments
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<RefundIcon />}
                        onClick={() => handleProcessRefund(row.id)}
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Process patient payments, record transactions, and handle refunds.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskPayments.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskPayments;
