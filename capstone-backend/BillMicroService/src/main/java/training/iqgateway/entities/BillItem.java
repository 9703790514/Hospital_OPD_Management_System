package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;

@Document("bill_items")
public class BillItem {
    @Id
    private String id; // Mongo _id

    @Field("id")
    private Integer billItemId;

    @Field("bill_id")
    private String billId;

    @Field("description")
    private String description;

    @Field("quantity")
    private Integer quantity;

    @Field("unit_price")
    private Double unitPrice;

    @Field("service_date")
    private String serviceDate;

    @Field("notes")
    private String notes;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
    
    
    @Field("appointment_id")
     private String appointmentId;
    
    
    // --- Constructors ---
    public BillItem() {
	}
    

    // -------- Getters and Setters --------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getBillItemId() { return billItemId; }
    public void setBillItemId(Integer billItemId) { this.billItemId = billItemId; }

    public String getBillId() { return billId; }
    public void setBillId(String  billId) { this.billId = billId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public String getServiceDate() { return serviceDate; }
    public void setServiceDate(String serviceDate) { this.serviceDate = serviceDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }


	public String getAppointmentId() {
		return appointmentId;
	}


	public void setAppointmentId(String appointmentId) {
		this.appointmentId = appointmentId;
	}
    
    
   
}
