package training.iqgateway.service;



import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.Role;

public interface RoleService {
    Role createRole(Role role);
    Optional<Role> getRoleById(String id);
    Optional<Role> getRoleByName(String name);
    List<Role> getAllRoles();
    Role updateRole(String id, Role role);
    void deleteRole(String id);
}
