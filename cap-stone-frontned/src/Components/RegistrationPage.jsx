import React, { useState, useEffect } from 'react';
import './RegistrationPage.css'; // Import the CSS file

export const RegistrationPage = () => {
  // Form state variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageBase64, setProfileImageBase64] = useState(''); // Stores Base64 string of the image
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
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const [existingUsers, setExistingUsers] = useState([]); // State to store existing users for validation
  const [isFetchingUsers, setIsFetchingUsers] = useState(true); // State to indicate if users are being fetched

  // Function to handle file selection and convert to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Limit file size to 2MB (2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2MB. Please choose a smaller image.");
        setProfileImageBase64('');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is the Base64 string (e.g., "data:image/png;base64,iVBORw0...")
        setProfileImageBase64(reader.result);
        setError(''); // Clear any previous file-related errors
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setProfileImageBase64('');
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageBase64('');
    }
  };

  // Function to fetch existing users from the backend
  const fetchExistingUsers = async () => {
    setIsFetchingUsers(true);
    setError('');
    const MAX_RETRIES = 3;
    let retries = 0;
    let response;

    while (retries < MAX_RETRIES) {
      try {
        response = await fetch(`${import.meta.env.VITE_USERS_SERVICE_URL}/api/users`);
        if (response.status === 429) { // Too Many Requests
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(res => setTimeout(res, delay));
          retries++;
          continue;
        }
        break;
      } catch (err) {
        if (retries < MAX_RETRIES - 1) {
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(res => setTimeout(res, delay));
          retries++;
        } else {
          setError(`Failed to load existing user data: ${err.message || "Network error"}. Please try again later.`);
          setIsFetchingUsers(false);
          return; // Stop execution if fetching users fails after retries
        }
      }
    }

    if (response && response.ok) {
      const users = await response.json();
      setExistingUsers(users);
    } else if (response) {
      const errorText = await response.text();
      setError(`Failed to load existing user data: ${errorText || response.statusText}`);
    } else {
      setError("Failed to load existing user data: Could not connect to the server.");
    }
    setIsFetchingUsers(false);
  };

  // Fetch existing users on component mount
  useEffect(() => {
    fetchExistingUsers();
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true); // Start loading

    // Prevent submission if users are still being fetched or fetch failed
    if (isFetchingUsers) {
      setError("Please wait, fetching user data for validation...");
      setIsLoading(false);
      return;
    }
    if (error && error.includes("Failed to load existing user data")) {
        setError("Cannot proceed with registration: Failed to load user data for validation.");
        setIsLoading(false);
        return;
    }

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (!termsAgreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      setIsLoading(false);
      return;
    }

    // --- Username and Email Validation against existing users ---
    const usernameExists = existingUsers.some(user => user.username === username);
    if (usernameExists) {
      setError("Username already taken. Please choose a different one.");
      setIsLoading(false);
      return;
    }

    const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setError("Email address already registered. Please use a different one or log in.");
      setIsLoading(false);
      return;
    }
    // --- End Username and Email Validation ---

    // Strip the Base64 prefix
    const imageToSend = profileImageBase64 ? profileImageBase64.split(',')[1] : '';

    // Prepare the data as a JavaScript object (JSON format)
    const registrationData = {
      username,
      password,
      email,
      phoneNumber,
      image: imageToSend,
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
      // Implement exponential backoff for API calls for registration
      const MAX_RETRIES = 3;
      let retries = 0;
      let response;

      while (retries < MAX_RETRIES) {
        try {
          response = await fetch('http://localhost:2004/api/patient/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
          });

          if (response.status === 429) { // Too Many Requests
            const delay = Math.pow(2, retries) * 1000; // Exponential backoff
            await new Promise(res => setTimeout(res, delay));
            retries++;
            continue; // Try again
          }
          break; // Exit loop if successful or non-429 error
        } catch (err) {
          // Network error or other fetch issues
          if (retries < MAX_RETRIES - 1) {
            const delay = Math.pow(2, retries) * 1000;
            await new Promise(res => setTimeout(res, delay));
            retries++;
          } else {
            throw err; // Re-throw if max retries reached
          }
        }
      }

      if (response && response.ok) {
        setSuccessMessage("Registration submitted successfully! You can now log in.");
        // Optionally reset form fields after successful submission:
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhoneNumber('');
        setProfileImageBase64('');
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
        fetchExistingUsers();
      } else if (response) {
        const errorText = await response.text();
        setError(`Submission failed: ${errorText || response.statusText}`);
      } else {
        setError("Submission failed: Could not connect to the server after multiple retries.");
      }
    } catch (err) {
      setError(`Submission failed: ${err.message || "An unexpected error occurred."}`);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="registration-page-container">
      <div className="registration-card">
        <div className="registration-header">
          <img
            src="https://imgs.search.brave.com/I3lfsdq9k6y3txb8rAS9ukU5dwws1WPVNNQq7NQEIXI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ibHVlLW1lZGlj/YWwtZW1lcmdlbmN5/LXN0YXItbGlmZS13/aXRoLXdoaXRlLWNh/ZHVjZXVzLW1lZGlj/YWwtc3ltYm9sLXdo/aXRlLWJhY2tncm91/bmQtM2QtcmVuZGVy/aW5nXzQ3NjYxMi0x/NTA1NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
            alt="Sarvotham's Spine Care Logo"
            className="app-logo-image"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/333333?text=Logo"; }}
          />
          <h2>Create Your Account</h2>
          <p>Join Sarvotham's Spine Care for personalized health management.</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* Error and Success Message Panel */}
          {(error || successMessage || isFetchingUsers) && (
            <div className={`message-panel ${error ? 'error-message-panel' : (successMessage ? 'success-message-panel' : 'info-message-panel')}`}>
              {isFetchingUsers ? "Loading user data for validation..." : (error || successMessage)}
            </div>
          )}

          <div className="form-sections-wrapper">
            {/* Account Details */}
            <fieldset className="form-section">
              <legend>Account Details</legend>

              <div className="form-group">
                <label htmlFor="username">Username <span className="required-star">*</span></label>
                <input
                  type="text" id="username" placeholder="Choose a username" required
                  value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required-star">*</span></label>
                <input
                  type="email" id="email" placeholder="your.email@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number <span className="required-star">*</span></label>
                <input
                  type="tel" id="phoneNumber" placeholder="+91 9876543210" required
                  value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} autoComplete="tel"
                />
              </div>

              {/* Profile Image File Input */}
              <div className="form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <input
                  type="file" id="profileImage" accept="image/*"
                  className="file-input"
                  onChange={handleFileChange}
                />
                {profileImageBase64 && (
  <div className="image-preview-container">
    <img
      src={profileImageBase64}
      alt="Profile Preview"
      className="profile-avatar"
    />
    <span className="image-label-text">Profile Preview</span>
  </div>
)}

              </div>

              <div className="form-group">
                <label htmlFor="password">Password <span className="required-star">*</span></label>
                <input
                  type="password" id="password" placeholder="Create your password" required
                  value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required-star">*</span></label>
                <input
                  type="password" id="confirmPassword" placeholder="Re-enter your password" required
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password"
                />
              </div>
            </fieldset>

            {/* Personal Information */}
            <fieldset className="form-section">
              <legend>Personal Information</legend>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="firstName">First Name <span className="required-star">*</span></label>
                  <input
                    type="text" id="firstName" placeholder="First Name" required
                    value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name"
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="lastName">Last Name <span className="required-star">*</span></label>
                  <input
                    type="text" id="lastName" placeholder="Last Name" required
                    value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="dateOfBirth">Date of Birth <span className="required-star">*</span></label>
                  <input
                    type="date" id="dateOfBirth" required
                    value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="gender">Gender <span className="required-star">*</span></label>
                  <select id="gender" required value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="" disabled>-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number (Emergency) <span className="required-star">*</span></label>
                <input
                  type="tel" id="contactNumber" placeholder="+91 9876543210" required
                  value={contactNumber} onChange={e => setContactNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address <span className="required-star">*</span></label>
                <textarea
                  id="address" placeholder="Your full address" rows={2} required
                  value={address} onChange={e => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group <span className="required-star">*</span></label>
                <select id="bloodGroup" required value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                  <option value="" disabled>-- Select Blood Group --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies" placeholder="List any allergies" rows={2}
                  value={allergies} onChange={e => setAllergies(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentMedications">Current Medications</label>
                <textarea
                  id="currentMedications" placeholder="List current medications" rows={2}
                  value={currentMedications} onChange={e => setCurrentMedications(e.target.value)}
                />
              </div>
            </fieldset>
          </div>

          <div className="terms-agreement">
            <input
              type="checkbox" id="terms" checked={termsAgreed}
              onChange={e => setTermsAgreed(e.target.checked)} required />
            <label htmlFor="terms" className="terms-label">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading || isFetchingUsers} // Disable button while fetching users or submitting
          >
            {isLoading || isFetchingUsers ? (
              <div className="loading-spinner-container">
                <div className="spinner"></div>
                {isFetchingUsers ? 'Loading data...' : 'Registering...'}
              </div>
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};
