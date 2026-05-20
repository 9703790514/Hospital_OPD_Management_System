package training.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.entities.Prescription;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

	List<Prescription> findByMedicalRecordId(String recordId);
}
