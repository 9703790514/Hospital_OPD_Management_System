// import React from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableHead, TableRow, Divider,
// } from '@mui/material';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // For hospital logo
// import DescriptionIcon from '@mui/icons-material/Description'; // For invoice header

// const BillInvoiceDisplay = ({ bill }) => {
//   if (!bill) {
//     return (
//       <Box sx={{ p: 4, textAlign: 'center' }}>
//         <Typography variant="h6" color="text.secondary">No bill data to display.</Typography>
//       </Box>
//     );
//   }

//   // Calculate Sub Total, Tax, and Total (assuming tax is 9% for example)
//   const subTotal = bill.billItems.reduce((sum, item) => {
//     const itemQuantity = parseFloat(item.quantity);
//     const itemUnitPrice = parseFloat(item.unitPrice);
//     return sum + (isNaN(itemQuantity) || isNaN(itemUnitPrice) ? 0 : itemQuantity * itemUnitPrice);
//   }, 0);

//   const taxRate = 0.09; // Example tax rate (9%)
//   const taxAmount = subTotal * taxRate;
//   const grandTotal = subTotal + taxAmount;

//   return (
//     <Box sx={{
//       width: '100%',
//       maxWidth: 800, // Fixed width for invoice appearance
//       mx: 'auto',
//       my: 4,
//       fontFamily: 'Roboto, sans-serif', // Consistent font
//       boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Subtle shadow for the whole invoice
//       border: '1px solid #ddd', // Light border
//       bgcolor: 'background.paper'
//     }}>
//       <Paper elevation={0} sx={{ p: 4, borderRadius: 0 }}>
//         {/* Header Section */}
//         <Box sx={{ textAlign: 'center', mb: 4 }}>
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 'bold',
//               color: '#3f51b5', // A strong blue for medical feel
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1,
//               mb: 1
//             }}
//           >
//             <DescriptionIcon sx={{ fontSize: 'inherit' }} /> MEDICAL BILLING INVOICE
//           </Typography>
//           <Typography variant="subtitle2" color="text.secondary">
//             Your trusted healthcare partner
//           </Typography>
//         </Box>

//         <Divider sx={{ mb: 4 }} />

//         {/* Patient and Physician Information */}
//         <Grid container spacing={4} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ color: '#555', mb: 1, fontWeight: 'bold' }}>PATIENT INFORMATION</Typography>
//             <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//               {bill.patientName || `Patient ID: ${bill.patientId}`}
//               {/* Assuming you might fetch/pass patient name later. For now, using Patient ID or a placeholder. */}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">(555) 595-5999</Typography> {/* Placeholder */}
//             <Typography variant="body2" color="text.secondary">11 Rosewood Drive, Collingwood, NY 33580</Typography> {/* Placeholder */}
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ color: '#555', mb: 1, fontWeight: 'bold' }}>PRESCRIBING PHYSICIAN'S INFORMATION</Typography>
//             <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//               Dr. Alannah Gomez {/* Placeholder */}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">(555) 505-5000</Typography> {/* Placeholder */}
//             <Typography variant="body2" color="text.secondary">102 Trope Street, New York, NY 45568</Typography> {/* Placeholder */}
//           </Grid>
//         </Grid>

//         {/* Invoice Key Details */}
//         <Paper elevation={3} sx={{
//           p: 2,
//           mb: 4,
//           bgcolor: '#e3f2fd', // Light blue background
//           borderLeft: '5px solid #2196f3', // Blue accent border
//           display: 'flex',
//           justifyContent: 'space-around',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: 2
//         }}>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="caption" color="text.secondary">INVOICE NUMBER</Typography>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
//               {bill.id || 'N/A'} {/* Use bill.id as Invoice Number */}
//             </Typography>
//           </Box>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="caption" color="text.secondary">DATE</Typography>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               {bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'N/A'}
//             </Typography>
//           </Box>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="caption" color="text.secondary">INVOICE DUE DATE</Typography>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}> {/* Red for due date */}
//               {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
//             </Typography>
//           </Box>
//           <Box sx={{ textAlign: 'center' }}>
//             <Typography variant="caption" color="text.secondary">AMOUNT DUE</Typography>
//             <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}> {/* Green for amount due */}
//               ₹{parseFloat(bill.balanceDue).toFixed(2)}
//             </Typography>
//           </Box>
//         </Paper>

