package training.iqgateway.serviceimpl;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.LoginRequest;
import training.iqgateway.entities.LoginResponse;
import training.iqgateway.entities.Role;
import training.iqgateway.entities.User;
import training.iqgateway.repository.RoleRepository;
import training.iqgateway.repository.UserRepository;
import training.iqgateway.service.AuthService;
import training.iqgateway.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

	 @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private RoleRepository roleRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;

	    @Autowired
	    private JwtUtil jwtUtil;

	    private static final Map<String, String> DASHBOARD_URLS = new HashMap<>();
	    static {
	        DASHBOARD_URLS.put("Patient", "/patient/dashboard");
	        DASHBOARD_URLS.put("Doctor", "/doctor/dashboard");
	        DASHBOARD_URLS.put("FrontDesk", "/frontdesk/dashboard");
	        DASHBOARD_URLS.put("BillingDesk", "/billing/dashboard");
	        DASHBOARD_URLS.put("LabTechnician", "/lab/dashboard");
	        DASHBOARD_URLS.put("Nurse", "/nurse/dashboard");
	        DASHBOARD_URLS.put("Admin", "/admin/dashboard");
	        DASHBOARD_URLS.put("Default", "/unauthorized");
	    }

	    @Override
	    public LoginResponse authenticateUser(LoginRequest loginRequest) {
	        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

	        if (userOptional.isEmpty()) {
	            throw new RuntimeException("Invalid credentials: User not found.");
	        }

	        User user = userOptional.get();

	        // Use BCrypt to verify password
	        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
	            throw new RuntimeException("Invalid credentials: Incorrect password.");
	        }

	        // Assuming roleId is Integer or Long; if Integer, remove trim check
	        if (user.getRoleId() == null) {
	            throw new RuntimeException("User's role ID is missing or invalid for user: " + user.getEmail());
	        }

	        Optional<Role> roleOptional = roleRepository.findByCustomRoleId(user.getRoleId());
	        if (roleOptional.isEmpty()) {
	            throw new RuntimeException("User role not found for role ID: " + user.getRoleId() + " associated with user: " + user.getEmail());
	        }

	        Role role = roleOptional.get();

	        String dashboardUrl = DASHBOARD_URLS.getOrDefault(role.getName(), DASHBOARD_URLS.get("Default"));

	        user.setLastLogin(Instant.now());
	        user.setUpdatedAt(Instant.now());
	        userRepository.save(user);

	        // Generate real JWT token
	        String authToken = jwtUtil.generateToken(user.getEmail(), user.getId().toString(), role.getName());

	        // Pass the profilePic field from user entity, which is a byte array
	        return new LoginResponse(
	                user.getId(),
	                user.getUsername(),
	                user.getEmail(),
	                role.getName(),
	                dashboardUrl,
	                authToken,
	                user.getImage() 
	        );
	    }
}
