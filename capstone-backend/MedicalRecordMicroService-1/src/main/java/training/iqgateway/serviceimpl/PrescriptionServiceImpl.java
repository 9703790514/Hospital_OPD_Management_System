package training.iqgateway.serviceimpl;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import training.iqgateway.entities.Prescription;
import training.iqgateway.repository.PrescriptionRepository;
import training.iqgateway.service.PrescriptionService;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository repository;

    public PrescriptionServiceImpl(PrescriptionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Prescription save(Prescription prescription) {
        return repository.save(prescription);
    }

    @Override
    public List<Prescription> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Prescription> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<Prescription> getTestsForRecord(String recordId) {
        // Return all prescriptions matching the given medical record ID
        return repository.findByMedicalRecordId(recordId);
    }
}
