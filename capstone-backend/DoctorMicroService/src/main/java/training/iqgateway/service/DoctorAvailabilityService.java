package training.iqgateway.service;

import java.time.Instant;
import java.util.Optional;

import training.iqgateway.entities.DoctorAvailability;

public interface DoctorAvailabilityService {

    // Retrieve availability by its unique ID
    Optional<DoctorAvailability> getAvailabilityById(String id);

    // Retrieve availability by the doctor's ID
    Optional<DoctorAvailability> getAvailabilityByDoctorId(String doctorId);

    // Create a new availability record
    DoctorAvailability createAvailability(DoctorAvailability doctorAvailability);

    // Update an existing availability record by its unique ID
    DoctorAvailability updateAvailability(String id, DoctorAvailability doctorAvailabilityDetails);

    // Delete an availability record by its unique ID
    void deleteAvailability(String id);

    // Upsert (update or insert) an availability record based on doctorId
    // If an availability record for the doctorId exists, update it. Otherwise, create a new one.
    DoctorAvailability upsertAvailabilityByDoctorId(String doctorId, DoctorAvailability doctorAvailabilityDetails);

	Optional<DoctorAvailability> getAvailabilityByDoctorIdAndDay(String doctorId, String day);

}
