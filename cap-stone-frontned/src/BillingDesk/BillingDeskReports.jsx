import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BillingDeskReports = ({ billingDeskUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billsData, setBillsData] = useState([]);

  // Aggregated data for charts
  const [paymentMethodData, setPaymentMethodData] = useState(null);
  const [dateCollectionData, setDateCollectionData] = useState(null);

  // Fetch billing data from API
  useEffect(() => {
    async function fetchBills() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_BILL_SERVICE_URL}/api/bills');
        if (!response.ok) throw new Error('Failed to fetch bills data');
        const data = await response.json();

        setBillsData(data);

        // Aggregate revenue by payment method
        const paymentTotals = {};
        const dateTotals = {};

        data.forEach((bill) => {
          const pm = bill.paymentMethod || 'Unknown';
          const date = new Date(bill.billDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });

          paymentTotals[pm] = (paymentTotals[pm] || 0) + (bill.totalAmount || 0);
          dateTotals[date] = (dateTotals[date] || 0) + (bill.totalAmount || 0);
        });

        setPaymentMethodData({
          labels: Object.keys(paymentTotals),
          datasets: [
            {
              data: Object.values(paymentTotals),
              backgroundColor: ['#ff7043', '#ffab91', '#ffe0b2', '#ffccbc', '#ffa726', '#f57c00'],
              hoverBackgroundColor: ['#e64a19', '#ff8a65', '#ffd54f', '#ffab40', '#fb8c00', '#ef6c00'],
            },
          ],
        });

        setDateCollectionData({
          labels: Object.keys(dateTotals),
          datasets: [
            {
              label: 'Total Collections',
              data: Object.values(dateTotals),
              backgroundColor: '#ff7043',
              borderRadius: 6,
            },
          ],
        });
      } catch (err) {
        setError(err.message || 'Error loading billing reports');
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, []);

  // Static report info for display
  const reportsList = [
    {
      id: 1,
      name: 'Daily Revenue Report',
      description: 'Summary of total revenue collected, broken down by payment method for the current day.',
      icon: <AttachMoneyIcon color="primary" />,
    },
    {
      id: 2,
      name: 'Outstanding Invoices Report',
      description: 'Detailed list of all pending and overdue invoices with patient details and amounts.',
      icon: <ReceiptLongIcon color="secondary" />,
    },
    {
      id: 3,
      name: 'Patient Account Balances',
      description: 'Overview of all patient account balances, highlighting those with outstanding amounts.',
      icon: <AccountBalanceWalletIcon color="info" />,
    },
    {
      id: 4,
      name: 'Monthly Collections Report',
      description: 'Analysis of total collections over the past month, including trends and payment sources.',
      icon: <TrendingUpIcon color="success" />,
    },
    {
      id: 5,
      name: 'Service-wise Revenue Report',
      description: 'Revenue breakdown by medical service provided, identifying top-performing services.',
      icon: <BarChartIcon color="warning" />,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}
      >
        Financial Reports
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          mb: 6,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Available Reports
        </Typography>
        <List>
          {reportsList.map((report) => (
            <ListItem
              key={report.id}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#cfe8fc', cursor: 'pointer' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{report.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {report.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Loading and error states */}
      {loading && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading billing data...</Typography>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {/* Pie chart - Revenue by Payment Method */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center', color: '#ff7043' }}
            >
              Revenue by Payment Method
            </Typography>
            {paymentMethodData ? (
              <Pie
                data={paymentMethodData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { enabled: true },
                  },
                }}
              />
            ) : (
              <Typography textAlign="center">No data available</Typography>
            )}
          </Box>

          {/* Bar chart - Collections by Date */}
          <Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center', color: '#e64a19' }}
            >
              Collections over Recent Days
            </Typography>
            {dateCollectionData ? (
              <Bar
                data={dateCollectionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Amount (₹)' } },
                    x: { title: { display: true, text: 'Date' } },
                  },
                }}
              />
            ) : (
              <Typography textAlign="center">No data available</Typography>
            )}
          </Box>
        </>
      )}

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Generate and analyze reports on revenue, collections, and outstanding balances to support financial operations.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskReports.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskReports;
