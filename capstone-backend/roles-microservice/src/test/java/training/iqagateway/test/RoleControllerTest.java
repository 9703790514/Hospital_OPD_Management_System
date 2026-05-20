package training.iqagateway.test;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.contoller.RoleController;
import training.iqgateway.entities.Role;
import training.iqgateway.service.RoleService;

class RoleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private RoleController roleController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(roleController).build();
        objectMapper = new ObjectMapper();
    }

    private Role createRole() {
        Role role = new Role();
        role.setId("abc123");
        role.setName("ROLE_ADMIN");
        role.setDescription("Administrator role");
        return role;
    }

    @Test
    void testCreateRole() throws Exception {
        Role role = createRole();
        when(roleService.createRole(any(Role.class))).thenReturn(role);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(role)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.description").value("Administrator role"));

        verify(roleService, times(1)).createRole(any(Role.class));
    }

    @Test
    void testGetRoleById_Found() throws Exception {
        Role role = createRole();
        when(roleService.getRoleById("abc123")).thenReturn(Optional.of(role));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/roles/abc123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ROLE_ADMIN"));

        verify(roleService, times(1)).getRoleById("abc123");
    }

    @Test
    void testGetRoleById_NotFound() throws Exception {
        when(roleService.getRoleById("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/roles/notfound"))
                .andExpect(status().isNotFound());

        verify(roleService, times(1)).getRoleById("notfound");
    }

    @Test
    void testGetRoleByName_Found() throws Exception {
        Role role = createRole();
        when(roleService.getRoleByName("ROLE_ADMIN")).thenReturn(Optional.of(role));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/roles/name/ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ROLE_ADMIN"));

        verify(roleService, times(1)).getRoleByName("ROLE_ADMIN");
    }

    @Test
    void testGetRoleByName_NotFound() throws Exception {
        when(roleService.getRoleByName("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/roles/name/notfound"))
                .andExpect(status().isNotFound());

        verify(roleService, times(1)).getRoleByName("notfound");
    }

    @Test
    void testGetAllRoles() throws Exception {
        Role r1 = createRole();
        Role r2 = new Role("ROLE_USER", "Regular user");
        r2.setId("def456");
        when(roleService.getAllRoles()).thenReturn(List.of(r1, r2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$[1].name").value("ROLE_USER"));

        verify(roleService, times(1)).getAllRoles();
    }

    @Test
    void testUpdateRole_Found() throws Exception {
        Role updated = createRole();
        updated.setName("ROLE_SUPERADMIN");
        when(roleService.updateRole(eq("abc123"), any(Role.class))).thenReturn(updated);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/roles/abc123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ROLE_SUPERADMIN"));

        verify(roleService, times(1)).updateRole(eq("abc123"), any(Role.class));
    }

    @Test
    void testUpdateRole_NotFound() throws Exception {
        when(roleService.updateRole(eq("notfound"), any(Role.class))).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/roles/notfound")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRole())))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteRole() throws Exception {
        doNothing().when(roleService).deleteRole("abc123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/roles/abc123"))
                .andExpect(status().isNoContent());

        verify(roleService, times(1)).deleteRole("abc123");
    }
}
