import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const FrontDeskBilling = ({ frontDeskUser }) => {
  // Static data for demonstration
  const billingData = [
    {
      id: 1,
      invoiceId: 'INV-FD-001',
      patientName: 'John Doe',
      amount: 1500.00,
      dueDate: '2025-08-05',
      status: 'Paid',
    },
    {
      id: 2,
      invoiceId: 'INV-FD-002',
      patientName: 'Jane Smith',
      amount: 2300.50,
      dueDate: '2025-08-10',
      status: 'Pending',
    },
    {
      id: 3,
      invoiceId: 'INV-FD-003',
      patientName: 'Robert Johnson',
      amount: 800.00,
      dueDate: '2025-07-28',
      status: 'Overdue',
    },
    {
      id: 4,
      invoiceId: 'INV-FD-004',
      patientName: 'Alice Wonderland',
      amount: 450.00,
      dueDate: '2025-08-15',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'info';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircleIcon fontSize="small" />;
      case 'Pending': return <HourglassEmptyIcon fontSize="small" />;
      case 'Overdue': return <CancelIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleGenerateInvoice = () => {
    // TODO: Implement logic to open a form for generating new invoices
  };

  const handleRecordPayment = (invoiceId) => {
    // TODO: Implement logic to record a payment for invoice: ${invoiceId}
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
        Billing & Invoicing
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Invoices & Payments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleGenerateInvoice}
            sx={{ py: 1, px: 2, fontWeight: 'bold' }}
          >
            Generate New Invoice
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="billing table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell component="th" scope="row">
                    <ReceiptLongIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />{row.invoiceId}
                  </TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>₹{row.amount.toFixed(2)}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      icon={getStatusIcon(row.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {row.status !== 'Paid' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handleRecordPayment(row.invoiceId)}
                      >
                        Record Payment
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
          Handle patient billing, generate invoices, and track payments.
        </Typography>
      </Box>
    </Box>
  );
};

FrontDeskBilling.propTypes = {
  frontDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default FrontDeskBilling;
