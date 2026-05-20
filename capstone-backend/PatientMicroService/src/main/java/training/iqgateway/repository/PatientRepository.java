package training.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.Patient;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    
    // Custom finder if needed, for example find by user_id
    List<Patient> findByUserId(String userId);

    // Optional: find patient by numeric id
    Patient findById(Integer id);
}
