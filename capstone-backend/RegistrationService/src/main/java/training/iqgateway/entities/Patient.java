package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Objects;

@Document(collection = "patients")
public class Patient {

    @Id
    private String id;

    @Field("user_id")
    private String userId; // Store custom integer user id here

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Field("date_of_birth")
    private String dateOfBirth;

    private String gender;

    @Field("contact_number")
    private String contactNumber;

    private String address;

    @Field("blood_group")
    private String bloodGroup;

    private String allergies;

    @Field("current_medications")
    private String currentMedications;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;

    public Patient() {}

    public Patient(String userId, String firstName, String lastName, String dateOfBirth, String gender,
                   String contactNumber, String address, String bloodGroup, String allergies, String currentMedications) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.currentMedications = currentMedications;
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Patient{" +
                "id='" + id + '\'' +
                ", userId=" + userId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", gender='" + gender + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", address='" + address + '\'' +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", allergies='" + allergies + '\'' +
                ", currentMedications='" + currentMedications + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Patient)) return false;
        Patient patient = (Patient) o;
        return Objects.equals(id, patient.id) &&
               Objects.equals(userId, patient.userId) &&
               Objects.equals(firstName, patient.firstName) &&
               Objects.equals(lastName, patient.lastName) &&
               Objects.equals(dateOfBirth, patient.dateOfBirth) &&
               Objects.equals(gender, patient.gender) &&
               Objects.equals(contactNumber, patient.contactNumber) &&
               Objects.equals(address, patient.address) &&
               Objects.equals(bloodGroup, patient.bloodGroup) &&
               Objects.equals(allergies, patient.allergies) &&
               Objects.equals(currentMedications, patient.currentMedications) &&
               Objects.equals(createdAt, patient.createdAt) &&
               Objects.equals(updatedAt, patient.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, firstName, lastName, dateOfBirth, gender, contactNumber, address, bloodGroup,
                allergies, currentMedications, createdAt, updatedAt);
    }
}
