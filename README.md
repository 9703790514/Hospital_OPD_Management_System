# Hospital OPD Management System

A comprehensive Outpatient Department (OPD) management system for **Sarvotham's Spine Care** hospital, built with modern microservices architecture.

## 🏥 Overview

This system provides complete OPD management functionality including patient registration, appointment scheduling, doctor consultations, billing, medical records, and more.

## 🏗️ Architecture

**Frontend:** React.js with Material-UI  
**Backend:** Spring Boot Microservices  
**Database:** MongoDB  
**Authentication:** JWT with BCrypt password hashing

## 📦 Project Structure

```
hospital-opd-management-system/
├── frontend/              # React frontend application
├── backend/               # Spring Boot microservices
│   ├── LoginService/
│   ├── RegistrationService/
│   ├── AppointmentMicroService/
│   ├── BillMicroService/
│   ├── DoctorMicroService/
│   ├── PatientMicroService/
│   ├── users-microservice/
│   ├── roles-microservice/
│   └── ... (more microservices)
├── docs/                  # Documentation and diagrams
└── database/              # Database schemas and collections
```

## 🚀 Features

### Patient Management
- ✅ Patient registration with validation
- ✅ Patient profile management
- ✅ Medical history tracking
- ✅ Prescription management

### Appointment System
- ✅ Book appointments with doctors
- ✅ Doctor availability management
- ✅ Appointment status tracking
- ✅ Queue management

### Doctor Management
- ✅ Doctor profiles and specializations
- ✅ Availability scheduling
- ✅ Patient consultation records
- ✅ Doctor ratings and reviews

### Billing & Payments
- ✅ Generate bills for consultations
- ✅ Diagnostic test billing
- ✅ Payment tracking
- ✅ Bill history

### Medical Records
- ✅ Electronic medical records (EMR)
- ✅ Prescription management
- ✅ Diagnostic test results
- ✅ Medical document uploads

### Security
- ✅ JWT-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based access control
- ✅ Secure API endpoints

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19
- **UI Library:** Material-UI (MUI) 7
- **Routing:** React Router DOM 7
- **State Management:** React Hooks
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4

### Backend
- **Framework:** Spring Boot 3.5.4
- **Security:** Spring Security with JWT
- **Database:** MongoDB
- **API Documentation:** Swagger/OpenAPI
- **Build Tool:** Maven
- **Java Version:** 17

### Additional Services
- **Email:** Spring Mail (Gmail SMTP)
- **SMS:** Twilio API
- **Charts:** Chart.js
- **PDF Generation:** jsPDF

## 📋 Prerequisites

- **Java:** JDK 17 or higher
- **Node.js:** v18 or higher
- **MongoDB:** v5.0 or higher
- **Maven:** 3.8 or higher

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/hospital-opd-management-system.git
cd hospital-opd-management-system
```

### 2. Backend Setup

**Set Environment Variables:**

Create a `.env` file in the `backend` directory or set system environment variables:

```bash
# Database
export MONGODB_URI=mongodb://localhost:27017/OPD

# Service Ports
export LOGIN_SERVICE_PORT=2003
export USERS_SERVICE_PORT=2002
export APPOINTMENT_SERVICE_PORT=2001
# ... (see backend/.env.example for all variables)

# Email Configuration
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password

# Twilio SMS
export TWILIO_ACCOUNT_SID=your-account-sid
export TWILIO_AUTH_TOKEN=your-auth-token
export TWILIO_PHONE_NUMBER=+1234567890

# JWT Security
export JWT_SECRET=your-secure-256-bit-secret-key
export JWT_EXPIRATION_MS=86400000

# CORS
export ALLOWED_ORIGINS=http://localhost:5173
```

**Build & Run Microservices:**

```bash
# For each microservice
cd backend/LoginService
mvn clean install
mvn spring-boot:run

# Repeat for other services...
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API endpoints

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Security Configuration

### Important Security Notes

1. **Password Hashing:** All passwords are hashed with BCrypt
2. **JWT Tokens:** Tokens expire after 24 hours (configurable)
3. **Environment Variables:** Never commit `.env` files to Git
4. **CORS:** Configure `ALLOWED_ORIGINS` for production domains

### First-Time Setup

After setting up the system, you'll need to:

1. Create admin user in MongoDB
2. Configure email credentials for notifications
3. Set up Twilio for OTP functionality
4. Generate a strong JWT secret key

## 📊 Microservices Ports

| Service | Port |
|---------|------|
| LoginService | 2003 |
| RegistrationService | 2010 |
| AppointmentMicroService | 2001 |
| UsersMicroService | 2002 |
| PatientMicroService | 2004 |
| DoctorMicroService | 2005 |
| MedicalRecordMicroService | 2006 |
| DoctorRatingMicroService | 2007 |
| BillMicroService | 2009 |
| OTPMicroService | 1009 |
| RolesMicroService | 2011 |
| NurseCheckUpsMicroService | 2012 |
| EmailService | 1111 |

## 🧪 Testing

### Backend Tests
```bash
cd backend/LoginService
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📖 API Documentation

Once the services are running, access Swagger UI at:

```
http://localhost:2003/swagger-ui/index.html  (LoginService)
http://localhost:2001/swagger-ui/index.html  (AppointmentService)
# ... etc for each service
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project:** Capstone Project 2025
- **Organization:** Sarvotham's Spine Care
- **Type:** Hospital OPD Management System

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

## 🔄 Version History

- **v1.0.0** (May 2026) - Initial release with all core features
  - JWT authentication implemented
  - BCrypt password hashing
  - Environment-based configuration
  - Input validation
  - Production-ready CORS setup

## ⚠️ Known Issues

- Existing user passwords need to be re-hashed after security updates
- Email service requires Gmail App Password (not regular password)
- Twilio account required for OTP functionality

## 🚀 Future Enhancements

- [ ] Add refresh token mechanism
- [ ] Implement password reset via email
- [ ] Add comprehensive logging with SLF4J
- [ ] Set up CI/CD pipeline
- [ ] Add health check endpoints
- [ ] Implement API versioning
- [ ] Add WebSocket for real-time notifications
- [ ] Mobile application support

---

**Built with ❤️ for better healthcare management**
