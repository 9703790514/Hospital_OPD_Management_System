package training.iqgateway.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import training.iqgateway.entities.Bill;
import java.util.List;

public interface BillRepository extends MongoRepository<Bill, String> {
	// Finds a list of bills associated with a specific patient ID.
	List<Bill> findByPatientId(Integer patientId);
	
	// Finds a single bill by its unique bill ID.
	Bill findByBillId(Integer billId);
	
	// Finds a list of bills associated with a specific appointment ID.
	List<Bill> findByAppointmentId(String appointmentId);
	
	/**
	 * Finds a list of bills associated with a specific appointment ID and a given bill type.
	 * This method uses a chained property name to create a query that filters by both fields.
	 * * @param appointmentId The ID of the appointment.
	 * @param billType The type of the bill (e.g., "Consultation").
	 * @return A list of Bill objects that match the given appointment ID and bill type.
	 */
	List<Bill> findByAppointmentIdAndBillType(String appointmentId, String billType);
}
