package training.iqgateway.serviceimpl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Import Collectors for stream operations

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.DoctorAvailability;
import training.iqgateway.entities.DoctorAvailability.DailySlot; // Import DailySlot
import training.iqgateway.repository.DoctorAvailabilityRepository;
import training.iqgateway.service.DoctorAvailabilityService;

@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Override
    public Optional<DoctorAvailability> getAvailabilityById(String id) {
        return doctorAvailabilityRepository.findById(id);
    }

    @Override
    public Optional<DoctorAvailability> getAvailabilityByDoctorId(String doctorId) {
        return doctorAvailabilityRepository.findByDoctorId(doctorId);
    }

    @Override
    public DoctorAvailability createAvailability(DoctorAvailability doctorAvailability) {
        // createdAt and updatedAt will be automatically set by @EnableMongoAuditing
        return doctorAvailabilityRepository.save(doctorAvailability);
    }

    @Override
    public DoctorAvailability updateAvailability(String id, DoctorAvailability doctorAvailabilityDetails) {
        return doctorAvailabilityRepository.findById(id)
                .map(existingAvailability -> {
                    // Update fields from doctorAvailabilityDetails
                    existingAvailability.setDailySlots(doctorAvailabilityDetails.getDailySlots());
                    existingAvailability.setLeaveDates(doctorAvailabilityDetails.getLeaveDates());
                    // updatedAt will be automatically updated by @EnableMongoAuditing
                    return doctorAvailabilityRepository.save(existingAvailability);
                })
                .orElseThrow(() -> new RuntimeException("DoctorAvailability not found with id " + id));
                // In a real app, you'd use a custom NotFoundException
    }

    @Override
    public void deleteAvailability(String id) {
        doctorAvailabilityRepository.deleteById(id);
    }

    @Override
    public DoctorAvailability upsertAvailabilityByDoctorId(String doctorId, DoctorAvailability doctorAvailabilityDetails) {
        return doctorAvailabilityRepository.findByDoctorId(doctorId)
                .map(existingAvailability -> {
                    // If found, update the existing record
                    existingAvailability.setDailySlots(doctorAvailabilityDetails.getDailySlots());
                    existingAvailability.setLeaveDates(doctorAvailabilityDetails.getLeaveDates());
                    existingAvailability.setUpdatedAt(Instant.now()); // Manual update for clarity, though @LastModifiedDate handles it
                    return doctorAvailabilityRepository.save(existingAvailability);
                })
                .orElseGet(() -> {
                    // If not found, create a new record
                    doctorAvailabilityDetails.setDoctorId(doctorId); // Ensure doctorId is set for new creation
                    // createdAt and updatedAt will be automatically set
                    return doctorAvailabilityRepository.save(doctorAvailabilityDetails);
                });
    }

    @Override
    public Optional<DoctorAvailability> getAvailabilityByDoctorIdAndDay(String doctorId, String day) {
        // First, retrieve the full DoctorAvailability document for the given doctorId
        Optional<DoctorAvailability> doctorAvailabilityOpt = doctorAvailabilityRepository.findByDoctorId(doctorId);

        if (doctorAvailabilityOpt.isPresent()) {
            DoctorAvailability doctorAvailability = doctorAvailabilityOpt.get();
            // Filter the dailySlots list to find the one matching the requested day (case-insensitive)
            Optional<DailySlot> dailySlotForDay = doctorAvailability.getDailySlots().stream()
                    .filter(slot -> slot.getDay().equalsIgnoreCase(day))
                    .findFirst();

            if (dailySlotForDay.isPresent()) {
                // If a matching daily slot is found, create a new DoctorAvailability object
                // containing only that specific daily slot and the doctor's ID.
                // This is done to match the return type of Optional<DoctorAvailability>.
                DoctorAvailability filteredAvailability = new DoctorAvailability();
                filteredAvailability.setId(doctorAvailability.getId()); // Keep the original document ID
                filteredAvailability.setDoctorId(doctorAvailability.getDoctorId());
                filteredAvailability.setDailySlots(List.of(dailySlotForDay.get())); // Set only the found daily slot
                filteredAvailability.setLeaveDates(doctorAvailability.getLeaveDates()); // Include leave dates
                filteredAvailability.setCreatedAt(doctorAvailability.getCreatedAt());
                filteredAvailability.setUpdatedAt(doctorAvailability.getUpdatedAt());
                return Optional.of(filteredAvailability);
            }
        }
        // If the doctor's availability record is not found, or the specific day's slot is not found,
        // return an empty Optional.
        return Optional.empty();
    }
}
