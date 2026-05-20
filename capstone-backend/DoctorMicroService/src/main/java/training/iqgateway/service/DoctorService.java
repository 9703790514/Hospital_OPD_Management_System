package training.iqgateway.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.Doctor;
import training.iqgateway.entities.DoctorAvailability;

public interface DoctorService {

    Doctor saveDoctor(Doctor doctor);
    Optional<Doctor> getDoctorById(String id); // Finds by MongoDB's _id
    List<Doctor> getAllDoctors();
    Doctor updateDoctor(String id, Doctor doctor);
    void deleteDoctor(String id);

    Optional<DoctorAvailability> getDoctorAvailability(String doctorId);
    Optional<DoctorAvailability> getDoctorAvailabilityForDay(String doctorId, String day);
    boolean isDoctorAvailableOnDate(String doctorId, Instant date);
    DoctorAvailability saveOrUpdateDoctorAvailability(DoctorAvailability doctorAvailability);
    void deleteDoctorAvailability(String doctorId);
    
    // This method now explicitly refers to the 'customId' field in the Doctor entity
    Optional<Doctor> getDoctorByCustomId(String customId);
}