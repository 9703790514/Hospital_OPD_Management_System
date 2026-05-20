import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './BillingDeskGenerateBill.css';

// Helper function to format numbers as Indian Rupees
const formatToINR = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 'â‚¹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(number);
};

// Helper function to generate a unique transaction ID
const generateTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRANS-${result}`;
};

const BillingDeskGenerateBill = ({ appointment }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [billItemsData, setBillItemsData] = useState([]);
  const [billItemsLoading, setBillItemsLoading] = useState(true);
  const [billItemsError, setBillItemsError] = useState(null);
  
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  // New state variables for the form
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [billDocumentFile, setBillDocumentFile] = useState(null);

  const pdfContentRef = useRef(null); 

  const consultationFee = doctorDetails?.consultationFee || 0;
  const serviceCharges = selectedItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  const subTotal = serviceCharges;
  const gstRate = 0.18; 
  const gstAmount = subTotal * gstRate;
  const totalAmount = subTotal + gstAmount;
  const balanceDue = totalAmount - amountPaid;

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toISOString();

  useEffect(() => {
    // Generate a new transaction ID when the component mounts
    setTransactionId(generateTransactionId());
  }, []);

  useEffect(() => {
    if (appointment) {
    }
  }, [appointment]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientResponse, doctorResponse, billItemsResponse] = await Promise.all([
          fetch(`http://localhost:2008/api/patients/${appointment.patientId}`),
          fetch(`http://localhost:2005/api/doctors/${appointment.doctorId}`),
          fetch(`${import.meta.env.VITE_BILL_SERVICE_URL}/api/bill-items')
        ]);

        if (!patientResponse.ok) throw new Error(`Patient data fetch failed with status: ${patientResponse.status}`);
        if (!doctorResponse.ok) throw new Error(`Doctor data fetch failed with status: ${doctorResponse.status}`);
        if (!billItemsResponse.ok) throw new Error(`Bill items data fetch failed with status: ${billItemsResponse.status}`);

        const patientData = await patientResponse.json();
        const doctorData = await doctorResponse.json();
        const billItemsData = await billItemsResponse.json();

        setPatientDetails(patientData);
        setDoctorDetails(doctorData);
        setBillItemsData(billItemsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setBillItemsLoading(false);
      }
    };

    if (appointment?.patientId && appointment?.doctorId) {
      fetchData();
    } else {
      setError("Patient or Doctor ID is missing.");
      setLoading(false);
      setBillItemsLoading(false);
    }
  }, [appointment]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filteredSuggestions = billItemsData.filter(item =>
        item.description.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [billItemsData]);

  const handleSelectSuggestion = useCallback((item) => {
    setSelectedItems(prevItems => {
      if (prevItems.find(selected => selected.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setSearchTerm('');
    setSuggestions([]);
  }, []);

  const handleQuantityChange = useCallback((id, newQuantity) => {
    setSelectedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setSelectedItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const calculateTotal = useCallback(() => {
    return selectedItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }, [selectedItems]);

  const handleGeneratePdf = async () => {
    if (!pdfContentRef.current) return;

    pdfContentRef.current.style.display = 'block';

    const originalWidth = pdfContentRef.current.style.width;
    const originalHeight = pdfContentRef.current.style.height;
    pdfContentRef.current.style.width = '210mm';
    pdfContentRef.current.style.height = 'auto';

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2, 
        useCORS: true 
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(url); 
      // Set the bill document file name as a placeholder
      setBillDocumentFile({ name: `bill_${appointment?.id}.pdf` });
      setShowPdfModal(true);
      
    } catch (error) {
      setPdfPreviewUrl(null);
    } finally {
      pdfContentRef.current.style.display = 'none';
      pdfContentRef.current.style.width = originalWidth;
      pdfContentRef.current.style.height = originalHeight;
    }
  };

  const handleDownloadPdf = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = `bill_${patientDetails?.first_name}_${appointment?.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfPreviewUrl(null);
  };
  
  const handleFileChange = (e) => {
    setBillDocumentFile(e.target.files[0]);
  };
  
  const handleUploadBill = async () => {
    // Step 1: Validate required fields
    if (!appointment || !appointment.id || !patientDetails || !doctorDetails) {
      alert("Error: Appointment, patient, or doctor details are missing.");
      return;
    }
    if (!billDocumentFile) {
        alert("Please select a bill document file to upload.");
        return;
    }
    
    try {
      // Step 2: Upload the bill document first
      const formData = new FormData();
      formData.append("billDocument", billDocumentFile);
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_BILL_SERVICE_URL}/api/bills/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`File upload failed with status ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      const fileUrl = uploadResult.fileUrl;
      
      // Step 3: Construct the bill object for the main database entry
      const billToCreate = {
        patientId: appointment.patientId.toString(),
        appointmentId: appointment.id.toString(),
        billDate: today,
        totalAmount: totalAmount,
        amountPaid: parseFloat(amountPaid),
        balanceDue: parseFloat(balanceDue),
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        issuedByUserId: "4", 
        billDocumentUrl: fileUrl,
        // CORRECTED: Use 'bill_items' to match the Java entity's @Field annotation
        bill_items: selectedItems.map(item => item.id),
        createdAt: currentTime,
        updatedAt: currentTime
      };

      // Step 4: Post the bill data to the /api/bills endpoint
      const billResponse = await fetch(`${import.meta.env.VITE_BILL_SERVICE_URL}/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billToCreate),
      });

      if (!billResponse.ok) {
        throw new Error(`Bill creation failed with status ${billResponse.status}`);
      }

      const createdBill = await billResponse.json();
      alert(`Bill created successfully! Bill ID: ${createdBill.id}`);
      
      // Reset form states
      setAmountPaid(0);
      setPaymentMethod('');
      setBillDocumentFile(null);
      setTransactionId(generateTransactionId());
      setSelectedItems([]);
      
    } catch (err) {
      alert("Error uploading bill: " + err.message);
    }
  };

  if (loading || billItemsLoading) return <p>Loading details...</p>;
  if (error || billItemsError) return <p>Error: {error || billItemsError}</p>;

  return (
    <div className="billing-container">
      {showPdfModal && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal-content">
            <div className="pdf-modal-header">
              <h3>PDF Preview</h3>
              <button className="pdf-modal-close" onClick={closePdfModal}>&times;</button>
            </div>
            <div className="pdf-modal-body">
              {pdfPreviewUrl ? (
                <iframe src={pdfPreviewUrl} title="PDF Preview" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
              ) : (
                <p>Preview not available.</p>
              )}
            </div>
            <div className="pdf-modal-footer">
              <button className="download-pdf-btn" onClick={handleDownloadPdf}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Bill Generation</h2>
      
      <div className="details-card">
        <h3>Patient Details</h3>
        {patientDetails ? (
          <div>
            <p><strong>Name:</strong> {patientDetails.first_name} {patientDetails.last_name}</p>
            <p><strong>Date of Birth:</strong> {new Date(patientDetails.date_of_birth).toLocaleDateString()}</p>
            <p><strong>Contact:</strong> {patientDetails.contact_number}</p>
          </div>
        ) : <p>Patient details not found.</p>}
      </div>

      <div className="details-card">
        <h3>Doctor Details</h3>
        {doctorDetails ? (
          <div>
            <p><strong>Name:</strong> {doctorDetails.firstName} {doctorDetails.lastName}</p>
            <p><strong>Specialization:</strong> {doctorDetails.specialization}</p>
          </div>
        ) : <p>Doctor details not found.</p>}
      </div>

      <hr className="divider" />
      
      <div className="search-form">
        <label htmlFor="bill-item-search">Search Bill Item:</label>
        <input
          id="bill-item-search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="e.g., Cardiology, X-Ray"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map(item => (
              <li key={item.id} onClick={() => handleSelectSuggestion(item)}>
                {item.description} ({formatToINR(item.unitPrice)})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bill-items-list">
        <h2>Selected Bill Items</h2>
        {selectedItems.length === 0 ? (
          <p>Start by searching and adding items.</p>
        ) : (
          <table className="bill-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td>{formatToINR(item.unitPrice)}</td>
                  <td>{formatToINR(item.quantity * item.unitPrice)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"></td>
                <td><strong>Total: {formatToINR(calculateTotal())}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="generate-pdf-btn" onClick={handleGeneratePdf}>
          Preview BILL
        </button>
      </div>

      {/* New Bill Details Form */}
      <div className="bill-details-form" style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>New Bill Details Form</h2>
        <form style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="amount_paid">amount_paid</label>
            <input
              type="number"
              id="amount_paid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="balance_due">balance_due</label>
            <input type="number" id="balance_due" value={balanceDue.toFixed(2)} readOnly style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f0f0f0' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="payment_method">payment_method</label>
            <select
              id="payment_method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">Select Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Online Transfer">Online Transfer</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="bill_document_url">bill_document_url</label>
            <input
              type="file"
              id="bill_document_url"
              onChange={handleFileChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="bill_document_filename">Selected File</label>
            <input
              type="text"
              id="bill_document_filename"
              value={billDocumentFile ? billDocumentFile.name : ''}
              readOnly
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f0f0f0' }}
            />
          </div>
        </form>
        <button onClick={handleUploadBill} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Upload Bill
        </button>
      </div>

      {/* The hidden content to be converted to PDF */}
      <div ref={pdfContentRef} style={{ width: '210mm', minHeight: '297mm', padding: '10mm', fontSize: '10pt', fontFamily: 'Arial, sans-serif', display: 'none', color: '#333' }}>
        <div style={{ padding: '10mm', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
          <div className="pdf-header" style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #0056b3' }}>
            <h1 style={{ fontSize: '18pt', margin: 0, color: '#0056b3' }}>Sarvotham Spine Care Hospital</h1>
            <p style={{ margin: '5px 0', color: '#555' }}>123 Health St, Wellness City, 560001</p>
            <p style={{ margin: '5px 0', color: '#555' }}>Phone: (080) 1234 5678 | Email: contact@sarvothamhospital.com</p>
          </div>

          <div className="pdf-bill-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>INVOICE/ MEDICAL BILL</p>
            <p style={{ margin: 0 }}><strong>Bill Date:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="pdf-patient-info" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>Patient:</strong> {patientDetails?.first_name} {patientDetails?.last_name}</p>
            <p style={{ margin: 0 }}><strong>Doctor:</strong> {doctorDetails?.firstName} {doctorDetails?.lastName}</p>
          </div>

          <table className="pdf-charges-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9f5ff' }}>
                <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'left', color: '#0056b3' }}>Description</th>
                <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'right', color: '#0056b3' }}>Amount ({formatToINR(0).slice(0, 1)})</th>
              </tr>
            </thead>
            <tbody>
              {/* Removed Consultation Fee row */}
              {selectedItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', border: '1px solid #ccc' }}>{item.description} ({item.quantity} x {item.unitPrice})</td>
                  <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'right' }}>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>GST (18%)</td>
                <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'right', backgroundColor: '#f9f9f9' }}>{gstAmount.toFixed(2)}</td>
              </tr>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#d9eaff', color: '#0056b3' }}>
                <td style={{ padding: '12px', border: '1px solid #ccc' }}>Total Amount</td>
                <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'right' }}>{formatToINR(totalAmount).slice(1)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="pdf-payment-summary" style={{ textAlign: 'right', marginBottom: '20px', paddingRight: '12px' }}>
            <p style={{ margin: '5px 0' }}><strong>Amount Paid:</strong> {formatToINR(totalAmount)}</p>
            <p style={{ margin: '5px 0' }}><strong>Balance Due:</strong> {formatToINR(0)}</p>
          </div>

          <div className="pdf-footer" style={{ marginTop: '30px', textAlign: 'center', paddingTop: '15px', borderTop: '1px solid #ccc' }}>
            <p style={{ margin: 0, color: '#777' }}>Thank you for choosing Sarvotham Spine Care Hospital. We wish you a speedy recovery.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDeskGenerateBill;
