// import React, { useState } from 'react';

// const App = () => {
//   // Form state variables
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [gender, setGender] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [allergies, setAllergies] = useState('');
//   const [currentMedications, setCurrentMedications] = useState('');
//   const [termsAgreed, setTermsAgreed] = useState(false);

//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     // Basic validation
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (!termsAgreed) {
//       setError("You must agree to the Terms of Service and Privacy Policy.");
//       return;
//     }

//     // Prepare the data as a JavaScript object (JSON format)
//     const registrationData = {
//       username,
//       password,
//       email,
//       phoneNumber,
//       image: imageUrl,
//       firstName,
//       lastName,
//       dateOfBirth,
//       gender,
//       contactNumber,
//       address,
//       bloodGroup,
//       allergies,
//       currentMedications,
//     };

//     console.log('Submitting registration form data (JSON):', registrationData);

//     try {
//       const response = await fetch('http://localhost:2004/api/patient/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(registrationData),
//       });

//       if (response.ok) {
//         setSuccessMessage("Registration submitted successfully!");
//         // Reset form fields after successful submission
//         setUsername('');
//         setPassword('');
//         setConfirmPassword('');
//         setEmail('');
//         setPhoneNumber('');
//         setImageUrl('');
//         setFirstName('');
//         setLastName('');
//         setDateOfBirth('');
//         setGender('');
//         setContactNumber('');
//         setAddress('');
//         setBloodGroup('');
//         setAllergies('');
//         setCurrentMedications('');
//         setTermsAgreed(false);
//       } else {
//         const errorText = await response.text();
//         setError(`Submission failed: ${errorText || response.statusText}`);
//       }
//     } catch (err) {
//       setError(`Submission failed: ${err.message || "Could not connect to the server."}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
//         <div className="text-center mb-8">
//           <div className="text-4xl font-extrabold text-blue-600 mb-2">SSC</div>
//           <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
//           <p className="text-gray-500 mt-2">Join Sarvotham's Spine Care for personalized health management.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{error}</div>}
//           {successMessage && <div className="bg-green-100 text-green-700 p-4 rounded-lg text-sm">{successMessage}</div>}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Account Details Section */}
//             <fieldset className="space-y-6">
//               <legend className="text-lg font-semibold text-gray-700">Account Details</legend>
              
//               <div className="space-y-2">
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username *</label>
//                 <input
//                   type="text" id="username" placeholder="Choose a username" required
//                   value={username} onChange={e => setUsername(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
//                 <input
//                   type="email" id="email" placeholder="your.email@example.com" required
//                   value={email} onChange={e => setEmail(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number *</label>
//                 <input
//                   type="tel" id="phoneNumber" placeholder="+91 9876543210" required
//                   value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
//                 <input
//                   type="url" id="imageUrl" placeholder="e.g., https://example.com/your-image.jpg"
//                   value={imageUrl} onChange={e => setImageUrl(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//                 {imageUrl && (
//                   <div className="mt-2">
//                     <img src={imageUrl} alt="Profile Preview" className="max-w-[100px] rounded-lg shadow-sm" />
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
//                 <input
//                   type="password" id="password" placeholder="Create your password" required
//                   value={password} onChange={e => setPassword(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password *</label>
//                 <input
//                   type="password" id="confirmPassword" placeholder="Re-enter your password" required
//                   value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </fieldset>

//             {/* Personal & Medical Information Section */}
//             <fieldset className="space-y-6">
//               <legend className="text-lg font-semibold text-gray-700">Personal Information</legend>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
//                   <input
//                     type="text" id="firstName" placeholder="First Name" required
//                     value={firstName} onChange={e => setFirstName(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
//                   <input
//                     type="text" id="lastName" placeholder="Last Name" required
//                     value={lastName} onChange={e => setLastName(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
//                   <input
//                     type="date" id="dateOfBirth" required
//                     value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
//                     max={new Date().toISOString().slice(0, 10)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender *</label>
//                   <select id="gender" required value={gender} onChange={e => setGender(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="" disabled>-- Select Gender --</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                     <option value="Prefer not to say">Prefer not to say</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number (Emergency) *</label>
//                 <input
//                   type="tel" id="contactNumber" placeholder="+91 9876543210" required
//                   value={contactNumber} onChange={e => setContactNumber(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
//                 <textarea
//                   id="address" placeholder="Your full address" rows={2} required
//                   value={address} onChange={e => setAddress(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group *</label>
//                 <select id="bloodGroup" required value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="" disabled>-- Select Blood Group --</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
//                 <textarea
//                   id="allergies" placeholder="List any allergies" rows={2}
//                   value={allergies} onChange={e => setAllergies(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">Current Medications</label>
//                 <textarea
//                   id="currentMedications" placeholder="List current medications" rows={2}
//                   value={currentMedications} onChange={e => setCurrentMedications(e.target.value)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </fieldset>
//           </div>

//           <div className="mt-6">
//             <div className="flex items-start space-x-2">
//               <input
//                 type="checkbox" id="terms" checked={termsAgreed}
//                 onChange={e => setTermsAgreed(e.target.checked)} required
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="terms" className="text-sm text-gray-600">
//                 I agree to the <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</a>
//               </label>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Register Account
//           </button>
//         </form>

//         <div className="text-center mt-6 text-sm text-gray-500">
//           Already have an account? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Login here</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  Phone,
  Lock,
  CalendarMonth,
  Wc,
  Bloodtype,
  LocalHospital,
  Warning,
  CheckCircle,
  AddAPhoto,
  LocationOn,
  Message,
  Medication,
  Person,
  Check,
  FavoriteBorder,
} from '@mui/icons-material';

