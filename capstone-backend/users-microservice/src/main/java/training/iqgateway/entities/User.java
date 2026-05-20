package training.iqgateway.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class User {

    @Id
    private String _id; // MongoDB ObjectId
    
    @Field("id")
    private String customId;

    private String username;
    private String password_hash;
    private String email;
    private String phone_number;
    private Integer role_id;
    private byte[] image; // Changed from String to byte[]
    private LocalDateTime last_login;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public User() {}

    // Getters and setters

    public String get_id() { return _id; }
    public void set_id(String _id) { this._id = _id; }

    public String getCustomId() {
        return customId;
    }

    public void setCustomId(String customId) {
        this.customId = customId;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword_hash() { return password_hash; }
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone_number() { return phone_number; }
    public void setPhone_number(String phone_number) { this.phone_number = phone_number; }

    public Integer getRole_id() { return role_id; }
    public void setRole_id(Integer role_id) { this.role_id = role_id; }

    // Updated getter and setter for the image field
    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public LocalDateTime getLast_login() { return last_login; }
    public void setLast_login(LocalDateTime last_login) { this.last_login = last_login; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }

    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }
}