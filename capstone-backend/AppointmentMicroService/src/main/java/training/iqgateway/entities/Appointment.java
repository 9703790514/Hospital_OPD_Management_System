package training.iqgateway.entities;
import java.time.Instant;
import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;  // MongoDB ObjectId as String

    @Field("id")
    private Long customId;  // your custom id field

    @Field("patient_id")
    private String patientId;

    @Field("doctor_id")
    private String doctorId;

    @Field("appointment_date")
    private Instant appointmentDate;

    @Field("appointment_time")
    private Instant appointmentTime;

    @Field("reason_for_visit")
    private String reasonForVisit;

    private String status;

    @Field("booked_by_user_id")
    private String bookedByUserId;

    private String notes;

    @Field("consultation_start_time")
    private Instant consultationStartTime;

    @Field("consultation_end_time")
    private Instant consultationEndTime;

    @Field("room_number")
    private String roomNumber;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
    
    @Field("medical_record_id")
    private String medicalRecordId; // Added field for medical record ID

    // Default constructor
    public Appointment() {}

    // Getters and setters

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public Long getCustomId() {
        return customId;
    }
    public void setCustomId(Long customId) {
        this.customId = customId;
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

    public Instant getAppointmentDate() {
        return appointmentDate;
    }
    public void setAppointmentDate(Instant appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public String getReasonForVisit() {
        return reasonForVisit;
    }
    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookedByUserId() {
        return bookedByUserId;
    }
    public void setBookedByUserId(String bookedByUserId) {
        this.bookedByUserId = bookedByUserId;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }

   

    public Instant getAppointmentTime() {
		return appointmentTime;
	}

	public void setAppointmentTime(Instant appointmentTime) {
		this.appointmentTime = appointmentTime;
	}

	public Instant getConsultationStartTime() {
		return consultationStartTime;
	}

	public void setConsultationStartTime(Instant consultationStartTime) {
		this.consultationStartTime = consultationStartTime;
	}

	public Instant getConsultationEndTime() {
		return consultationEndTime;
	}

	public void setConsultationEndTime(Instant consultationEndTime) {
		this.consultationEndTime = consultationEndTime;
	}

	public String getRoomNumber() {
        return roomNumber;
    }
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
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
    
    public String getMedicalRecordId() {
		return medicalRecordId;
	}
    
    public void setMedicalRecordId(String medicalRecordId) {
		this.medicalRecordId = medicalRecordId;
    }
    
}

