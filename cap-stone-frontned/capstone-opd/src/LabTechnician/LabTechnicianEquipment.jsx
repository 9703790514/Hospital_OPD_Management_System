import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  TablePagination,
} from '@mui/material';

const BillingDeskPatientAccounts = ({ billingDeskUser }) => {
  // State to hold dynamic bill items data
  const [billItemsData, setBillItemsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBillItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BILL_SERVICE_URL}/api/bill-items');
        if (!response.ok) {
          throw new Error(`Failed to fetch bill items: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setBillItemsData(data);
        setFilteredData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillItems();
  }, []);

  // Update filteredData when searchQuery or billItemsData changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(billItemsData);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = billItemsData.filter((item) =>
        item.description?.toLowerCase().includes(lowerQuery)
      );
      setFilteredData(filtered);
    }
    setPage(0); // Reset to first page on new search
  }, [searchQuery, billItemsData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the paginated rows to display
  const paginatedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 6 }}>
        <CircularProgress color="secondary" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading bill items...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#fdecea', color: '#b71c1c' }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Failed to load bill items data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: 1500, mx: 'auto', width: '100%', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          mb: 5,
          fontWeight: 900,
          color: '#303f9f', // Indigo
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textShadow: '0 2px 6px rgba(48,63,159,0.2)',
        }}
      >
        Lab Tests Information
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
        <TextField
          label="Search by Treatment Name"
          variant="outlined"
          fullWidth
          size="medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type to filter bill items by description..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#f3f4fb',
              transition: 'box-shadow 0.3s ease',
              '&:hover fieldset': {
                borderColor: '#3f51b5',
                boxShadow: '0 0 8px rgba(63,81,181,0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#303f9f',
                boxShadow: '0 0 12px rgba(48,63,159,0.5)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#3f51b5',
              fontWeight: 600,
            },
          }}
        />
      </Box>

      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 5,
          background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
          boxShadow: '0 20px 50px rgba(63,81,181,0.15)',
          border: '1px solid #9fa8da',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: '#283593',
            letterSpacing: '0.07em',
            textShadow: '0 1px 3px rgba(40,53,147,0.2)',
          }}
        >
          Overview of Bill Items
        </Typography>

        {filteredData.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 6, fontStyle: 'italic' }}>
            No bill items found.
          </Typography>
        ) : (
          <>
            <TableContainer
              sx={{
                maxHeight: 600,
                borderRadius: 4,
                '&::-webkit-scrollbar': {
                  width: 8,
                  height: 8,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(48,63,159,0.3)',
                  borderRadius: 4,
                },
              }}
            >
              <Table stickyHeader aria-label="bill items table" sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#3949ab' }}>
                    <TableCell sx={{ fontWeight: 900, color: 'black' }}>Treatment Name</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'black', width: 100, textAlign: 'center' }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'black', width: 140, textAlign: 'right' }}>
                      Unit Price (₹)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'black' }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: '#e8eaf6',
                        },
                        '&:last-child td, &:last-child th': {
                          border: 0,
                        },
                        td: { verticalAlign: 'top', fontSize: '0.95rem', color: '#283593' },
                      }}
                    >
                      <TableCell>{item.description || 'N/A'}</TableCell>
                      <TableCell align="center">{item.quantity ?? '-'}</TableCell>
                      <TableCell align="right">₹{item.unitPrice?.toFixed(2) ?? '-'}</TableCell>
                      <TableCell sx={{ fontStyle: 'italic', color: '#5c6bc0' }}>{item.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Component */}
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Rows per page"
              sx={{ mt: 2 }}
            />
          </>
        )}
      </Paper>

      <Box sx={{ mt: 6, opacity: 0.7, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          View detailed bill items including service descriptions, pricing, and related notes.
        </Typography>
      </Box>
    </Box>
  );
};

BillingDeskPatientAccounts.propTypes = {
  billingDeskUser: PropTypes.shape({
    userId: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};

export default BillingDeskPatientAccounts;
