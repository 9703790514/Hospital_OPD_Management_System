package training.iqgateway.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.repository.DiagnosticTestRepository;
import training.iqgateway.service.DiagnosticTestService;

@Service
public class DiagnosticTestServiceImpl implements DiagnosticTestService {

    private final DiagnosticTestRepository repository;

    // Spring will automatically inject DiagnosticTestRepository here
    public DiagnosticTestServiceImpl(DiagnosticTestRepository repository) {
        this.repository = repository;
    }

    @Override
    public DiagnosticTest save(DiagnosticTest test) {
        return repository.save(test);
    }

    @Override
    public List<DiagnosticTest> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<DiagnosticTest> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override // Ensure this is overridden from the interface
    public List<DiagnosticTest> getTestsForRecord(String recordId) {
        return repository.findByMedicalRecordId(recordId);
    }
}