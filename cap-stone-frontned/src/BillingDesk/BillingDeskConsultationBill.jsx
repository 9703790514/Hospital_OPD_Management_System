import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, // Import useTheme for responsive styling
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// PDF Libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';

// Styled Components for custom styles
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00796b', // Dark Teal
  color: '#ffffff',
  borderRadius: theme.shape.borderRadius, // Apply theme's border radius
  padding: '10px 20px',
  fontWeight: 'bold',
  textTransform: 'none', // Prevent uppercase transformation
  '&:hover': {
    backgroundColor: '#004d40', // Even darker teal on hover
    boxShadow: theme.shadows[4],
  },
  '&:disabled': {
    backgroundColor: '#b2dfdb', // Lighter teal for disabled state
    color: '#ffffff',
  },
}));

// Utility function to fetch data with error handling and simulated delay
async function fetchData(url, options = {}) {
  // Simulate network delay for better UX demonstration
  await new Promise((r) => setTimeout(r, 500)); // 500ms delay

  const res = await fetch(url, options);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Fetch error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default function BillingDesk() {
  const theme = useTheme(); // Access the theme for responsive values

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedBillId, setSelectedBillId] = useState(null);

  // Appointment List States
  const [appointments, setAppointments] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  // Billing Form States
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [billDetails, setBillDetails] = useState(null); // This state is declared but not used in the provided code.

  // Bill Document fields based on Bill.java
  const [billDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // Combo box value
  const [status, setStatus] = useState('Pending'); // Default status
  const [billType] = useState('Consultation'); // Fixed value
  const [billDocumentUrl, setBillDocumentUrl] = useState('');
  const [consultationFee, setConsultationFee] = useState('0.00');
  const [additionalCharges, setAdditionalCharges] = useState('0.00');
  const [notes, setNotes] = useState('');

  // Modals and PDF states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Auto-calculation useEffect for totalAmount, amountPaid, balanceDue
  useEffect(() => {
    const baseFee = parseFloat(consultationFee || 0) + parseFloat(additionalCharges || 0);
    const gstRate = 0.18; // 18% GST
    const gstAmount = baseFee * gstRate;
    const calculatedTotal = (baseFee + gstAmount).toFixed(2);
    const calculatedAmountPaid = parseFloat(amountPaid || 0);

    setTotalAmount(calculatedTotal);
    setAmountPaid(calculatedTotal); // Automatically set amount paid to total
    setBalanceDue((parseFloat(calculatedTotal) - calculatedAmountPaid).toFixed(2));
  }, [consultationFee, additionalCharges, amountPaid]); // Recalculate if these change


  // Load appointments from API
  useEffect(() => {
    // Only load appointments if no appointment is selected (i.e., we are on the list view)
    if (selectedAppointmentId === null) {
      async function loadAppointments() {
        try {
          setListLoading(true);
          setListError(null);
          const appts = await fetchData(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments');

          // Enrich appointment data with patient and doctor details
          const enriched = await Promise.all(
            appts.map(async (appt) => {
              let patientFullName = 'Unknown Patient';
              let doctorFullName = 'Unknown Doctor';
              let doctorConsultationFee = 'N/A';
              let doctorSpecialization = '';

              // Fetch patient details
              try {
                const patient = await fetchData(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + appt.patientId);
                patientFullName = patient.first_name + ' ' + patient.last_name;
              } catch (e) {
                // Optionally set a more specific error for the list item if needed
              }

              // Fetch doctor details
              try {
                const doctor = await fetchData(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + appt.doctorId);
                doctorFullName = ' ' + doctor.firstName + ' ' + doctor.lastName;
                doctorConsultationFee = doctor.consultationFee?.toString() ?? '250.00'; // Default fee if not found
                doctorSpecialization = doctor.specialization ?? 'General Physician';
              } catch (e) {
                // Optionally set a more specific error for the list item if needed
              }

              return {
                ...appt,
                patientFullName,
                doctorFullName,
                doctorConsultationFee,
                doctorSpecialization,
                formattedDate: new Date(appt.appointmentDate).toLocaleDateString(),
                formattedTime: new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
            })
          );
          setAppointments(enriched);
        } catch (e) {
          setListError('Failed to load appointments. Please check the server status.');
        } finally {
          setListLoading(false);
        }
      }
      loadAppointments();
    }
  }, [selectedAppointmentId]); // Re-run when selectedAppointmentId changes to null (back to list)

  // Load appointment details when an appointment is selected
  useEffect(() => {
    if (selectedAppointmentId !== null) {
      async function loadAppointmentDetails() {
        try {
          setFormLoading(true);
          setFormError(null);
          const appt = await fetchData(import.meta.env.VITE_APPOINTMENT_SERVICE_URL + '/api/appointments/' + selectedAppointmentId);

          let patientFullName = 'Unknown Patient';
          let doctorFullName = 'Unknown Doctor';
          let doctorConsultationFee = '250.00'; // Default value
          let doctorSpecialization = '';

          // Fetch patient details
          try {
            const patient = await fetchData(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + appt.patientId);
            patientFullName = patient.first_name + ' ' + patient.last_name;
          } catch (e) {
          }

          // Fetch doctor details
          try {
            const doctor = await fetchData(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + appt.doctorId);
            doctorFullName = doctor.firstName + ' ' + doctor.lastName;
            doctorConsultationFee = doctor.consultationFee?.toString() ?? '250.00';
            doctorSpecialization = doctor.specialization ?? 'General Physician';
          } catch (e) {
          }

          setAppointmentDetails({
            ...appt,
            patientFullName,
            doctorFullName,
            doctorConsultationFee,
            doctorSpecialization,
            formattedDate: new Date(appt.appointmentDate).toLocaleDateString(),
            formattedTime: new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          // Initialize form fields with fetched data
          setConsultationFee(doctorConsultationFee);
          setAdditionalCharges('0.00'); // Always start with 0 additional charges
          setNotes('');
          setPaymentMethod('Credit Card');
          setStatus('Pending'); // Bill status
          setBillDocumentUrl(''); // Reset the URL when a new appointment is selected
          setAmountPaid(doctorConsultationFee); // Set amount paid to consultation fee initially
        } catch (e) {
          setFormError('Failed to load appointment details. Please try again.');
        } finally {
          setFormLoading(false);
        }
      }
      loadAppointmentDetails();
    } else {
      setAppointmentDetails(null); // Clear details when no appointment is selected
    }
  }, [selectedAppointmentId]); // Re-run when selectedAppointmentId changes

  // Handlers
  const handleGenerateBillClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    setSelectedBillId(null); // Ensure no old bill ID is present
    setBillDocumentUrl(''); // Ensure the document URL is reset
    setFormError(null); // Clear any previous form errors
  };

  const handleBackToList = () => {
    setSelectedAppointmentId(null);
    setFormError(null);
    setSelectedBillId(null);
    setBillDocumentUrl(''); // Clear document URL when going back
  };

  const handleCreateBill = async () => {
    if (!appointmentDetails) {
      alert('No appointment selected to create a bill.');
      return;
    }

    // Check if a bill document has been uploaded
    if (!billDocumentUrl) {
      alert('Please upload a bill document first before creating the bill.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Calculate final total including GST for the bill object
    const baseFee = parseFloat(consultationFee || 0) + parseFloat(additionalCharges || 0);
    const gstRate = 0.18; // 18% GST
    const gstAmount = baseFee * gstRate;
    const finalTotalAmount = (baseFee + gstAmount).toFixed(2);

    const newBill = {
      patientId: appointmentDetails.patientId,
      appointmentId: selectedAppointmentId,
      billDate: billDate,
      totalAmount: parseFloat(finalTotalAmount), // Use the final calculated total
      amountPaid: parseFloat(amountPaid),
      balanceDue: parseFloat(balanceDue),
      paymentMethod: paymentMethod,
      status: status,
      billType: billType,
      transactionId: 'TRANS-' + Math.floor(Math.random() * 1000000), // Auto-generated simple transaction ID
      issuedByUserId: '84525', // Static for this example, replace with actual user ID
      // The 'bills' field is removed as it's causing the JSON parse error.
      // The backend seems to expect a List<String>, not a List of objects.
      billDocumentUrl: billDocumentUrl,
      notes: notes, // Include notes in the bill object
    };

    try {
      const createdBill = await fetchData(import.meta.env.VITE_BILL_SERVICE_URL + '/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });

      setSelectedBillId(createdBill.id);
      setShowSuccessModal(true);
    } catch (e) {
      setFormError('Failed to create bill: ' + e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const createPDFContent = () => {
    if (!appointmentDetails) return '';

    const baseFee = parseFloat(consultationFee || 0) + parseFloat(additionalCharges || 0);
    const gst = baseFee * 0.18;
    const calculatedTotalAmount = baseFee + gst;

    return `
      <div id="bill-template" style="font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; padding: 30px; color: #333; border: 1px solid #e0e0e0; max-width: 800px; margin: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 4px solid #00796b; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #00796b; margin: 0; font-size: 32px; font-weight: 700;">Sarvotham Spine Care Hospital</h1>
          <p style="margin: 10px 0 0; font-size: 15px; color: #555;">123 Health St, Wellness City, 560001</p>
          <p style="margin: 5px 0 0; font-size: 15px; color: #555;">Phone: (080) 1234 5678 | Email: contact@sarvothamhospital.com</p>
        </div>
        <h2 style="text-align: center; color: #444; margin-bottom: 30px; font-size: 24px; font-weight: 600; text-transform: uppercase;">Invoice / Medical Bill</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; background-color: #e0f2f1; padding: 20px; border-radius: 8px; border: 1px solid #b2dfdb;">
          <div>
            <strong>Bill Date:</strong> <span style="font-weight: normal;">${billDate || 'N/A'}</span><br/>
            <strong>Bill Type:</strong> <span style="font-weight: normal;">Consultation</span>
          </div>
          <div style="text-align: right;">
            <strong>Patient:</strong> <span style="font-weight: normal;">${appointmentDetails.patientFullName}</span><br/>
            <strong>Doctor:</strong> <span style="font-weight: normal;">${appointmentDetails.doctorFullName}</span>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 25px; border: 1px solid #cfd8dc; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #00796b; color: #ffffff;">
              <th style="padding: 15px; border: 1px solid #00796b; text-align: left; font-weight: 600;">Description</th>
              <th style="padding: 15px; border: 1px solid #00796b; text-align: right; font-weight: 600;">Amount (â‚¹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #fdfdfd;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;">Consultation Fee</td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right;">${parseFloat(consultationFee).toFixed(2)}</td>
            </tr>
            <tr style="background-color: #fdfdfd;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;">Additional Charges</td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right;">${parseFloat(additionalCharges).toFixed(2)}</td>
            </tr>
            <tr style="background-color: #fdfdfd;">
              <td style="padding: 15px; border: 1px solid #e0e0e0;">GST (18%)</td>
              <td style="padding: 15px; border: 1px solid #e0e0e0; text-align: right;">${gst.toFixed(2)}</td>
            </tr>
            <tr style="background-color: #e0f2f1; font-weight: bold;">
              <td style="padding: 15px; border: 1px solid #b2dfdb; text-align: right; font-size: 16px;">Total Amount</td>
              <td style="padding: 15px; border: 1px solid #b2dfdb; text-align: right; font-size: 16px; color: #00796b;">â‚¹${calculatedTotalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: right;">
          <p style="font-size: 16px; font-weight: bold; margin: 5px 0; color: #00796b;">Amount Paid: â‚¹${parseFloat(amountPaid).toFixed(2)}</p>
          <p style="font-size: 16px; font-weight: bold; margin: 5px 0; color: ${parseFloat(balanceDue) > 0 ? '#d32f2f' : '#065f46'};">Balance Due: â‚¹${parseFloat(balanceDue).toFixed(2)}</p>
          <p style="margin: 10px 0;">Payment Method: <span style="font-weight: normal;">${paymentMethod}</span></p>
        </div>
        <div style="margin-top: 40px; border-top: 1px dashed #cccccc; padding-top: 25px;">
          <p style="font-size: 15px;"><strong>Notes:</strong> <span style="font-weight: normal;">${notes || 'N/A'}</span></p>
        </div>
        <div style="margin-top: 50px; text-align: center; color: #888; font-style: italic; font-size: 14px;">
          Thank you for choosing Sarvotham Spine Care Hospital. We wish you a speedy recovery.
        </div>
      </div>
    `;
  };

  const handleGeneratePDFPreview = async () => {
    if (!appointmentDetails) {
      alert('No appointment details available to generate a PDF preview.');
      return;
    }

    setPdfContent('');
    setPdfBlob(null);
    setFormLoading(true); // Indicate loading while PDF is being generated

    const contentHtml = createPDFContent();
    setPdfContent(contentHtml);

    // Create a temporary div to render HTML for canvas conversion
    const billContent = document.createElement('div');
    billContent.style.width = '210mm'; // A4 width
    billContent.style.backgroundColor = '#fff';
    billContent.style.position = 'absolute'; // Position off-screen
    billContent.style.left = '-9999px';
    billContent.innerHTML = contentHtml;
    document.body.appendChild(billContent);

    try {
      const canvas = await html2canvas(billContent, { scale: 2, logging: false }); // scale for better resolution
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG for smaller file size, quality 1.0
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add image to PDF, ensuring it fits within A4 page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfOutput = pdf.output('blob');
      setPdfBlob(pdfOutput);

      setShowPreviewModal(true);
    } catch (error) {
      alert('Failed to generate PDF. Please try again. Check console for details.');
    } finally {
      document.body.removeChild(billContent); // Clean up temporary div
      setFormLoading(false); // End loading
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) {
      alert('PDF not available for download.');
      return;
    }

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bill_appointment_${selectedAppointmentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  const handleUploadBill = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Client-side validation for file type and size
    const MAX_FILE_SIZE_MB = 20; // Reduced max size for practical web uploads
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`File is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
      event.target.value = null; // Reset the input field
      return;
    }

    if (file.type !== 'application/pdf') {
      alert('Invalid file type. Only PDF files are allowed.');
      event.target.value = null; // Reset the input field
      return;
    }

    setUploading(true);
    setFormError(null); // Clear previous errors

    const formData = new FormData();
    formData.append('billDocument', file);

    try {
      const response = await fetch(import.meta.env.VITE_BILL_SERVICE_URL + '/api/bills/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload file');
      }

      const uploadResult = await response.json();

      setBillDocumentUrl(uploadResult.fileUrl);

      // Provide clear instruction to the user
      alert(`Uploaded file: ${file.name}. Please click 'Create Bill' to finalize the billing process.`);
    } catch (e) {
      setFormError(`Failed to upload file: ${e.message}`);
    } finally {
      setUploading(false);
      event.target.value = null; // Clear the file input for next upload
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    handleBackToList(); // Go back to the appointment list after successful bill creation
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPdfContent('');
    setPdfBlob(null);
  };

  // Component to render the list of appointments
  const renderAppointmentList = () => (
     <Box
  sx={{
    width: '100%',
    maxWidth: 1600,
    bgcolor: '#f9fafb',
    borderRadius: 4,
    boxShadow: '0 16px 40px rgba(30, 40, 60, 0.15)',
    p: { xs: 4, sm: 6 },
    mx: 'auto',
  }}
>
  <Typography
    variant="h5"
    component="h2"
    gutterBottom
    sx={{
      color: '#10316b',
      mb: 6,
      fontWeight: '900',
      borderBottom: '5px solid #2a81f7',
      pb: 2,
      letterSpacing: 1.6,
      fontSize: { xs: '2rem', sm: '2.5rem' },
      textTransform: 'uppercase',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      textShadow: '0 4px 8px rgba(10,40,80,0.15)',
      userSelect: 'none',
    }}
  >
    Recent Appointments
  </Typography>

  <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
    <Table stickyHeader aria-label="appointments table">
      <TableHead>
        <TableRow>
          <TableCell>Patient Name</TableCell>
          <TableCell>Doctor Name (Specialization)</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Reason</TableCell>
          <TableCell align="center">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id} hover>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '900',
                  color: '#10316b',
                  fontSize: { xs: '1.3rem', sm: '1.6rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 2px 5px rgba(16,49,107,0.25)',
                }}
              >
                {appointment.patientFullName}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="span"
                color="#1e3a8a"
                sx={{ fontSize: '1.05rem', fontWeight: 700 }}
              >
                {appointment.doctorFullName} ({appointment.doctorSpecialization})
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="span"
                color="#0f172a"
                sx={{ fontSize: '1rem', fontWeight: 600 }}
              >
                {appointment.formattedDate}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="span"
                color="#0f172a"
                sx={{ fontSize: '1rem', fontWeight: 600 }}
              >
                {appointment.formattedTime}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="span"
                color="#166534"
                sx={{ fontStyle: 'italic', fontWeight: 600 }}
              >
                {appointment.reasonForVisit || 'N/A'}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleGenerateBillClick(appointment)}
                aria-label={`Generate bill for ${appointment.patientFullName}`}
              >
                Generate Bill
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


  );

  // Component to render the billing form
  const renderBillingForm = () => {
    if (formLoading) {
      return (
        <Box sx={{ display: 'flex', width :'15200px',  justifyContent: 'center', alignItems: 'center', p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
          <CircularProgress sx={{ color: '#00796b' }} />
          <Typography variant="h6" sx={{ ml: 2, color: '#00796b' }}>Loading details...</Typography>
        </Box>
      );
    }

    if (formError) {
      return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 1600, mb: 3, borderRadius: 2 }}>
            {formError}
          </Alert>
          <StyledButton variant="outlined" onClick={handleBackToList} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Appointments
          </StyledButton>
        </Box>
      );
    }

    if (!appointmentDetails) {
      return (
        <Box sx={{ p: 4, bgcolor: 'blue', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>No appointment data found for billing.</Typography>
          <StyledButton variant="outlined" onClick={handleBackToList} sx={{ mt: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Appointments
          </StyledButton>
        </Box>
      );
    }

    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1100, mx: 'auto', bgcolor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button onClick={handleBackToList} variant="text" sx={{ color: '#00796b', textTransform: 'none', fontWeight: 'bold' }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back
          </Button>
          <Typography variant="h4" gutterBottom sx={{ flexGrow: 1, textAlign: 'center', color: '#00796b', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Generate Bill
          </Typography>
        </Box>

        <Card sx={{ mb: 3, boxShadow: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#00796b', borderBottom: '2px solid #b2dfdb', pb: 1, mb: 2 }}>
              Appointment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>Patient:</span> {appointmentDetails.patientFullName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>Doctor:</span> {appointmentDetails.doctorFullName} ({appointmentDetails.doctorSpecialization})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>Date:</span> {appointmentDetails.formattedDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>Time:</span> {appointmentDetails.formattedTime}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 'bold' }}>Reason:</span> {appointmentDetails.reasonForVisit || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 4, width : 1000, borderRadius: 3, flexGrow: 1, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#00796b', borderBottom: '2px solid #b2dfdb', pb: 1, mb: 2 }}>
              Bill Information
            </Typography>
            <Grid container spacing={3}>
              {/* Bill Date - Current Date (Read-only) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bill Date"
                  fullWidth
                  value={billDate}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              {/* Bill Type - Consultation (Read-only) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bill Type"
                  fullWidth
                  value={billType}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              {/* Payment Method - Combo Box */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="payment-method-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-label"
                    value={paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Consultation Fee */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Consultation Fee (â‚¹)"
                  fullWidth
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: "0" }}
                />
              </Grid>

              {/* Additional Charges */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Additional Charges (â‚¹)"
                  fullWidth
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: "0" }}
                />
              </Grid>

              {/* Total Amount (Read-only) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Amount (â‚¹)"
                  fullWidth
                  type="number"
                  value={totalAmount}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#e0f2f1' } }} // Light teal background for read-only
                />
              </Grid>

              {/* Amount Paid */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount Paid (â‚¹)"
                  fullWidth
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: "0" }}
                />
              </Grid>

              {/* Balance Due (Read-only) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Balance Due (â‚¹)"
                  fullWidth
                  type="number"
                  value={balanceDue}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: parseFloat(balanceDue) > 0 ? '#ffebee' : '#e8f5e9', // Light red for due, light green for paid
                    },
                    '& .MuiInputBase-input': {
                      color: parseFloat(balanceDue) > 0 ? '#d32f2f' : '#388e3c', // Darker red/green text
                      fontWeight: 'bold',
                    }
                  }}
                />
              </Grid>
              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Add any relevant notes for the bill..."
                />
              </Grid>
            </Grid>

            {/* Generate PDF button and Upload section */}
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
              <StyledButton
                variant="contained"
                onClick={handleGeneratePDFPreview}
                disabled={!appointmentDetails || formLoading}
              >
                {formLoading ? 'Generating PDF...' : 'Generate PDF'}
              </StyledButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Upload Bill Document (PDF)
              </Typography>
              <TextField
                label="Choose File"
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <StyledButton
                      variant="contained"
                      component="label"
                      sx={{ minWidth: 'auto', px: 2, py: 1 }} // Smaller button for browse
                      disabled={uploading}
                    >
                      {uploading ? <CircularProgress size={20} color="inherit" /> : 'Browse'}
                      <input
                        type="file"
                        hidden
                        id="bill-document-upload"
                        onChange={handleUploadBill}
                        accept="application/pdf"
                      />
                    </StyledButton>
                  ),
                }}
                value={billDocumentUrl ? billDocumentUrl.split('/').pop() : ''}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {uploading ? 'Uploading...' : (billDocumentUrl ? `Uploaded: ${billDocumentUrl.split('/').pop()}` : 'Please upload the generated PDF document (Max 5MB)')}
              </Typography>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <StyledButton
                variant="contained"
                onClick={handleCreateBill}
                disabled={formLoading || !!selectedBillId || !billDocumentUrl || uploading} // Disable if no document uploaded or still uploading
              >
                {formLoading ? 'Creating Bill...' : 'Create Bill'}
              </StyledButton>
            </Box>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Modal
          open={showSuccessModal}
          onClose={handleCloseModal}
          aria-labelledby="success-modal-label"
          aria-describedby="success-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 }, // Responsive width
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 3,
              p: 4,
              outline: 'none',
              textAlign: 'center',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography id="success-modal-label" variant="h6" component="h2" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              âœ… Success!
            </Typography>
            <Typography id="success-modal-description" sx={{ mb: 3, color: 'text.secondary' }}>
              Bill for appointment created successfully with ID: <strong style={{ color: '#00796b' }}>{selectedBillId}</strong>.
            </Typography>
            <Box>
              <StyledButton variant="contained" onClick={handleCloseModal}>
                OK
              </StyledButton>
            </Box>
          </Box>
        </Modal>

        {/* PDF Preview Modal */}
        <Modal
          open={showPreviewModal}
          onClose={handleClosePreviewModal}
          aria-labelledby="pdf-preview-modal-title"
          aria-describedby="pdf-preview-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' }, // More responsive width
              height: '90vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: { xs: 2, sm: 4 },
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="pdf-preview-modal-title" variant="h6" sx={{ fontWeight: 'bold', color: '#00796b' }}>
                PDF Preview ðŸ“„
              </Typography>
              <IconButton onClick={handleClosePreviewModal} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box id="pdf-preview-content" sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pdfContent) }} />
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <StyledButton variant="contained" onClick={handleDownloadPDF} disabled={!pdfBlob}>
                Download PDF
              </StyledButton>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  };

  return selectedAppointmentId === null ? renderAppointmentList() : renderBillingForm();
}



