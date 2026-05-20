package training.iqgateway.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import training.iqgateway.dto.PatientRegistrationRequest;
import training.iqgateway.entities.Patient;
import training.iqgateway.entities.User;
import training.iqgateway.repository.PatientRepository;
import training.iqgateway.repository.UserRepository;
import training.iqgateway.service.PatientRegistrationService;

@Service
public class PatientRegistrationServiceImpl implements PatientRegistrationService {

    // Define the role ID for a patient
    private static final Integer PATIENT_ROLE_ID = 1;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void registerPatient(PatientRegistrationRequest request) {

        // 1. Create a new User entity without manually setting the customUserId.
        // The database will automatically generate the ID upon saving.
        User user = new User();
        user.setUsername(request.getUsername());
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRoleId(PATIENT_ROLE_ID);
        // This line is now updated to correctly handle the image as a byte array,
        // assuming the PatientRegistrationRequest DTO has been updated to match.
        user.setImage(request.getImage());

        // 2. Save the User entity. The returned 'savedUser' object will
        // now contain the database-generated customUserId.
        User savedUser = userRepository.save(user);

        // 3. Convert the Integer customUserId from the saved user to a String,
        // which is required for the Patient entity.
        String userIdAsString = String.valueOf(savedUser.getId());

        // 4. Create the corresponding Patient entity, using the newly generated
        // and converted user ID.
        Patient patient = new Patient();
        patient.setUserId(userIdAsString); // Use the converted String ID
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setContactNumber(request.getContactNumber());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setCurrentMedications(request.getCurrentMedications());

        // 5. Save the Patient entity.
        patientRepository.save(patient);
    }
}
