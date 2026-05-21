import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  CircularProgress
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For Paid status
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // For Outstanding status
import CancelIcon from '@mui/icons-material/Cancel'; // For Overdue
import SendIcon from '@mui/icons-material/Send'; // For Sent (used in icon only)

const statusColors = {
  Paid: 'success',
  Outstanding: 'warning',
  Overdue: 'error',
  Draft: 'info',
  Sent: 'primary',
};

const statusIcons = {
  Paid: <CheckCircleIcon fontSize="small" sx={{ color: '#2e7d32' }} />,
  Outstanding: <HourglassEmptyIcon fontSize="small" sx={{ color: '#f9a825' }} />,
  Overdue: <CancelIcon fontSize="small" sx={{ color: '#d32f2f' }} />,
  Draft: <HourglassEmptyIcon fontSize="small" sx={{ color: '#0288d1' }} />,
  Sent: <SendIcon fontSize="small" sx={{ color: '#1976d2' }} />,
};

const BillingDeskInvoicing = ({ billingDeskUser }) => {
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

  // Helper function to determine status based on balanceDue only (dueDate removed)
  const getBillStatus = (bill) => {
    if (bill.balanceDue > 0) {
      return 'Outstanding';
    }
    return 'Paid';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', background: 'linear-gradient(135deg, #e3f2fd, #ffffff)', p: 2 }}>
        <Paper elevation={7} sx={{ p: 4, borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(25, 118, 210, 0.2)' }}>
          <CircularProgress size={60} sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ mt: 3, color: '#1976d2', fontWeight: 600 }}>
            Loading invoices...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', textAlign: 'center' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffebee', color: '#d32f2f' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Error: {error}</Typography>
          <Typography variant="body1" sx={{ mb: 0 }}>Failed to load invoices. Please check the server connection.</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%', backgroundColor: '#fafafa', borderRadius: 4, boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
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
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Invoicing Management
      </Typography>

      <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'linear-gradient(145deg, #ffffff, #e8eaf6)', boxShadow: '0 12px 30px rgba(25, 118, 210, 0.15)' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            All Invoices
          </Typography>
        </Box>

        {bills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
            <ReceiptLongIcon sx={{ fontSize: 70, mb: 2 }} />
            <Typography variant="h6">No invoices found.</Typography>
            <Typography variant="body2">Invoices will appear here.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: 3, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <Table sx={{ minWidth: 850 }} aria-label="invoices table">
              <TableHead>
                <TableRow sx={{ bgcolor: '#3949ab' }}>
                  {['Bill ID', 'Patient ID', 'Total Amount', 'Amount Paid', 'Balance Due', 'Bill Date', 'Status', 'Actions'].map((headCell) => (
                    <TableCell key={headCell} sx={{ fontWeight: 'bold', color: '#e8eaf6', textTransform: 'uppercase' }}>
                      {headCell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => {
                  const status = bill.status || getBillStatus(bill);
                  return (
                    <TableRow
                      key={bill.id}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                        '&:hover': { backgroundColor: '#e8eaf6' },
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#212121' }}>
                        {bill.billId}
                      </TableCell>
                      <TableCell sx={{ color: '#424242' }}>{bill.patientId}</TableCell>
                      <TableCell sx={{ color: '#212121', fontWeight: 600 }}>₹{bill.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell sx={{ color: '#212121' }}>₹{bill.amountPaid?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell sx={{ color: bill.balanceDue > 0 ? '#d32f2f' : '#2e7d32', fontWeight: 700 }}>
                        ₹{bill.balanceDue?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>{bill.billDate ? new Date(bill.billDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          color={statusColors[status] || 'default'}
                          size="small"
                          icon={statusIcons[status] || null}
                          sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        {bill.billDocumentUrl ? (
                          <Button
                            variant="text"
                            size="small"
                            href={bill.billDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}
                          >
                            View Document
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No document
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Create, manage, and send invoices for patient services.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskInvoicing.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskInvoicing;
