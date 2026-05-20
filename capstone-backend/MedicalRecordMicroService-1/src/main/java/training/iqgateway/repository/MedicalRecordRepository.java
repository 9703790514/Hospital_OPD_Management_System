package training.iqgateway.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.MedicalRecord;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    // Additional query methods if needed

	List<MedicalRecord> findByPatientId(String patientId);


}
