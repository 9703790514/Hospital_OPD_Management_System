package training.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entities.DoctorRating;

public interface DoctorRatingRepository extends MongoRepository<DoctorRating, String> {

    List<DoctorRating> findByDoctorId(String doctorId);

    List<DoctorRating> findByPatientId(String patientId);

}
