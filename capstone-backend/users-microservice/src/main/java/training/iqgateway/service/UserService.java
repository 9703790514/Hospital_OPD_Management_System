package training.iqgateway.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import training.iqgateway.entities.User;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(String _id);
    Optional<User> getUserByUsername(String username);
    List<User> getAllUsers();
    User updateUser(String _id, User user);
    User patchUser(String _id, Map<String, Object> updates);
    void deleteUser(String _id);
    Optional<User> findByCustomId(String id);
    Optional<User> findByEmail(String email);

    // New method to update the user's profile picture
    public User updateProfilePic(String userId, byte[] imageData);
    
    // New method to update the user's password
    public User updatePassword(String userId, String newPassword);
}
