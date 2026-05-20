package training.iqgateway.serviceimpl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.Role;
import training.iqgateway.repository.RoleRepository;
import training.iqgateway.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> getRoleById(String id) {
        return roleRepository.findById(id);
    }

    @Override
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role updateRole(String id, Role role) {
        return roleRepository.findById(id)
                .map(existingRole -> {
                    existingRole.setName(role.getName());
                    existingRole.setDescription(role.getDescription());
                    return roleRepository.save(existingRole);
                }).orElse(null);
    }

    @Override
    public void deleteRole(String id) {
        roleRepository.deleteById(id);
    }
}
