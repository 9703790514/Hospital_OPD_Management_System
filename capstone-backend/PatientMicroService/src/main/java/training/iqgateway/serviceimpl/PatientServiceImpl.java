package training.iqgateway.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import training.iqgateway.entities.Patient;
import training.iqgateway.repository.PatientRepository;
import training.iqgateway.service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repository;

    public PatientServiceImpl(PatientRepository repository) {
        this.repository = repository;
    }

    @Override
    public Patient save(Patient patient) {
        return repository.save(patient);
    }

    @Override
    public List<Patient> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Patient> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<Patient> findByUserId(String userId) {
        return repository.findByUserId(userId);
    }
}
