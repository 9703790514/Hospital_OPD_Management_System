package training.iqgateway.entities;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("bills")
public class Bill {
    @Id
    private String id; // Mongo _id

    @Field("id")
    private String billId;

    @Field("patient_id")
    private String patientId;

    @Field("bill_date")
    private String billDate;

    @Field("total_amount")
    private Double totalAmount;

    @Field("amount_paid")
    private Double amountPaid;

    @Field("balance_due")
    private Double balanceDue;

    @Field("payment_method")
    private String paymentMethod;
    
    // --- Added fields to match the repository method ---
    // If you need a different name in the database, use @Field annotation.
    // For now, these are simple fields.
    private String status;
    private String billType;
    
    // The repository method uses 'paymentMode' but your field is 'paymentMethod'.
    // If you want to use the repository method name, you need to rename the field
    // or use a different repository method name.
    // Let's assume you want to use 'paymentMode' for the query.
    private String paymentMode; // Added to match the repository method name

    // ----------------------------------------------------

    @Field("transaction_id")
    private String transactionId;

    @Field("issued_by_user_id")
    private String issuedByUserId;

    @Field("bill_document_url")
    private String billDocumentUrl;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
    
    @Field("bill_items")
    private List<String> bills;
    
    @Field("appointment_id")
    private String appointmentId;
 
    
    // -------- Getters and Setters --------
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBillId() { return billId; }
    public void setBillId(String billId) { this.billId = billId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getBillDate() { return billDate; }
    public void setBillDate(String billDate) { this.billDate = billDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getBalanceDue() { return balanceDue; }
    public void setBalanceDue(Double balanceDue) { this.balanceDue = balanceDue; }

    // Your existing paymentMethod getter/setter
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    // New getters and setters for the added fields
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }
    
    public String getPaymentMode() {
        // Here's the key: You can either rename the field to paymentMode
        // or you can map it to the same field, if they are meant to be the same.
        // Let's assume 'paymentMode' is just a different name for the same field.
        return this.paymentMethod;
    }
    public void setPaymentMode(String paymentMode) {
        // And set the existing field
        this.paymentMethod = paymentMode;
    }
    
    // ------------------------------------

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getIssuedByUserId() { return issuedByUserId; }
    public void setIssuedByUserId(String issuedByUserId) { this.issuedByUserId = issuedByUserId; }

    public String getBillDocumentUrl() { return billDocumentUrl; }
    public void setBillDocumentUrl(String billDocumentUrl) { this.billDocumentUrl = billDocumentUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getBills() { return bills; }
	public void setBills(List<String> bills) { this.bills = bills; }
	
	public String getAppointmentId() { return appointmentId; }
	public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
}