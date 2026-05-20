package training.iqgateway.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "diagnostic_tests")
public class DiagnosticTest {
    @Id
    private String id;

    @Field("medical_record_id")
    private String medicalRecordId;

    @Field("test_name")
    private String testName;

    @Field("test_type")
    private String testType;

    @Field("ordered_by_doctor_id")
    private String orderedByDoctorId; // CORRECTED TO String

    @Field("order_date")
    private LocalDateTime orderDate;

    private String status;

    private String results;

    @Field("result_notes")
    private String resultNotes;

    @Field("performed_by_user_id")
    private String performedByUserId; // CORRECTED TO String

    @Field("uploaded_at")
    private LocalDateTime uploadedAt;

    @Field("report_document_url")
    private String reportDocumentUrl;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // --- Constructors ---
    public DiagnosticTest() {
    }

    public DiagnosticTest(String id, String medicalRecordId, String testName, String testType,
                          String orderedByDoctorId, LocalDateTime orderDate, String status,
                          String results, String resultNotes, String performedByUserId,
                          LocalDateTime uploadedAt, String reportDocumentUrl,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.medicalRecordId = medicalRecordId;
        this.testName = testName;
        this.testType = testType;
        this.orderedByDoctorId = orderedByDoctorId;
        this.orderDate = orderDate;
        this.status = status;
        this.results = results;
        this.resultNotes = resultNotes;
        this.performedByUserId = performedByUserId;
        this.uploadedAt = uploadedAt;
        this.reportDocumentUrl = reportDocumentUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getters and Setters ---
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

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public String getOrderedByDoctorId() { // Getter for String
        return orderedByDoctorId;
    }

    public void setOrderedByDoctorId(String orderedByDoctorId) { // Setter for String
        this.orderedByDoctorId = orderedByDoctorId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResults() {
        return results;
    }

    public void setResults(String results) {
        this.results = results;
    }

    public String getResultNotes() {
        return resultNotes;
    }

    public void setResultNotes(String resultNotes) {
        this.resultNotes = resultNotes;
    }

    public String getPerformedByUserId() { // Getter for String
        return performedByUserId;
    }

    public void setPerformedByUserId(String performedByUserId) { // Setter for String
        this.performedByUserId = performedByUserId;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public String getReportDocumentUrl() {
        return reportDocumentUrl;
    }

    public void setReportDocumentUrl(String reportDocumentUrl) {
        this.reportDocumentUrl = reportDocumentUrl;
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
}