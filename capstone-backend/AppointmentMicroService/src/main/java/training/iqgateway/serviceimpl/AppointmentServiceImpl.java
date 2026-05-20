package training.iqgateway.serviceimpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.Appointment;
import training.iqgateway.repository.AppointmentRepository;
import training.iqgateway.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorAndDate(String doctorId, LocalDate date) {
        // Now passing a LocalDate object directly to the repository
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
    }


    @Override
    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment updateAppointmentStatus(String appointmentId, String newStatus) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isPresent()) {
            Appointment existingAppointment = optionalAppointment.get();
            existingAppointment.setStatus(newStatus);
            // Optionally, update 'updatedAt' timestamp here
            return appointmentRepository.save(existingAppointment);
        }
        return null; // Appointment not found
    }

    
    
    @Override
    public void deleteAppointmentById(String id) {
        appointmentRepository.deleteById(id);
    }

	@Override
	public List<Appointment> getAllAppointments() {
		return appointmentRepository.findAll();
	}
	
	   @Override
	    public void cancelAppointmentsByDoctorAndDate(String doctorId, LocalDate leaveDate) {
	        // 1. Find all appointments for the specified doctor and date.
	        List<Appointment> appointmentsToCancel = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, leaveDate);

	        // 2. Iterate through the found appointments and update their status.
	        for (Appointment appointment : appointmentsToCancel) {
	            // Only update appointments that are not already cancelled or completed.
	            if (!"Cancelled".equalsIgnoreCase(appointment.getStatus()) && !"Completed".equalsIgnoreCase(appointment.getStatus())) {
	                appointment.setStatus("Cancelled");
	                // 3. Save the updated appointment back to the database.
	                appointmentRepository.save(appointment);
	            }
	        }
	    }
	    

	
}