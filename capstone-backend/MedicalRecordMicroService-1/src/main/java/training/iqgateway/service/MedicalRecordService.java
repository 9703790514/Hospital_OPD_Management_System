package training.iqgateway.service;


import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.MedicalRecord;

public interface MedicalRecordService {
    MedicalRecord save(MedicalRecord record);
    List<MedicalRecord> findAll();
    Optional<MedicalRecord> findById(String id);
    void deleteById(String id);
    public List<MedicalRecord> getRecordsByPatientId(String patientId);
}
