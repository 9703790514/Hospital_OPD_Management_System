package training.iqgateway.entities;

import java.io.Serializable;
import java.util.Objects;
import java.util.Arrays;

// This class represents the response sent to the frontend after a successful login.
public class LoginResponse implements Serializable {

    // Unique user identifier
    private String userId;

    // User's name
    private String username;

    // User's email address
    private String email;

    // User's role (e.g., "Patient", "Doctor")
    private String role;

    // URL for the user's specific dashboard
    private String dashboardUrl;

    // The JWT authentication token
    private String token;
    
    // User's profile picture stored as a byte array
    private byte[] profilePic;

    public LoginResponse() {}

    // Constructor to match the call in AuthServiceImpl, now accepting a byte array for the profile picture
    public LoginResponse(String userId, String username, String email, String role, String dashboardUrl, String token, byte[] profilePic) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.dashboardUrl = dashboardUrl;
        this.token = token;
        this.profilePic = profilePic;
    }

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDashboardUrl() { return dashboardUrl; }
    public void setDashboardUrl(String dashboardUrl) { this.dashboardUrl = dashboardUrl; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    // Corrected getter/setter for byte array profile picture
    public byte[] getProfilePic() { return profilePic; }
    public void setProfilePic(byte[] profilePic) { this.profilePic = profilePic; }

    @Override
    public String toString() {
        return "LoginResponse{" +
               "userId='" + userId + '\'' +
               ", username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", role='" + role + '\'' +
               ", dashboardUrl='" + dashboardUrl + '\'' +
               ", token='[PROTECTED]'" +
               ", profilePic='" + Arrays.toString(profilePic) + '\'' +
               '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LoginResponse)) return false;
        LoginResponse that = (LoginResponse) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(username, that.username) &&
               Objects.equals(email, that.email) &&
               Objects.equals(role, that.role) &&
               Objects.equals(dashboardUrl, that.dashboardUrl) &&
               Objects.equals(token, that.token) &&
               Arrays.equals(profilePic, that.profilePic);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, username, email, role, dashboardUrl, token, Arrays.hashCode(profilePic));
    }
}
