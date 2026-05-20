package training.iqgateway.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entities.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByCustomId(String customId);
    Optional<User> findByEmail(String email);


}