//         {/* Items Table */}
//         <Table sx={{ mb: 4, border: '1px solid #eee' }}>
//           <TableHead sx={{ bgcolor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>ITEM</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>DESCRIPTION</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 'bold', width: '25%' }}>AMOUNT</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {bill.billItems && bill.billItems.length > 0 ? (
//               bill.billItems.map((item, index) => (
//                 <TableRow key={index}> {/* Using index as key is fine for display, as items won't be reordered */}
//                   <TableCell>{item.description}</TableCell>
//                   <TableCell>
//                     {item.notes || `Quantity: ${item.quantity}, Unit Price: ₹${parseFloat(item.unitPrice).toFixed(2)}`}
//                   </TableCell>
//                   <TableCell align="right">₹{(parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2)}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>No items added to this bill.</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         {/* Notes and Summary */}
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ color: '#555', mb: 1, fontWeight: 'bold' }}>NOTES</Typography>
//             <Typography variant="body2" color="text.secondary">
//               A prescription has been written out for patient, for an acute throat infection.
//               {/* You might want to pass a general bill note here if you add it to billData */}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body1">SUB TOTAL</Typography>
//                 <Typography variant="body1">₹{subTotal.toFixed(2)}</Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body1">TAX RATE</Typography>
//                 <Typography variant="body1">{(taxRate * 100).toFixed(0)}%</Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body1">TAX</Typography>
//                 <Typography variant="body1">₹{taxAmount.toFixed(2)}</Typography>
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>TOTAL</Typography>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>₹{grandTotal.toFixed(2)}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Footer Section */}
//       <Box sx={{
//         bgcolor: '#3f51b5', // Blue background for footer
//         color: 'white',
//         p: 3,
//         mt: 4, // Spacing from content
//         display: 'flex',
//         flexDirection: { xs: 'column', sm: 'row' },
//         justifyContent: 'space-between',
//         alignItems: { xs: 'flex-start', sm: 'center' },
//         gap: { xs: 2, sm: 0 },
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <LocalHospitalIcon sx={{ fontSize: 40 }} />
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Concordia Hill Hospital</Typography>
//             <Typography variant="body2">www.concordiahill.com</Typography>
//           </Box>
//         </Box>
//         <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
//           <Typography variant="body2">For more information or any issues or concerns,</Typography>
//           <Typography variant="body2">email us at <a href="mailto:invoices@concordiahill.com" style={{ color: 'white', textDecoration: 'underline' }}>invoices@concordiahill.com</a></Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// BillInvoiceDisplay.propTypes = {
//   bill: PropTypes.shape({
//     id: PropTypes.string, // For invoice number
//     patientId: PropTypes.string.isRequired,
//     patientName: PropTypes.string, // Optional, if you add this field later
//     billDate: PropTypes.string.isRequired,
//     dueDate: PropTypes.string.isRequired,
//     totalAmount: PropTypes.number.isRequired,
//     amountPaid: PropTypes.number,
//     balanceDue: PropTypes.number,
//     billItems: PropTypes.arrayOf(PropTypes.shape({
//       description: PropTypes.string.isRequired,
//       quantity: PropTypes.number.isRequired,
//       unitPrice: PropTypes.number.isRequired,
//       notes: PropTypes.string,
//       serviceDate: PropTypes.string,
//     })).isRequired,
//     // Add other bill fields as needed
//   }),
// };

// export default BillInvoiceDisplay;


import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Divider, Button, Grid, Chip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LinkIcon from '@mui/icons-material/Link';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillInvoiceDisplay = ({ billData }) => {

  // Safety check to handle undefined data
  if (!billData || !billData.bill_items) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No bill data available or data is still loading.
        </Typography>
      </Box>
    );
  }

  const generateBillPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Invoice for Bill ID: ${billData._id}`, 14, 22);

    doc.setFontSize(12);
    doc.text(`Patient ID: ${billData.patient_id}`, 14, 32);
    doc.text(`Bill Date: ${new Date(billData.bill_date).toLocaleDateString()}`, 14, 39);
    doc.text(`Due Date: ${new Date(billData.due_date).toLocaleDateString()}`, 14, 46);

    const tableColumn = ["Description", "Quantity", "Unit Price (₹)", "Total (₹)"];
    
    // Safety check for bill_items array
    const tableRows = Array.isArray(billData.bill_items) ? billData.bill_items.map(item => [
      item.description,
      item.quantity,
      item.unitPrice,
      (item.quantity * item.unitPrice).toFixed(2)
    ]) : [];

    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [20, 100, 150] },
    });

    const finalY = doc.autoTable.previous.finalY + 10;
    doc.text(`Total Amount: ₹${parseFloat(billData.total_amount).toFixed(2)}`, 14, finalY);
    doc.text(`Amount Paid: ₹${parseFloat(billData.amount_paid).toFixed(2)}`, 14, finalY + 7);
    doc.text(`Balance Due: ₹${parseFloat(billData.balance_due).toFixed(2)}`, 14, finalY + 14);

    doc.save(`Invoice_${billData._id}.pdf`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Bill Invoice
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Bill Details</Typography>
            <Typography><strong>Bill ID:</strong> {billData._id}</Typography>
            <Typography><strong>Patient ID:</strong> {billData.patient_id}</Typography>
            <Typography><strong>Appointment ID:</strong> {billData.appointment_id || 'N/A'}</Typography>
            <Typography><strong>Issued By:</strong> {billData.issued_by_user_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Dates & Status</Typography>
            <Typography><strong>Bill Date:</strong> {new Date(billData.bill_date).toLocaleDateString()}</Typography>
            <Typography><strong>Due Date:</strong> {new Date(billData.due_date).toLocaleDateString()}</Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={billData.balance_due > 0 ? "Pending" : "Paid"}
                color={billData.balance_due > 0 ? "warning" : "success"}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" gutterBottom>Bill Items</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price (₹)</TableCell>
                <TableCell align="right">Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(billData.bill_items) && billData.bill_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ₹{parseFloat(billData.total_amount).toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Payment Summary</Typography>
            <Typography><strong>Payment Method:</strong> {billData.payment_method || 'N/A'}</Typography>
            <Typography><strong>Transaction ID:</strong> {billData.transaction_id || 'N/A'}</Typography>
            <Typography><strong>Amount Paid:</strong> ₹{parseFloat(billData.amount_paid).toFixed(2)}</Typography>
            <Typography sx={{ color: billData.balance_due > 0 ? 'error.main' : 'success.main' }}>
              <strong>Balance Due:</strong> ₹{parseFloat(billData.balance_due).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container direction="column" justifyContent="flex-end" alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={generateBillPdf}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Box>
            {billData.bill_document_url && (
              <Button
                variant="text"
                startIcon={<LinkIcon />}
                href={billData.bill_document_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                View Bill Document
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BillInvoiceDisplay;