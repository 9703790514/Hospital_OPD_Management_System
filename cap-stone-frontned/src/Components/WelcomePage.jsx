import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

// Using a real map embed URL for a hospital in Bengaluru
const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.756247385459!2d77.62561917508518!3d12.91974798737299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae145a30891461%3A0x6b2e1f40954b8d71!2sManipal%20Hospitals!5e0!3m2!1sen!2sin!4v1676643658514!5m2!1sen!2sin";

// Ensure Font Awesome is loaded for icons
export const WelcomePage = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [visibleDoctors, setVisibleDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const doctorsPerPage = 3;

  useEffect(() => {
    // Async function to fetch all doctors and their images
    const fetchDoctors = async () => {
      try {
        const doctorsResponse = await fetch(import.meta.env.VITE_DOCTOR_SERVICE_URL + '/api/doctors/all');
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors list: ' + doctorsResponse.statusText);
        }
        const doctorsWithImages = await Promise.all(
          doctorsData.map(async (doctor) => {
            if (doctor.customId) {
              const userResponse = await fetch(`${import.meta.env.VITE_USERS_SERVICE_URL}/api/users/${doctor.customId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                const imageSrc = `data:image/webp;base64,${userData.image}`;
                return { ...doctor, image: imageSrc };
              }
            }
            return doctor;
          })
        );
        setAllDoctors(doctorsWithImages);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load doctors at the moment.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Create a case-insensitive regular expression from the search term
    const regex = new RegExp(searchTerm, 'i');
    
    // Filter doctors based on the regex
    const filtered = allDoctors.filter(doctor =>
      (doctor.firstName && regex.test(doctor.firstName)) ||
      (doctor.lastName && regex.test(doctor.lastName)) ||
      (doctor.specialization && regex.test(doctor.specialization))
    );

    // Show all doctors if `showAll` is true, otherwise show only a subset
    if (showAll) {
      setVisibleDoctors(filtered);
    } else {
      setVisibleDoctors(filtered.slice(0, doctorsPerPage));
    }
  }, [allDoctors, showAll, searchTerm]);

  // Reset the 'View All' state when the search term changes
  useEffect(() => {
    setShowAll(false);
  }, [searchTerm]);

  const handleImageError = (e) => {
    e.target.src = 'https://source.unsplash.com/random/300x300?doctor';
  };

  const handleViewAllClick = () => {
    setShowAll(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="landing-page-container">
      <header className="header">
        <div className="logo-section">
          <img
            src="https://imgs.search.brave.com/I3lfsdq9k6y3txb8rAS9ukU5dwws1WPVNNQq7NQEIXI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ibHVlLW1lZGlj/YWwtZW1lcmdlbmN5/LXN0YXItbGlmZS13/aXRoLXdoaXRlLWNh/ZHVjZXVzLW1lZGlj/YWwtc3ltYm9sLXdo/aXRlLWJhY2tncm91/bmQtM2QtcmVuZGVy/aW5nXzQ3NjYxMi0x/NTA1NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw"
            alt="Sarvotham's Spine Care Logo"
            className="app-logo-image"
            style={{ height: '50px' }}
          />
          <h1 className="site-title">Sarvotham's Spine Care</h1>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#about" className="nav-link">About Us</a></li>
            <li><a href="#doctors" className="nav-link">Our Doctors</a></li>
            <li><a href="#contact" className="nav-link">Contact Us</a></li>
            <li><Link to="/login" className="nav-link primary-button-link">Login</Link></li>
            <li><Link to="/register" className="nav-link secondary-button-link">Register</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Your Journey to a Pain-Free Spine Starts Here.</h2>
          <p className="hero-subtitle">
            Experience world-class spine care with leading specialists and compassionate support in Bengaluru.
          </p>
        </div>
      </section>

      <section className="book-appointment-cta-section">
        <div className="book-appointment-cta-content">
          <h3 className="cta-title">Book an Appointment</h3>
          <p className="cta-message">
            To schedule your appointment, please contact us via our toll-free number or email. Our team is ready to assist you.
          </p>
          <div className="contact-info">
            <span className="contact-item">
              <i className="fas fa-phone"></i> Toll-Free: 1800-123-4567
            </span>
            <span className="contact-item">
              <i className="fas fa-envelope"></i> Email: <a href="mailto:appointments@sarvothamspine.com">appointments@sarvothamspine.com</a>
            </span>
          </div>
        </div>
      </section>

      <section className="doctor-list-section" id="doctors">
        <h3 className="section-title">Meet Our Leading Spine Specialists</h3>
        <p className="section-description">
          Our team is dedicated to providing personalized and advanced spine care.
        </p>

        {/* The search bar now has a margin at the bottom for spacing */}
        <div className="search-bar-container" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search for specialists by name or specialization..."
            className="search-input"
            aria-label="Search specialists"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {loading && <p>Loading doctors...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="doctor-cards-grid">
          {!loading && !error && visibleDoctors.length === 0 && <p>No doctors available at this time.</p>}
          {!loading && !error && visibleDoctors.map((doctor) => (
            <article
              className="doctor-card"
              key={doctor.id || doctor._id || doctor.userId}
              aria-label={`${doctor.firstName || ''} ${doctor.lastName || ''}, ${doctor.specialization || 'Specialist'}`}
            >
              <div className="doctor-profile-picture">
                <img
                  src={doctor.image || 'https://source.unsplash.com/random/300x300?doctor'}
                  alt={` ${doctor.firstName || ''} ${doctor.lastName || ''} Profile`}
                  onError={handleImageError}
                />
              </div>
              <div className="doctor-info">
                <h4 className="doctor-name">{` ${doctor.firstName || ''} ${doctor.lastName || ''}`}</h4>
                <p className="doctor-specialization">{doctor.specialization || 'Specialist'}</p>
                <p className="doctor-experience"><span>{doctor.experience ? `${doctor.experience}+ Years Experience` : ''}</span></p>
                <p className="doctor-education"><span>{doctor.education || ''}</span></p>
                <p className="doctor-consultation-fee"><span>Consultation Fee: ₹{doctor.consultationFee || 'N/A'}</span></p>
              </div>
            </article>
          ))}
        </div>

        {!showAll && visibleDoctors.length > 0 && allDoctors.length > doctorsPerPage && (
          <button className="view-all-doctors-button" type="button" onClick={handleViewAllClick}>
            View All Specialists
          </button>
        )}
      </section>

      <section className="about-section" id="about">
        <h3 className="section-title">Discover Sarvotham's Difference</h3>
        <p className="section-description">
          Leading the way in advanced spine care with a patient-centric approach.
        </p>
        <div className="about-content">
          <p>
            At Sarvotham's Spine Care, we combine cutting-edge technology with the expertise of highly skilled specialists
            to deliver personalized treatment plans. From diagnostics to rehabilitation, our holistic approach ensures
            comprehensive care for a wide range of spinal conditions, helping you regain mobility and improve your quality of life.
          </p>
          <ul className="about-features">
            <li>Advanced Diagnostic Imaging</li>
            <li>Minimally Invasive Surgical Options</li>
            <li>Comprehensive Physiotherapy & Rehabilitation</li>
            <li>Personalized Pain Management Programs</li>
          </ul>
        </div>
      </section>

      <section className="contact-form-section" id="contact">
        <h3 className="section-title">Connect With Us</h3>
        <p className="section-description">
          Have questions or need assistance? Reach out to our team today.
        </p>
        <div className="contact-grid">
          <div className="contact-form-wrapper">
            <h4 className="sub-title">Send us a message</h4>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Your Name" aria-label="Full Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="your.email@example.com" aria-label="Email Address" />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input type="tel" id="mobile" placeholder="+91 9876543210" aria-label="Mobile Number" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" rows="4" placeholder="How can we help you?" aria-label="Your Message"></textarea>
            </div>
            <button className="send-button" type="submit">Send Message</button>
          </div>

          <div className="contact-info-wrapper">
            <h4 className="sub-title">Our Contact Details</h4>
            <div className="info-item">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <p>Email: <a href="mailto:info@sarvothamspine.com">info@sarvothamspine.com</a></p>
            </div>
            <div className="info-item">
              <i className="fas fa-phone" aria-hidden="true"></i>
              <p>Phone: +91 80 1234 5678</p>
            </div>
            <div className="info-item">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <p>Address: 123 Spine Care Avenue, Bengaluru, Karnataka, India - 560034</p>
            </div>
            <div className="info-item">
              <i className="fas fa-clock" aria-hidden="true"></i>
              <p>Hours: Mon - Sat, 9:00 AM - 6:00 PM IST</p>
            </div>
            <div className="map-placeholder" aria-label="Map Location">
              <iframe
                title="Our Location"
                src={mapEmbedSrc}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#privacy-policy">Privacy Policy</a>
            <a href="#terms-of-service">Terms of Service</a>
            <a href="#sitemap">Sitemap</a>
          </div>
          <p>© {new Date().getFullYear()} Sarvotham's Spine Care. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default WelcomePage;