// A modern, reusable input field component using MUI
const InputField = ({ label, type, id, placeholder, value, onChange, required, icon: Icon, children, className = '' }) => {
  if (type === 'select') {
    return (
      <FormControl fullWidth required={required} margin="normal" variant="outlined">
        <InputLabel id={`${id}-label`} sx={{ color: '#666' }}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          label={label}
          onChange={onChange}
          sx={{
            borderRadius: '12px',
            bgcolor: '#fff',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2b5da3',
              boxShadow: '0 0 5px rgba(43, 93, 163, 0.5)',
            },
          }}
          startAdornment={Icon && (
            <InputAdornment position="start">
              <Icon sx={{ color: '#2b5da3' }} />
            </InputAdornment>
          )}
        >
          {children}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      required={required}
      id={id}
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      multiline={type === 'textarea'}
      rows={type === 'textarea' ? 3 : 1}
      variant="outlined"
      margin="normal"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          bgcolor: '#fff',
          transition: 'all 0.3s ease-in-out',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2b5da3',
            boxShadow: '0 0 5px rgba(43, 93, 163, 0.5)',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#666',
          '&.Mui-focused': {
            color: '#2b5da3',
          }
        }
      }}
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon sx={{ color: '#2b5da3' }} />
          </InputAdornment>
        ),
        inputProps: {
          max: type === 'date' ? new Date().toISOString().slice(0, 10) : undefined,
        }
      }}
    />
  );
};

