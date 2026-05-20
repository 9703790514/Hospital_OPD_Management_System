package training.iqgateway.entities;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "doctors_rating")
public class DoctorRating {

    @Id
    private String id;
   
    @Field("patient_id")
    private String patientId;
    @Field("doctor_id")
    private String doctorId;
    @Field("doctor_rating")
    private double doctorRating;
    private String description;
    private Instant time;

    // Constructors, getters, setters...

    public DoctorRating() {}

    public DoctorRating(String patientId, String doctorId, double doctorRating, String description, Instant time) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.doctorRating = doctorRating;
        this.description = description;
        this.time = time;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}

	public double getDoctorRating() {
		return doctorRating;
	}

	public void setDoctorRating(double doctorRating) {
		this.doctorRating = doctorRating;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Instant getTime() {
		return time;
	}

	public void setTime(Instant time) {
		this.time = time;
	}

    // Getters and Setters omitted for brevity
    
    
    
}
