package training.iqgateway.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import training.iqgateway.entities.MedicalRecord;
import training.iqgateway.repository.MedicalRecordRepository;
import training.iqgateway.service.MedicalRecordService;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;

    public MedicalRecordServiceImpl(MedicalRecordRepository repository) {
        this.repository = repository;
    }

    @Override
    public MedicalRecord save(MedicalRecord record) {
        return repository.save(record);
    }

    @Override
    public List<MedicalRecord> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<MedicalRecord> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }
    
    @Override
    public List<MedicalRecord> getRecordsByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }
    
   


}
