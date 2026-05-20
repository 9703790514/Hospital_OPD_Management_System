package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Arrays;
import java.util.Objects;

@Document(collection = "users")
public class User {

    @Id
    private String id;  // MongoDB ObjectId string

    @Field("id")
    private Integer customUserId; // Custom numeric user ID

    private String username;

    @Field("password_hash")
    private String password;

    private String email;

    @Field("phone_number")
    private String phoneNumber;

    @Field("role_id")
    private Integer roleId;

    // Modified to store image data as a byte array
    private byte[] image;

    @Field("last_login")
    private Instant lastLogin;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;

    public User() {}

    // Modified constructor to accept byte[]
    public User(Integer customUserId, String username, String password, String email, String phoneNumber, Integer roleId, byte[] image) {
        this.customUserId = customUserId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roleId = roleId;
        this.image = image;
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // Getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getCustomUserId() { return customUserId; }
    public void setCustomUserId(Integer customUserId) { this.customUserId = customUserId; }

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

    // Modified getter for byte[]
    public byte[] getImage() { return image; }
    // Modified setter for byte[]
    public void setImage(byte[] image) { this.image = image; }

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
                ", customUserId=" + customUserId +
                ", username='" + username + '\'' +
                ", password='[PROTECTED]'" +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", roleId=" + roleId +
                ", image='" + (image != null ? "byte array of length " + image.length : "null") + '\'' +
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
        return Objects.equals(id, user.id) &&
               Objects.equals(customUserId, user.customUserId) &&
               Objects.equals(username, user.username) &&
               Objects.equals(password, user.password) &&
               Objects.equals(email, user.email) &&
               Objects.equals(phoneNumber, user.phoneNumber) &&
               Objects.equals(roleId, user.roleId) &&
               // Use Arrays.equals for correct comparison of byte arrays
               Arrays.equals(image, user.image) &&
               Objects.equals(lastLogin, user.lastLogin) &&
               Objects.equals(createdAt, user.createdAt) &&
               Objects.equals(updatedAt, user.updatedAt);
    }

    @Override
    public int hashCode() {
        // Use Arrays.hashCode for the image field
        int result = Objects.hash(id, customUserId, username, password, email, phoneNumber, roleId, lastLogin, createdAt, updatedAt);
        result = 31 * result + Arrays.hashCode(image);
        return result;
    }
}
