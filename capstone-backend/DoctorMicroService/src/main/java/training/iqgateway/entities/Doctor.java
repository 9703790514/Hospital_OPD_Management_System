package training.iqgateway.entities;

import java.time.Instant;
import java.util.Objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id; // MongoDB _id

    @Field("user_id")
    private String customId; // Custom user ID mapped from user_id

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    private String specialization;

    @Field("contact_number")
    private String contactNumber;

    private String email;

    @Field("license_number")
    private String licenseNumber;

    @Field("consultation_fee")
    private Double consultationFee;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;

    private Integer experience;

    private String education;

    // Constructors
    public Doctor() {
    }

    public Doctor(String id, String customId, String firstName, String lastName, String specialization,
                  String contactNumber, String email, String licenseNumber, Double consultationFee,
                  Instant createdAt, Instant updatedAt, Integer experience, String education) {
        this.id = id;
        this.customId = customId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.specialization = specialization;
        this.contactNumber = contactNumber;
        this.email = email;
        this.licenseNumber = licenseNumber;
        this.consultationFee = consultationFee;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.experience = experience;
        this.education = education;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomId() {
        return customId;
    }

    public void setCustomId(String customId) {
        this.customId = customId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Doctor doctor = (Doctor) o;

        return Objects.equals(id, doctor.id) &&
               Objects.equals(customId, doctor.customId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customId);
    }

    @Override
    public String toString() {
        return "Doctor{" +
               "id='" + id + '\'' +
               ", customId='" + customId + '\'' +
               ", firstName='" + firstName + '\'' +
               ", lastName='" + lastName + '\'' +
               ", specialization='" + specialization + '\'' +
               ", contactNumber='" + contactNumber + '\'' +
               ", email='" + email + '\'' +
               ", licenseNumber='" + licenseNumber + '\'' +
               ", consultationFee=" + consultationFee +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               ", experience=" + experience +
               ", education='" + education + '\'' +
               '}';
    }
}
