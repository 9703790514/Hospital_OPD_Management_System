// UserController.java
package training.iqgateway.contoller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import training.iqgateway.entities.User;
import training.iqgateway.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
    
    // The PATCH mapping correctly handles generic updates, including the password.
    @PatchMapping("/{id}")
    public ResponseEntity<User> patchUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        User updated = userService.patchUser(id, updates);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // New endpoint to handle password updates specifically
    @PatchMapping("/updatePassword/{id}")
    public ResponseEntity<User> updatePassword(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        String newPassword = requestBody.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        User updatedUser = userService.updatePassword(id, newPassword);
        return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
    }
    
    // Method to update the user's profile picture by storing it as a Base64 string
    @PatchMapping("/{id}/profile-pic")
    public ResponseEntity<User> updateProfilePic(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            byte[] fileBytes = file.getBytes();
            User updatedUser = userService.updateProfilePic(id, fileBytes);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getUserImage(@PathVariable String id) {
        return (ResponseEntity<byte[]>) userService.getUserById(id)
                .map(user -> {
                    byte[] imageBytes = user.getImage();
                    if (imageBytes != null) {
                        return ResponseEntity.ok().body(imageBytes);
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/custom-id/{id}")
    public ResponseEntity<User> getUserByCustomId(@PathVariable String id) {
        return userService.findByCustomId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
