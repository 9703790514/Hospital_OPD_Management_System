package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Objects;
import java.util.Arrays; // Import for array utilities

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;

    @Field("password_hash")
    private String password; // Plain text (not secure, per your existing setup)

    private String email;

    @Field("phone_number")
    private String phoneNumber;

    @Field("role_id")
    private Integer roleId; // Now Integer, maps to the custom Role.id

    private byte[] image; // Changed from String to byte[] to match your database

    @Field("last_login")
    private Instant lastLogin;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;

    public User() {}

    public User(String id, String username, String password, String email, String phoneNumber,
                Integer roleId, byte[] image, Instant lastLogin, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roleId = roleId;
        this.image = image;
        this.lastLogin = lastLogin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }

    public byte[] getImage() { return image; } // Corrected getter to return a byte array
    public void setImage(byte[] image) { this.image = image; } // Corrected setter to accept a byte array

    public Instant getLastLogin() { return lastLogin; }
    public void setLastLogin(Instant lastLogin) { this.lastLogin = lastLogin; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", password='[PROTECTED]'" +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", roleId=" + roleId +
                ", image='" + Arrays.toString(image) + '\'' + // Use Arrays.toString() for correct printing
                ", lastLogin=" + lastLogin +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id)
                && Objects.equals(username, user.username)
                && Objects.equals(password, user.password)
                && Objects.equals(email, user.email)
                && Objects.equals(phoneNumber, user.phoneNumber)
                && Objects.equals(roleId, user.roleId)
                && Arrays.equals(image, user.image) // Use Arrays.equals() for correct comparison
                && Objects.equals(lastLogin, user.lastLogin)
                && Objects.equals(createdAt, user.createdAt)
                && Objects.equals(updatedAt, user.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, email, phoneNumber, roleId, Arrays.hashCode(image), lastLogin, createdAt, updatedAt);
    }
}
