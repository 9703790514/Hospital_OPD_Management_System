package training.iqgateway.serviceimpl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.Doctor;
import training.iqgateway.entities.DoctorAvailability;
import training.iqgateway.entities.DoctorAvailability.DailySlot;
import training.iqgateway.repository.DoctorAvailabilityRepository;
import training.iqgateway.repository.DoctorRepository;
import training.iqgateway.service.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, DoctorAvailabilityRepository doctorAvailabilityRepository) {
        this.doctorRepository = doctorRepository;
        this.doctorAvailabilityRepository = doctorAvailabilityRepository;
    }

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        Instant now = Instant.now();
        doctor.setCreatedAt(now);
        doctor.setUpdatedAt(now);
        // If customId is not set, you might want to generate one here
        // or ensure it's provided by the client.
        // if (doctor.getCustomId() == null || doctor.getCustomId().isEmpty()) {
        //     doctor.setCustomId(UUID.randomUUID().toString()); // Example: generate a UUID
        // }
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> getDoctorById(String id) {
        return doctorRepository.findById(id); // Finds by MongoDB's _id
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor updateDoctor(String id, Doctor doctor) {
        Optional<Doctor> existingOpt = doctorRepository.findById(id);
        if (existingOpt.isPresent()) {
            Doctor existing = existingOpt.get();
            existing.setFirstName(doctor.getFirstName());
            existing.setLastName(doctor.getLastName());
            existing.setSpecialization(doctor.getSpecialization());
            existing.setContactNumber(doctor.getContactNumber());
            existing.setEmail(doctor.getEmail());
            existing.setLicenseNumber(doctor.getLicenseNumber());
            existing.setConsultationFee(doctor.getConsultationFee());
            existing.setUpdatedAt(Instant.now());
            // Ensure customId is not accidentally overwritten if you want it to be immutable
            // existing.setCustomId(doctor.getCustomId()); // Only if you allow updating customId
            return doctorRepository.save(existing);
        }
        throw new RuntimeException("Doctor not found with id: " + id);
    }

    @Override
    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public Optional<DoctorAvailability> getDoctorAvailability(String doctorId) {
        return doctorAvailabilityRepository.findByDoctorId(doctorId);
    }

    @Override
    public Optional<DoctorAvailability> getDoctorAvailabilityForDay(String doctorId, String day) {
        Optional<DoctorAvailability> doctorAvailabilityOpt = doctorAvailabilityRepository.findByDoctorId(doctorId);

        if (doctorAvailabilityOpt.isPresent()) {
            DoctorAvailability doctorAvailability = doctorAvailabilityOpt.get();
            Optional<DailySlot> dailySlotForDay = doctorAvailability.getDailySlots().stream()
                    .filter(slot -> slot.getDay().equalsIgnoreCase(day))
                    .findFirst();

            if (dailySlotForDay.isPresent()) {
                DoctorAvailability filteredAvailability = new DoctorAvailability();
                filteredAvailability.setId(doctorAvailability.getId());
                filteredAvailability.setDoctorId(doctorAvailability.getDoctorId());
                filteredAvailability.setDailySlots(List.of(dailySlotForDay.get()));
                filteredAvailability.setLeaveDates(doctorAvailability.getLeaveDates());
                filteredAvailability.setCreatedAt(doctorAvailability.getCreatedAt());
                filteredAvailability.setUpdatedAt(doctorAvailability.getUpdatedAt());
                return Optional.of(filteredAvailability);
            }
        }
        return Optional.empty();
    }

    @Override
    public boolean isDoctorAvailableOnDate(String doctorId, Instant date) {
        Optional<DoctorAvailability> doctorAvailabilityOpt = doctorAvailabilityRepository.findByDoctorId(doctorId);

        if (doctorAvailabilityOpt.isPresent()) {
            DoctorAvailability doctorAvailability = doctorAvailabilityOpt.get();
            return !doctorAvailability.getLeaveDates().contains(date);
        }
        return false;
    }

    @Override
    public DoctorAvailability saveOrUpdateDoctorAvailability(DoctorAvailability doctorAvailability) {
        Instant now = Instant.now();
        Optional<DoctorAvailability> existingAvailabilityOpt = doctorAvailabilityRepository.findByDoctorId(doctorAvailability.getDoctorId());

        if (existingAvailabilityOpt.isPresent()) {
            DoctorAvailability existing = existingAvailabilityOpt.get();
            existing.setDailySlots(doctorAvailability.getDailySlots());
            existing.setLeaveDates(doctorAvailability.getLeaveDates());
            existing.setUpdatedAt(now);
            return doctorAvailabilityRepository.save(existing);
        } else {
            doctorAvailability.setCreatedAt(now);
            doctorAvailability.setUpdatedAt(now);
            return doctorAvailabilityRepository.save(doctorAvailability);
        }
    }

    @Override
    public void deleteDoctorAvailability(String doctorId) {
        Optional<DoctorAvailability> doctorAvailabilityOpt = doctorAvailabilityRepository.findByDoctorId(doctorId);
        doctorAvailabilityOpt.ifPresent(doctorAvailabilityRepository::delete);
    }

    @Override
    public Optional<Doctor> getDoctorByCustomId(String customId) {
       // Now uses the new findByCustomId method in the repository
       return doctorRepository.findByCustomId(customId);
    }
}