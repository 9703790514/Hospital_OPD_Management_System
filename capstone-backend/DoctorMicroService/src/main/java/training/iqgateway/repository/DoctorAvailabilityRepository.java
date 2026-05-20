package training.iqgateway.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.DoctorAvailability;

@Repository
public interface DoctorAvailabilityRepository extends MongoRepository<DoctorAvailability, String> {

    /**
     * Finds a DoctorAvailability document by the doctor's ID.
     *
     * @param doctorId The ID of the doctor.
     * @return An Optional containing the DoctorAvailability if found, or empty if not.
     */
    Optional<DoctorAvailability> findByDoctorId(String doctorId);

    /**
     * Finds all DoctorAvailability documents where the given date is NOT present in the doctor's leave dates.
     * This can be used to find doctors who are available on a specific date.
     *
     * @param date The Instant representing the date to check against leave dates.
     * @return A list of DoctorAvailability documents.
     */
    List<DoctorAvailability> findByLeaveDatesNotContaining(Instant date);

    /**
     * Finds a DoctorAvailability document for a specific doctor and a specific day of the week.
     * This query checks if the doctor's dailySlots list contains an entry for the specified day.
     * Note: This returns the entire DoctorAvailability document. Further filtering of specific
     * time slots within that day would typically be done in the application logic.
     *
     * @param doctorId The ID of the doctor.
     * @param day The day of the week (e.g., "MONDAY", "TUESDAY").
     * @return An Optional containing the DoctorAvailability if found, or empty if not.
     */
    @Query("{ 'doctorId' : ?0, 'dailySlots.day' : ?1 }")
    Optional<DoctorAvailability> findByDoctorIdAndDailySlots_Day(String doctorId, String day);

    /**
     * Finds all DoctorAvailability documents that include a specific day of the week in their daily slots.
     * This can be useful for finding all doctors who work on a particular day.
     *
     * @param day The day of the week (e.g., "MONDAY", "TUESDAY").
     * @return A list of DoctorAvailability documents.
     */
    List<DoctorAvailability> findByDailySlots_Day(String day);
}
