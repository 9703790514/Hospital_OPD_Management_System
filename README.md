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
Capstone/
├── cap-stone-frontned/        # React frontend application (Vite)
│   ├── src/
│   │   ├── Components/        # Shared components
│   │   ├── Patient/           # Patient portal components
│   │   ├── Doctor/            # Doctor portal components
│   │   ├── Nurse/             # Nurse portal components
│   │   ├── FrontDesk/         # Front desk components
│   │   ├── BillingDesk/       # Billing desk components
│   │   └── LabTechnician/     # Lab technician components
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── package.json
│   └── vite.config.js
├── capstone-backend/          # Spring Boot microservices
│   ├── LoginService/          # Authentication service (Port 2003)
│   ├── users-microservice/    # User management (Port 2002)
│   ├── DoctorMicroService/    # Doctor management (Port 2005)
│   ├── PatientMicroService/   # Patient management (Port 2008)
│   ├── AppointmentMicroService/ # Appointments (Port 2010)
│   ├── BillMicroService/      # Billing (Port 2009)
│   ├── MedicalRecordMicroService-1/ # Medical records (Port 2006)
│   ├── DoctorRatingMicroService/ # Doctor ratings (Port 2007)
│   ├── NurseCheckUpsMicroService/ # Nurse checkups (Port 2012)
│   ├── OTPMicroService1/      # OTP service (Port 1009)
│   └── RegistrationService/   # Patient registration (Port 2011)
├── MongoDBCollections/        # Sample MongoDB collections
├── Class Diagrams/            # UML class diagrams
├── DatabaseDiagrams/          # Database schema diagrams
└── README.md
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
- **Maven:** 3.8 or higher (or use included Maven wrapper)
- **Node.js:** v18 or higher
- **npm:** v9 or higher
- **MongoDB:** v5.0 or higher (running on localhost:27017)

## ⚙️ Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/9703790514/Hospital_OPD_Management_System.git
cd Hospital_OPD_Management_System
```

### Step 2: MongoDB Setup

1. **Install MongoDB** (if not already installed)
2. **Start MongoDB** service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```
3. **Create Database:**
   ```bash
   mongosh
   use OPD
   ```
4. **Import Sample Collections** (optional but recommended):
   
   Navigate to the project root directory and import all MongoDB collections:
   
   ```bash
   # Import all collections one by one
   mongoimport --db OPD --collection appointments --file MongoDBCollections/OPD.appointments.json --jsonArray
   mongoimport --db OPD --collection bill_items --file MongoDBCollections/OPD.bill_items.json --jsonArray
   mongoimport --db OPD --collection bills --file MongoDBCollections/OPD.bills.json --jsonArray
   mongoimport --db OPD --collection diagnostic_tests --file MongoDBCollections/OPD.diagnostic_tests.json --jsonArray
   mongoimport --db OPD --collection doctor_availabilities --file MongoDBCollections/OPD.doctor_availabilities.json --jsonArray
   mongoimport --db OPD --collection doctors --file MongoDBCollections/OPD.doctors.json --jsonArray
   mongoimport --db OPD --collection doctors_rating --file MongoDBCollections/OPD.doctors_rating.json --jsonArray
   mongoimport --db OPD --collection medical_records --file MongoDBCollections/OPD.medical_records.json --jsonArray
   mongoimport --db OPD --collection nurse_checkups --file MongoDBCollections/OPD.nurse_checkups.json --jsonArray
   mongoimport --db OPD --collection patients --file MongoDBCollections/OPD.patients.json --jsonArray
   mongoimport --db OPD --collection prescriptions --file MongoDBCollections/OPD.prescriptions.json --jsonArray
   mongoimport --db OPD --collection roles --file MongoDBCollections/OPD.roles.json --jsonArray
   mongoimport --db OPD --collection users --file MongoDBCollections/OPD.users.json --jsonArray
   ```
   
   **Note:** The `--jsonArray` flag is used because these files contain JSON arrays. If import fails, verify the file exists in `MongoDBCollections/` folder.
   
5. **Verify Import** (optional):
   ```bash
   mongosh
   use OPD
   show collections
   db.patients.countDocuments()
   db.doctors.countDocuments()
   ```

