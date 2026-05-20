package training.iqgateway.entities;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;

    @Field("medical_record_id")
    private String medicalRecordId;

    @Field("medication_name")
    private String medicationName;

    private String dosage;

    private String frequency;

    private String route;

    @Field("start_date")
    private LocalDateTime startDate;

    @Field("end_date")
    private LocalDateTime endDate;

    private String notes;

    @Field("prescribed_by_doctor_id")
    private String prescribedByDoctorId;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    
    @Field("prescription_type")
    private String prescriptionType; // Added field for prescription type

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMedicalRecordId() {
		return medicalRecordId;
	}

	public void setMedicalRecordId(String medicalRecordId) {
		this.medicalRecordId = medicalRecordId;
	}

	public String getMedicationName() {
		return medicationName;
	}

	public void setMedicationName(String medicationName) {
		this.medicationName = medicationName;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}

	public String getRoute() {
		return route;
	}

	public void setRoute(String route) {
		this.route = route;
	}

	public LocalDateTime getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
	}

	public LocalDateTime getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDateTime endDate) {
		this.endDate = endDate;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String  getPrescribedByDoctorId() {
		return prescribedByDoctorId;
	}

	public void setPrescribedByDoctorId(String prescribedByDoctorId) {
		this.prescribedByDoctorId = prescribedByDoctorId;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	public String getPrescriptionType() {
		return prescriptionType;
	}

	public void setPrescriptionType(String prescriptionType) {
		this.prescriptionType = prescriptionType;
	}
	
	
    // Getters and Setters

    
    
}
