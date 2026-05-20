package training.iqgateway.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.Appointment;

public interface AppointmentService {

    Appointment createAppointment(Appointment appointment);

    Optional<Appointment> getAppointmentById(String id);

    List<Appointment> getAppointmentsByPatientId(String patientId);

    List<Appointment> getAppointmentsByDoctorId(String  doctorId);

    // --- NEW: Method to get appointments by doctor ID and date ---
    List<Appointment> getAppointmentsByDoctorAndDate(String doctorId, LocalDate date);

    Appointment updateAppointment(Appointment appointment);

    // --- Existing: Method to update appointment status ---
    Appointment updateAppointmentStatus(String appointmentId, String newStatus);

    void deleteAppointmentById(String id);

	List<Appointment> getAllAppointments();

    public void cancelAppointmentsByDoctorAndDate(String doctorId, LocalDate leaveDate); 
}