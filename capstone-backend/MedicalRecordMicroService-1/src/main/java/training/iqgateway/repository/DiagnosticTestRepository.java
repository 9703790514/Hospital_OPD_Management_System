package training.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.DiagnosticTest;

@Repository
public interface DiagnosticTestRepository extends MongoRepository<DiagnosticTest, String> {
    // This method is correctly defined to find by a String medicalRecordId
    List<DiagnosticTest> findByMedicalRecordId(String medicalRecordId);
}