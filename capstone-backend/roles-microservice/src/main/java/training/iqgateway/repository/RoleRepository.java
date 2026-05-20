package training.iqgateway.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entities.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(String name);
}
