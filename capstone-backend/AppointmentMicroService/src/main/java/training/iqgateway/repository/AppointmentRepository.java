package training.iqgateway.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.Appointment;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    // Find all appointments by patient ID
    List<Appointment> findByPatientId(String patientId);

    // Find all appointments by doctor ID
    List<Appointment> findByDoctorId(String doctorId);

    // --- NEW: Find appointments by doctor ID and appointment date ---
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);

    // Optional: Find appointments by status, etc. - add as needed
    // List<Appointment> findByStatus(String status);
}