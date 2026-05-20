package training.iqgateway.service;


import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.entities.Prescription;

public interface PrescriptionService {
    Prescription save(Prescription prescription);
    List<Prescription> findAll();
    Optional<Prescription> findById(String id);
    void deleteById(String id);
    public List<Prescription> getTestsForRecord(String medicalRecordId);

}
