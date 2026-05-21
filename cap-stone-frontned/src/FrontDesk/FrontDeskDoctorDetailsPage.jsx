import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Paper,
  Rating,
  Stack,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Import for Book Appointment button

// Custom styled Rating component with gold stars and smooth transition
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#FFD700', // Gold for filled stars
    transition: 'color 0.3s ease',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ccc',
  },
}));

export const FrontDeskDoctorDetailsPage = ({ doctorId, onBack, patient, onNavigate }) => { // Added onNavigate prop
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmissionError, setReviewSubmissionError] = useState(null);
  const [reviewSubmissionSuccess, setReviewSubmissionSuccess] = useState(false);

  const STATIC_OVERVIEW =
    "Dr. is committed to providing compassionate, evidence-based care, tailoring treatments to improve your overall wellness and quality of life. With years of experience, Dr. combines clinical expertise with a patient-first approach.";

  const STATIC_ADDITIONAL_INFO = [
    "Member of the American Medical Association",
    "Recipient of the Excellence in Patient Care Award 2024",
    "Board Certified in Cardiology",
    "Published multiple research articles in peer-reviewed journals",
  ];

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) {
        setDoctorError("Doctor ID is not available for fetching details.");
        setLoadingDoctor(false);
        return;
      }

      setLoadingDoctor(true);
      setDoctorError(null);


      try {
        const response = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/' + doctorId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Failed to fetch doctor details: ' + response.status + ' - ' + errorText);
        }

        const data = await response.json();
        // Add a dummy profilePic URL for demonstration purposes if not present
        const doctorWithProfilePic = {
          ...data,
          // Use 'image' from the API if available, otherwise fallback to placeholder
          image: data.image || `https://placehold.co/180x180/ADD8E6/000000?text=${data.firstName ? data.firstName[0].toUpperCase() : ''}${data.lastName ? data.lastName[0].toUpperCase() : ''}`
        };
        setDoctor(doctorWithProfilePic);
      } catch (err) {
        setDoctorError(err.message || "Failed to load doctor details.");
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  // Fetch reviews
  useEffect(() => {
    async function fetchDoctorReviews() {
      if (!doctor || !doctor.id) {
        setReviewsError("Doctor ID not available for fetching reviews.");
        setLoadingReviews(false);
        return;
      }
      setLoadingReviews(true);
      setReviewsError(null);
      try {
        const response = await fetch(import.meta.env.VITE_DOCTOR_RATING_SERVICE_URL + '/ratings/doctor/' + doctor.id);
        if (!response.ok) throw new Error('Failed to fetch reviews: ' + response.status + ' ' + response.statusText);
        const data = await response.json();

        const reviewsWithNames = await Promise.all(data.map(async (review) => {
          if (review.patientId) {
            try {
              const patientResponse = await fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + review.patientId);
              if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                return { ...review, reviewerName: `${patientData.first_name || ''} ${patientData.last_name || ''}`.trim() };
              }
            } catch {
              // fail silently
            }
          }
          return { ...review, reviewerName: 'Anonymous' };
        }));

        setReviews(reviewsWithNames);

        if (reviewsWithNames.length > 0) {
          const totalRatings = reviewsWithNames.reduce((sum, r) => sum + r.doctorRating, 0);
          setAverageRating(totalRatings / reviewsWithNames.length);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setReviewsError(err.message);
      } finally {
        setLoadingReviews(false);
      }
    }

    if (doctor) {
      fetchDoctorReviews();
    }
  }, [doctor]);

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      setReviewSubmissionError("Please provide a rating.");
      return;
    }
    if (newReviewText.trim() === '') {
      setReviewSubmissionError("Please provide a review description.");
      return;
    }
    if (!patient || !patient.userId) {
      setReviewSubmissionError("Patient ID not available. Please ensure you are logged in.");
      return;
    }

    setSubmittingReview(true);
    setReviewSubmissionError(null);
    setReviewSubmissionSuccess(false);

    const reviewPayload = {
      patientId: patient.userId,
      doctorId: doctor.id,
      doctorRating: newRating,
      description: newReviewText,
      time: new Date().toISOString(),
    };

    try {
      const response = await fetch(import.meta.env.VITE_DOCTOR_RATING_SERVICE_URL + '/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });
      if (!response.ok) throw new Error('Failed to submit review: ' + response.status + ' ' + response.statusText);

      await response.json();
      setReviewSubmissionSuccess(true);
      setNewRating(0);
      setNewReviewText('');
      // Re-fetch reviews
      const updatedResponse = await fetch(import.meta.env.VITE_DOCTOR_RATING_SERVICE_URL + '/ratings/doctor/' + doctor.id);
      const updatedData = await updatedResponse.json();
      const updatedReviewsWithNames = await Promise.all(updatedData.map(async (review) => {
        if (review.patientId) {
          try {
            const patientResponse = await fetch(import.meta.env.VITE_PATIENT_SERVICE_URL + '/api/patients/' + review.patientId);
            if (patientResponse.ok) {
              const patientData = await patientResponse.json();
              return { ...review, reviewerName: (patientData.first_name || '') + ' ' + (patientData.last_name || '') };
            }
          } catch {
            // fail silently
          }
        }
        return { ...review, reviewerName: 'Anonymous' };
      }));
      setReviews(updatedReviewsWithNames);
      const avg = updatedReviewsWithNames.length > 0 ? updatedReviewsWithNames.reduce((sum, r) => sum + r.doctorRating, 0) / updatedReviewsWithNames.length : 0;
      setAverageRating(avg);
    } catch (error) {
      setReviewSubmissionError(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setReviewSubmissionError(null);
    setReviewSubmissionSuccess(false);
  };

  // Updated function to handle booking an appointment
  const handleBookAppointment = () => {
    if (doctor && doctor.id && onNavigate) {
      onNavigate(`book-appointment/${doctor.id}`); // Navigate to the booking page
    } else {
      // You might want to show a user-friendly message here instead of just console.error
      // For example, using a Snackbar or a custom dialog.
    }
  };


  if (loadingDoctor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, mt: 2 }}>Loading Doctor Details...</Typography>
      </Box>
    );
  }

  if (doctorError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading doctor details: {doctorError}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 3 }}
        >
          Back to Doctors
        </Button>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">No doctor found for this ID.</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 3 }}
        >
          Back to Doctors
        </Button>
      </Box>
    );
  }

  const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || "Unnamed Doctor";
  const STATIC_BIO = `Dr. ${doctor.firstName || 'the Doctor'} is a highly experienced and compassionate medical professional dedicated to providing exceptional patient care. With a strong background in their specialized field, Dr. ${doctor.lastName || ''} is committed to staying at the forefront of medical advancements to offer the best possible treatments. They believe in a holistic approach to health, focusing not only on treating illnesses but also on promoting overall well-being and preventive care. Patients consistently praise Dr. ${doctor.lastName || ''}'s thoroughness, clear communication, and empathetic demeanor.`;


  return (
    <Box
      component={Paper}
      elevation={12}
      sx={{
        py: 5,
        px: { xs: 3, sm: 5, md: 6 },
        maxWidth: 900,
        mx: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 6,
      }}
    >
      <Box sx={{ alignSelf: 'flex-start', mb: 4, display: 'flex', gap: 2 }}> {/* Container for buttons */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            px: 3,
            py: 1.3,
            fontWeight: 700,
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.dark',
              color: 'white',
            },
          }}
        >
          Back to Doctors List
        </Button>
        <Button
          variant="contained"
          startIcon={<EventNoteIcon />}
          onClick={handleBookAppointment}
          sx={{
            px: 3,
            py: 1.3,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            backgroundColor: 'secondary.main', // Use secondary color for action
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          Book Appointment
        </Button>
      </Box>

      <Avatar
        alt={`Dr. ${fullName}`}
        src={doctor.image}
        sx={{
          width: 180,
          height: 180,
          mb: 3,
          boxShadow: '0 12px 30px rgba(25, 118, 210, 0.4)',
          border: '5px solid',
          borderColor: 'primary.light',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />

      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.dark', letterSpacing: 0.5 }}>
        Dr. {fullName}
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic', textAlign: 'center', mb: 5, letterSpacing: 0.3 }}>
        {doctor.specialization || 'Specialization not listed'}
      </Typography>

      <Divider sx={{ width: '90%', mb: 6, borderColor: 'primary.light' }} />

      {/* Info Grid */}
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 5,
          mb: 6,
        }}
      >
        {[{
          icon: <EmailIcon color="primary" />,
          label: 'Email',
          value: doctor.email || 'N/A',
        }, {
          icon: <PhoneIcon color="primary" />,
          label: 'Contact',
          value: doctor.contactNumber || 'N/A',
        }, {
          icon: <LocalHospitalIcon color="primary" />,
          label: 'License #',
          value: doctor.licenseNumber || 'N/A',
        }, {
          icon: <SchoolIcon color="primary" />,
          label: 'Education',
          value: doctor.education || 'N/A',
        }, {
          icon: <WorkIcon color="primary" />,
          label: 'Experience',
          value: doctor.experience ? `${doctor.experience} Years` : 'N/A',
        }, {
          icon: <AttachMoneyIcon color="primary" />,
          label: 'Consultation Fee',
          value: doctor.consultationFee ? `â‚¹${doctor.consultationFee}` : 'N/A',
        }, {
          icon: <CalendarTodayIcon color="primary" />,
          label: 'Availability',
          value: doctor.availability || 'Contact to inquire',
        }].map(({ icon, label, value }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {label}:
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ width: '90%', mb: 6, borderColor: 'primary.light' }} />

      {/* Biography Section */}
      <Box sx={{ width: '100%', mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          About {doctor.firstName || 'the Doctor'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.6, userSelect: 'text' }}>
          {doctor.bio || STATIC_BIO}
        </Typography>
      </Box>

      {/* Overview Section */}
      <Box sx={{ width: '100%', mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          {STATIC_OVERVIEW}
        </Typography>
      </Box>

      {/* Ratings Section */}
      <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Patient Ratings
        </Typography>
        {loadingReviews ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : reviewsError ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Error loading ratings: {reviewsError}
          </Typography>
        ) : (
          <>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <StyledRating
                name="doctor-rating"
                value={averageRating}
                precision={0.1}
                readOnly
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{ fontSize: '2.8rem' }}
              />
              <Typography variant="h6" sx={{ ml: 1, color: 'text.primary', fontWeight: '600' }}>
                {averageRating.toFixed(1)} / 5.0
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Based on {reviews.length} patient review{reviews.length !== 1 ? 's' : ''}
            </Typography>
          </>
        )}
      </Box>

      {/* Reviews Section */}
      <Box sx={{ width: '100%', mb: 8 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Patient Reviews
        </Typography>
        {loadingReviews ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
            <CircularProgress size={36} />
          </Box>
        ) : reviewsError ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Could not load reviews: {reviewsError}
          </Typography>
        ) : reviews.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No reviews available for this doctor yet.
          </Typography>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review.id || review._id}
              elevation={1}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 3,
                bgcolor: '#fefefe',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.12)' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                  {review.reviewerName || 'Anonymous'}
                </Typography>
                <StyledRating
                  name={`review-rating-${review.id || review._id}`}
                  value={review.doctorRating}
                  readOnly
                  size="small"
                  precision={0.5}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, whiteSpace: 'pre-line' }}>
                {review.description}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ float: 'right' }}>
                {review.time ? new Date(review.time).toLocaleDateString() : 'N/A'}
              </Typography>
            </Paper>
          ))
        )}
      </Box>

      {/* Add New Review Section */}
      <Box
        sx={{
          width: '100%',
          mb: 7,
          p: 4,
          bgcolor: (theme) => theme.palette.primary.light,
          borderRadius: 4,
          boxShadow: '0 8px 28px rgba(25, 118, 210, 0.12)',
          color: (theme) => theme.palette.primary.contrastText,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Leave a Review
        </Typography>
        <Stack spacing={3} maxWidth={700} mx="auto">
          <Typography component="legend" sx={{ fontWeight: '600', fontSize: '1.1rem' }}>
            Your Rating
          </Typography>
          <StyledRating
            name="new-review-rating"
            value={newRating}
            precision={0.5}
            onChange={(event, newValue) => setNewRating(newValue)}
            icon={<StarIcon fontSize="large" />}
            emptyIcon={<StarIcon fontSize="large" />}
            sx={{ fontSize: '2.5rem' }}
          />
          <TextField
            label="Your Review"
            multiline
            rows={4}
            variant="filled"
            fullWidth
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiFilledInput-root': { borderRadius: 2 },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmitReview}
            disabled={submittingReview || !patient || !patient.userId}
            sx={{
              py: 1.8,
              fontWeight: '700',
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.25)' },
            }}
          >
            {submittingReview ? <CircularProgress size={26} color="inherit" /> : 'Submit Review'}
          </Button>
          {!patient || !patient.userId ? (
            <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
              Please log in to submit a review.
            </Typography>
          ) : null}
        </Stack>
      </Box>

      {/* Additional Info Section */}
      <Box sx={{ width: '100%', mb: 6, maxWidth: 700 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Additional Information
        </Typography>
        <Box component="ul" sx={{ pl: 3, color: 'text.primary', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {STATIC_ADDITIONAL_INFO.map((info, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              {info}
            </li>
          ))}
        </Box>
      </Box>

      {/* Static footer note */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'primary.light',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 10px 32px rgba(25, 118, 210, 0.18)',
          color: 'primary.contrastText',
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          maxWidth: 600,
          mx: 'auto',
          mb: 5,
          userSelect: 'none',
        }}
      >
        <Typography>
          Thank you for considering {fullName} for your healthcare needs. Our team is committed to providing the highest quality care tailored to your individual needs. Please contact us for appointments and inquiries.
        </Typography>
      </Box>

      {/* Snackbar for submission feedback */}
      <Snackbar
        open={reviewSubmissionSuccess || Boolean(reviewSubmissionError)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={reviewSubmissionSuccess ? 'success' : 'error'}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {reviewSubmissionSuccess ? 'Review submitted successfully!' : `Error: ${reviewSubmissionError}`}
        </Alert>
      </Snackbar>
    </Box>
  );
};

FrontDeskDoctorDetailsPage.propTypes = {
  doctorId: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  patient: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
  onNavigate: PropTypes.func.isRequired, // Added onNavigate propType
};

export default FrontDeskDoctorDetailsPage;