const App = () => {
  // Form state variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // State to handle the clean base64 string and the preview URL
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle file selection and preview generation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const fullDataUrl = reader.result;
        const commaIndex = fullDataUrl.indexOf(',');
        if (commaIndex !== -1) {
          setImageBase64(fullDataUrl.substring(commaIndex + 1));
        } else {
          setImageBase64(fullDataUrl);
        }
        setImagePreviewUrl(fullDataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImageBase64('');
      setImagePreviewUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!termsAgreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    const registrationData = {
      username,
      password,
      email,
      phoneNumber,
      image: imageBase64,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      bloodGroup,
      allergies,
      currentMedications,
    };


    try {
      const response = await fetch('http://localhost:2004/api/patient/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        setSuccessMessage("Registration submitted successfully!");
        // Reset form fields after successful submission
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhoneNumber('');
        setImageFile(null);
        setImageBase64('');
        setImagePreviewUrl('');
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setGender('');
        setContactNumber('');
        setAddress('');
        setBloodGroup('');
        setAllergies('');
        setCurrentMedications('');
        setTermsAgreed(false);
      } else {
        const errorText = await response.text();
        setError(`Submission failed: ${errorText || response.statusText}`);
      }
    } catch (err) {
      setError(`Submission failed: ${err.message || "Could not connect to the server."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', // Subtle gradient background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        py: { xs: 2, sm: 4, md: 6 },
        fontFamily: 'Roboto, sans-serif'
      }}
    >
      <Paper
        elevation={12} // Increased elevation for a more prominent effect
        sx={{
          p: { xs: 3, sm: 6, md: 8 },
          borderRadius: '24px',
          maxWidth: '1200px',
          width: '95%',
          mx: 'auto',
          my: { xs: 2, md: 4 },
          bgcolor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white background
          backdropFilter: 'blur(5px)', // Add a subtle blur effect
        }}
      >
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#2b5da3',
              mb: 1,
              letterSpacing: '2px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            SSC
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}
          >
            Create Your Patient Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Sarvotham's Spine Care for personalized health management.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {error && (
            <Box sx={{
              bgcolor: '#fee2e2', color: '#991b1b', p: 2, borderRadius: '12px', mb: 4, display: 'flex', alignItems: 'center', transition: 'all 0.3s'
            }}>
              <Warning sx={{ mr: 1 }} />
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          {successMessage && (
            <Box sx={{
              bgcolor: '#dcfce7', color: '#166534', p: 2, borderRadius: '12px', mb: 4, display: 'flex', alignItems: 'center', transition: 'all 0.3s'
            }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="body2">{successMessage}</Typography>
            </Box>
          )}

          <Grid container spacing={{ xs: 4, lg: 8 }}>
            {/* Account Details Section */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#2b5da3' }} /> Account Details
                </Typography>
                <InputField label="Username" type="text" id="username" placeholder="Choose a username" required value={username} onChange={e => setUsername(e.target.value)} icon={AccountCircle} />
                <InputField label="Email Address" type="email" id="email" placeholder="your.email@example.com" required value={email} onChange={e => setEmail(e.target.value)} icon={Email} />
                <InputField label="Phone Number" type="tel" id="phoneNumber" placeholder="+91 9876543210" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} icon={Phone} />

                {/* File Upload Input Field with preview */}
                <Box mt={3} mb={2}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                    <AddAPhoto sx={{ mr: 1, color: '#2b5da3' }} /> Profile Image
                  </Typography>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<AddAPhoto />}
                      sx={{
                        borderRadius: '24px',
                        textTransform: 'none',
                        bgcolor: '#2b5da3',
                        '&:hover': { bgcolor: '#1a4a82', transform: 'scale(1.05)' },
                        transition: 'all 0.3s'
                      }}
                    >
                      {imageFile ? "Change File" : "Choose File"}
                      <input type="file" hidden id="imageFile" accept="image/*" onChange={handleFileChange} />
                    </Button>
                    {imagePreviewUrl ? (
                      <Avatar src={imagePreviewUrl} alt="Profile Preview" sx={{ width: 80, height: 80, border: '3px solid #2b5da3', boxShadow: '0 0 8px rgba(43, 93, 163, 0.3)' }} />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', border: '2px dashed #ccc', transition: 'all 0.3s' }}>
                        <Person sx={{ color: '#aaa', fontSize: 40 }} />
                      </Avatar>
                    )}
                    {/* Conditionally render the username if it exists */}
                    {username && (
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', ml: 2 }}>
                        {username}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <InputField label="Password" type="password" id="password" placeholder="Create your password" required value={password} onChange={e => setPassword(e.target.value)} icon={Lock} />
                <InputField label="Confirm Password" type="password" id="confirmPassword" placeholder="Re-enter your password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={Lock} />
              </Paper>
            </Grid>

            {/* Personal & Medical Information Section */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <FavoriteBorder sx={{ mr: 1, color: '#991b1b' }} /> Personal & Medical Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputField label="First Name" type="text" id="firstName" placeholder="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField label="Last Name" type="text" id="lastName" placeholder="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputField label="Date of Birth" type="date" id="dateOfBirth" required value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} icon={CalendarMonth} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField label="Gender" type="select" id="gender" required value={gender} onChange={e => setGender(e.target.value)} icon={Wc}>
                      <MenuItem value="" disabled>-- Select Gender --</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </InputField>
                  </Grid>
                </Grid>

                <InputField label="Contact Number (Emergency)" type="tel" id="contactNumber" placeholder="+91 9876543210" required value={contactNumber} onChange={e => setContactNumber(e.target.value)} icon={Phone} />
                <InputField label="Address" type="textarea" id="address" placeholder="Your full address" required value={address} onChange={e => setAddress(e.target.value)} icon={LocationOn} />
                <InputField label="Blood Group" type="select" id="bloodGroup" required value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} icon={Bloodtype}>
                  <MenuItem value="" disabled>-- Select Blood Group --</MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </InputField>
                <InputField label="Allergies" type="textarea" id="allergies" placeholder="List any allergies" value={allergies} onChange={e => setAllergies(e.target.value)} icon={LocalHospital} />
                <InputField label="Current Medications" type="textarea" id="currentMedications" placeholder="List current medications" value={currentMedications} onChange={e => setCurrentMedications(e.target.value)} icon={Medication} />
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6, borderColor: '#a6c6e7' }} />

          <Box mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAgreed}
                  onChange={e => setTermsAgreed(e.target.checked)}
                  required
                  sx={{ color: '#2b5da3', '&.Mui-checked': { color: '#2b5da3' } }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the <a href="#" style={{ color: '#2b5da3', fontWeight: 'bold', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#2b5da3', fontWeight: 'bold', textDecoration: 'none' }}>Privacy Policy</a>
                </Typography>
              }
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check />}
            sx={{
              mt: 4,
              py: 2,
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              bgcolor: '#2b5da3',
              boxShadow: '0 4px 15px rgba(43, 93, 163, 0.4)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: '#1a4a82',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(43, 93, 163, 0.5)',
              }
            }}
          >
            {loading ? 'Registering...' : 'Register Account'}
          </Button>
        </form>

        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <a href="/login" style={{ color: '#2b5da3', fontWeight: 'bold', textDecoration: 'none' }}>
              Login here
            </a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default App;
