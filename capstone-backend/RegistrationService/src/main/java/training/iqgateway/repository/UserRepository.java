package training.iqgateway.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    // Find User with highest customUserId (the 'id' field)
    @Query(sort = "{'id': -1}") // Sort descending by 'id' field, take top one
    Optional<User> findTopByOrderByCustomUserIdDesc();
}
