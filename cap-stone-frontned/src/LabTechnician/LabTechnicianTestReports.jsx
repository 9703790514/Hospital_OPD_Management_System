import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Link,
    IconButton,
    Chip,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import NotesIcon from '@mui/icons-material/Notes';
import LabelIcon from '@mui/icons-material/Label';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// --- 1. Custom Theme for a professional look ---
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4A90E2', // A vibrant blue
        },
        secondary: {
            main: '#50E3C2', // A minty green for accents
        },
        background: {
            default: '#F4F7F9', // A light gray background
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#777777',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '2.2rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.1rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                },
            },
        },
    },
});

// --- 2. Styled components for elegant UI elements ---
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    background: theme.palette.background.paper,
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: '12px',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    transition: 'background-color 0.3s ease, transform 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#eef3f6', // A slightly darker gray on hover
        transform: 'scale(1.01)',
    },
}));

const InfoBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

// Main component starts here
const LabTechnicianTestReports = ({ medicalRecordId, onBack, labTechnician, orderedByDoctorId }) => {
    const [testReports, setTestReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newTestReport, setNewTestReport] = useState({
        testName: '',
        testType: '',
        results: '',
        resultNotes: '',
        status: 'Completed', // Default status for new reports
    });
    const [documentFile, setDocumentFile] = useState(null);

    const fetchTestReports = async () => {
        if (!medicalRecordId) {
            setError("Medical Record ID is not available for fetching test reports.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:2006/api/diagnostic-tests/medical/${medicalRecordId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch test reports: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setTestReports(data);
        } catch (err) {
            setError(err.message || "Failed to load test reports. Please check your network connection and the server status.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestReports();
    }, [medicalRecordId]);

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setError(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setNewTestReport({
            testName: '',
            testType: '',
            results: '',
            resultNotes: '',
            status: 'Completed',
        });
        setDocumentFile(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewTestReport(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files[0]);
    };

    const handleAddTestReport = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        setError(null);

        const formData = new FormData();
        formData.append('testName', newTestReport.testName);
        formData.append('testType', newTestReport.testType);
        formData.append('results', newTestReport.results);
        formData.append('resultNotes', newTestReport.resultNotes);
        formData.append('medicalRecordId', medicalRecordId);
        formData.append('performedByUserId', labTechnician?.userId || 'labtech-123');
        formData.append('orderedByDoctorId', orderedByDoctorId);
        formData.append('status', newTestReport.status);
        formData.append('uploadedAt', new Date().toISOString());

        if (documentFile) {
            formData.append('document', documentFile);
        }

        try {
            const response = await fetch(import.meta.env.VITE_MEDICAL_RECORD_SERVICE_URL + '/api/diagnostic-tests', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to add test report: ' + response.status + ' - ' + errorText);
            }

            await response.json();
            fetchTestReports();
            handleCloseForm();
        } catch (err) {
            setError(err.message || "Failed to add test report. The server may be unavailable or the request was malformed.");
        } finally {
            setIsAdding(false);
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Completed':
                return (
                    <Chip
                        icon={<TaskAltIcon />}
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ ml: 1, fontWeight: 'bold' }}
                    />
                );
            case 'Pending':
                return (
                    <Chip
                        icon={<AccessTimeIcon />}
                        label="Pending"
                        color="warning"
                        size="small"
                        sx={{ ml: 1, fontWeight: 'bold' }}
                    />
                );
            case 'Cancelled':
                return (
                    <Chip
                        icon={<ErrorOutlineIcon />}
                        label="Cancelled"
                        color="error"
                        size="small"
                        sx={{ ml: 1, fontWeight: 'bold' }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto', width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ mb: 3, color: 'text.primary' }}
                >
                    Back to Medical Record Details
                </Button>

                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
                    Diagnostic Test Reports
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenForm}
                        disabled={isAdding || loading}
                    >
                        Add New Test Report
                    </Button>
                </Box>

                {/* Conditional rendering for loading, error, and empty state */}
                {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Loading Test Reports...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && testReports.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
                        No diagnostic test reports found for this medical record.
                    </Alert>
                )}

                {!loading && !error && testReports.length > 0 && (
                    <StyledPaper elevation={6}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                            Test Reports List
                        </Typography>
                        <List disablePadding>
                            {testReports.map((report, index) => (
                                <React.Fragment key={report.id || index}>
                                    <StyledListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                                                        <ScienceIcon sx={{ mr: 1, color: 'secondary.main' }} />
                                                        Test: {report.testName || 'N/A'}
                                                    </Typography>
                                                    {getStatusChip(report.status)}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ pl: 3 }}>
                                                    <InfoBox>
                                                        <LabelIcon fontSize="small" />
                                                        <Typography variant="body2" sx={{ ml: 1, color: 'text.primary' }}>
                                                            Type: {report.testType || 'N/A'}
                                                        </Typography>
                                                    </InfoBox>
                                                    <InfoBox>
                                                        <DescriptionIcon fontSize="small" />
                                                        <Typography variant="body2" sx={{ ml: 1, color: 'text.primary' }}>
                                                            Results: {report.results || 'No results provided'}
                                                        </Typography>
                                                    </InfoBox>
                                                    <InfoBox>
                                                        <NotesIcon fontSize="small" />
                                                        <Typography variant="body2" sx={{ ml: 1, color: 'text.primary' }}>
                                                            Notes: {report.resultNotes || 'No notes provided'}
                                                        </Typography>
                                                    </InfoBox>
                                                    <InfoBox>
                                                        <CalendarMonthIcon fontSize="small" />
                                                        <Typography variant="body2" sx={{ ml: 1, color: 'text.primary' }}>
                                                            Date: {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </InfoBox>
                                                    
                                                    {report.reportDocumentUrl && (
                                                        <InfoBox sx={{ mt: 1 }}>
                                                            <InsertDriveFileIcon fontSize="small" />
                                                            <Link href={report.reportDocumentUrl} target="_blank" rel="noopener" sx={{ ml: 1 }}>
                                                                View Report Document
                                                            </Link>
                                                        </InfoBox>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </StyledListItem>
                                    {index < testReports.length - 1 && <Divider component="li" sx={{ my: 1, borderColor: '#e0e0e0' }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    </StyledPaper>
                )}

                {/* Dialog for adding a new test report */}
                <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Add New Diagnostic Test Report
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseForm}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <form onSubmit={handleAddTestReport}>
                        <DialogContent dividers>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                autoFocus
                                margin="dense"
                                name="testName"
                                label="Test Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={newTestReport.testName}
                                onChange={handleFormChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="testType"
                                label="Test Type (e.g., Blood Test, X-Ray)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={newTestReport.testType}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="results"
                                label="Results"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={newTestReport.results}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="resultNotes"
                                label="Result Notes"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={newTestReport.resultNotes}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<AttachFileIcon />}
                                    disabled={isAdding}
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {documentFile ? 'Change Document' : 'Upload Document'}
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {documentFile && (
                                    <Typography variant="body2" sx={{ ml: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {documentFile.name}
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseForm} disabled={isAdding}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isAdding} sx={{ borderRadius: '8px' }}>
                                {isAdding ? <CircularProgress size={24} /> : 'Add Test Report'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

LabTechnicianTestReports.propTypes = {
    medicalRecordId: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    labTechnician: PropTypes.shape({
        userId: PropTypes.string,
    }),
    orderedByDoctorId: PropTypes.string,
};

export default LabTechnicianTestReports;
