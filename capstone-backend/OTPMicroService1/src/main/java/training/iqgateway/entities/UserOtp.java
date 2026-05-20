package training.iqgateway.entities;



import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

import java.time.Instant;

@Data
@Document(collection = "otps")
public class UserOtp {

    @Id
    private ObjectId id;

    private String userId;  // Id of user in main system, as String

    private String phone;   // Phone number to which OTP sent

    private String otp;     // 4-digit OTP

    
    
    
    
    
    
    public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(Instant expiresAt) {
		this.expiresAt = expiresAt;
	}

	@CreatedDate
    private Instant createdAt = Instant.now();

    @Indexed(name = "expire_at_idx", expireAfterSeconds = 300)  // 5 minutes
    private Instant expiresAt;

    public UserOtp(String userId, String phone, String otp, Instant expiresAt) {
        this.userId = userId;
        this.phone = phone;
        this.otp = otp;
        this.expiresAt = expiresAt;
    }
    
    @JsonProperty("id")
	public String get_id_asString() {
		return id != null ? id.toHexString() : null;
	}
}
