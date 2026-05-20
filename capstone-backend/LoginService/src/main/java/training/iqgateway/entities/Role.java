package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Objects;

@Document(collection = "roles")
public class Role {

    @Id
    private String id;  // MongoDB ObjectId string

    @Field("id")
    private Integer customRoleId;  // change to Integer

    private String name;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;

    public Role() {}

    public Role(String id, Integer customRoleId, String name, String description, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.customRoleId = customRoleId;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getCustomRoleId() { return customRoleId; }
    public void setCustomRoleId(Integer customRoleId) { this.customRoleId = customRoleId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Role{" +
                "id='" + id + '\'' +
                ", customRoleId=" + customRoleId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        Role role = (Role) o;
        return Objects.equals(id, role.id)
                && Objects.equals(customRoleId, role.customRoleId)
                && Objects.equals(name, role.name)
                && Objects.equals(description, role.description)
                && Objects.equals(createdAt, role.createdAt)
                && Objects.equals(updatedAt, role.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customRoleId, name, description, createdAt, updatedAt);
    }
}
