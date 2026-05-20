package training.iqgateway.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.NurseCheckup;

@Repository
public interface NurseCheckupRepository extends MongoRepository<NurseCheckup, String> {

    // You can add custom query methods here if needed
    NurseCheckup findByAppointmentId(String appointmentId);

}
