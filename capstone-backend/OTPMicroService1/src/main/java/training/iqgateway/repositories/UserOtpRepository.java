package training.iqgateway.repositories;



import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.UserOtp;

@Repository
public interface UserOtpRepository extends MongoRepository<UserOtp, ObjectId> {

    Optional<UserOtp> findByUserIdAndPhoneAndOtp(String userId, String phone, String otp);

    void deleteByUserIdAndPhone(String userId, String phone);
}
