package training.iqgateway.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.Doctor;
import java.util.Optional; // Import Optional

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    // This method will find a Doctor document where the 'customId' field matches the given String.
    Optional<Doctor> findByCustomId(String customId);
}