### Step 3: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd cap-stone-frontned
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the `cap-stone-frontned` directory with the following content:
   
   ```env
   # Backend Service URLs
   VITE_LOGIN_SERVICE_URL=http://localhost:2003
   VITE_USERS_SERVICE_URL=http://localhost:2002
   VITE_DOCTOR_SERVICE_URL=http://localhost:2005
   VITE_PATIENT_SERVICE_URL=http://localhost:2008
   VITE_BILL_SERVICE_URL=http://localhost:2009
   VITE_APPOINTMENT_SERVICE_URL=http://localhost:2010
   VITE_MEDICAL_RECORD_SERVICE_URL=http://localhost:2006
   VITE_DOCTOR_RATING_SERVICE_URL=http://localhost:2007
   VITE_NURSE_CHECKUP_SERVICE_URL=http://localhost:2012
   VITE_OTP_SERVICE_URL=http://localhost:1009
   VITE_REGISTRATION_SERVICE_URL=http://localhost:2011
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: **http://localhost:5173/**

5. **Build for production:**
   ```bash
   npm run build
   ```

### Step 4: Backend Setup

#### Option 1: Start Individual Services (Recommended for Development)

Open separate terminal windows for each service:

**Terminal 1 - LoginService:**
```bash
cd capstone-backend/LoginService
mvn spring-boot:run
```

**Terminal 2 - UsersService:**
```bash
cd capstone-backend/users-microservice
mvn spring-boot:run
```

**Terminal 3 - DoctorService:**
```bash
cd capstone-backend/DoctorMicroService
mvn spring-boot:run
```

**Terminal 4 - PatientService:**
```bash
cd capstone-backend/PatientMicroService
mvn spring-boot:run
``` Description |
|---------|------|-------------|
| LoginService | 2003 | JWT authentication & authorization |
| UsersService | 2002 | User management |
| DoctorService | 2005 | Doctor profiles & availability |
| PatientService | 2008 | Patient management |
| AppointmentService | 2010 | Appointment scheduling |
| BillService | 2009 | Billing & payments |
| MedicalRecordService | 2006 | Medical records & prescriptions |
| DoctorRatingService | 2007 | Doctor ratings & reviews |
| NurseCheckupService | 2012 | Nurse checkup records |
| OTPService | 1009 | OTP generation & validation |
| RegistrationService | 2011 | New patient registrationlRecordService:**
```bash
cd capstone-backend/MedicalRecordMicroService-1
mvn spring-boot:run
```

**Terminal 8 - DoctorRatingService:**
```bash
cd capstone-backend/DoctorRatingMicroService
mvn spring-boot:run
```

**Terminal 9 - NurseCheckupService:**
```bash
cd capstone-backend/NurseCheckUpsMicroService
mvn spring-boot:run
```

**Terminal 10 - OTPService:**
```bash
cd capstone-backend/OTPMicroService1
mvn spring-boot:run
```

**Terminal 11 - RegistrationService:**
```bash
cd capstone-backend/RegistrationService
mvn spring-boot:run
```

#### Option 2: Using Maven Wrapper (if mvn not in PATH)

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Step 5: Verify Services

Once all services are running, verify they're accessible:

- LoginService: http://localhost:2003
- UsersService: http://localhost:2002
- DoctorService: http://localhost:2005
- PatientService: http://localhost:2008
- AppointmentService: http://localhost:2010
- BillService: http://localhost:2009
- MedicalRecordService: http://localhost:2006
- DoctorRatingService: http://localhost:2007
- NurseCheckupService: http://localhost:2012
- OTPService: http://localhost:1009
- RegistrationService: http://localhost:2011

### Step 6: Access the Application

Open your browser and navigate to: **http://localhost:5173/**

**Default Login Credentials:**
- Check MongoDB collections for existing users
- Or register a new user through the registration page
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
```capstone-backend/LoginService
mvn test
```

### Frontend Tests
```bash
cd cap-stone-frontned
npm test
```

### Build Frontend for Production
```bash
cd cap-stone-frontned
npm run build
# Output will be in 5/swagger-ui/index.html  (DoctorService)
http://localhost:2008/swagger-ui/index.html  (PatientService)
http://localhost:2010/swagger-ui/index.html  (AppointmentService)
http://localhost:2009/swagger-ui/index.html  (BillService)
http://localhost:2006/swagger-ui/index.html  (MedicalRecordService)
# ... etc for each service
```

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Make sure MongoDB is running
mongosh --eval "db.version()"
```

**2. Port Already in Use**
```bash
# Windows - Find and kill process
netstat -ano | findstr :2003
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :2003
kill -9 <process_id>
```

  - React 19 frontend with Material-UI
  - Spring Boot 3.5.4 microservices
  - JWT authentication with BCrypt
  - MongoDB integration
  - Environment-based configuration
  - Complete OPD management functionality
  - Role-based access control
  - Responsive UI design

## ⚠️ Important Notes

1. **MongoDB:** Must be running before starting backend services
2. **Service Order:** Start backend services before accessing frontend
3. **Environment Variables:** Frontend requires `.env` file with all VITE_* variables
4. **Ports:** Ensure all ports (2002-2012, 1009, 5173) are available
5. **Build:** Run `npm run build` before deploying to production
6. **CORS:** Update CORS settings in backend for production domains

## 🔐 Security Notes

- All passwords are hashed with BCrypt
- JWT tokens for authentication
- XSS protectionemail notifications
- [ ] Add SMS notifications with Twilio
- [ ] Implement password reset via email
- [ ] Add comprehensive logging
- [ ] Set up CI/CD pipeline
- [ ] Add API rate limiting
- [ ] Implement WebSocket for real-time updates
- [ ] Mobile application support
- [ ] Docker containerization
- [ ] Kubernetes deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the [GitHub repository](https://github.com/9703790514/Hospital_OPD_Management_System)
- Check existing documentation in `/Class Diagrams` and `/DatabaseDiagrams`

## 👥 Authors

- **Project:** Hospital OPD Management System
- **Organization:** Sarvotham's Spine Care
- **Repository:** https://github.com/9703790514/Hospital_OPD_Management_Systemorrect backend URLs
- Verify backend CORS configuration allows http://localhost:5173

**6. Environment Variables Not Loading**
```bash
# Frontend - Make sure .env file exists in cap-stone-frontned/
# Restart Vite dev server after changing .env

# Backend - Check application.properties or application.yml

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
