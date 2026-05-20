package training.iqgateway.service;

import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.Patient;

public interface PatientService {
    
    Patient save(Patient patient);
    List<Patient> findAll();
    Optional<Patient> findById(String id);
    void deleteById(String id);
    List<Patient> findByUserId(String userId);
}
