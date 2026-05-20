package training.iqgateway.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import training.iqgateway.entities.Role;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    // Find by customRoleId (field mapped to "id" in Mongo)
    Optional<Role> findByCustomRoleId(Integer customRoleId);
}
