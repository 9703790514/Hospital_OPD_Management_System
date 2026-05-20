package training.iqgateway.serviceimpl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.User;
import training.iqgateway.repository.UserRepository;
import training.iqgateway.service.UserService;

import java.util.Base64;
import java.util.Optional;
import java.io.IOException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(String _id) {
        return userRepository.findById(_id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(String _id, User userData) {
        return userRepository.findById(_id)
            .map(user -> {
                user.setCustomId(userData.getCustomId());
                user.setUsername(userData.getUsername());
                user.setPassword_hash(userData.getPassword_hash());
                user.setEmail(userData.getEmail());
                user.setPhone_number(userData.getPhone_number());
                user.setRole_id(userData.getRole_id());
                user.setImage(userData.getImage());
                user.setLast_login(userData.getLast_login());
                user.setCreated_at(userData.getCreated_at());
                user.setUpdated_at(userData.getUpdated_at());
                return userRepository.save(user);
            })
            .orElse(null);
    }
    
    @Override
    public User patchUser(String _id, Map<String, Object> updates) {
        return userRepository.findById(_id)
            .map(user -> {
                updates.forEach((key, value) -> {
                    switch (key) {
                        case "username":
                            user.setUsername((String) value);
                            break;
                        case "email":
                            user.setEmail((String) value);
                            break;
                        case "phone_number":
                            user.setPhone_number((String) value);
                            break;
                        case "role_id":
                           
                            break;
                        case "image":
                            // You would need to handle the conversion from Base64 string to byte array here
                            // This case needs to be modified if you're using this method
                            if (value instanceof String) {
                                user.setImage(Base64.getDecoder().decode((String) value));
                            }
                            break;
                        // Add more fields here as needed
                    }
                });
                return userRepository.save(user);
            })
            .orElse(null);
    }

    // New method to update the user's profile picture.
    // This now accepts a byte[] array.
    @Override
    public User updateProfilePic(String userId, byte[] imageData) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setImage(imageData);
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    // New method to update the user's password
    @Override
    public User updatePassword(String userId, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPassword_hash(newPassword);
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    @Override
    public void deleteUser(String _id) {
        userRepository.deleteById(_id);
    }

	@Override
	public Optional<User> findByCustomId(String id) {
	    return userRepository.findByCustomId(id);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}
}
