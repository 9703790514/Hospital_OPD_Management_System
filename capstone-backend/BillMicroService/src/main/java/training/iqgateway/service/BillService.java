package training.iqgateway.service;

import training.iqgateway.entities.Bill;
import java.util.List;
import java.util.Optional;

public interface BillService {
    Bill save(Bill bill);

    List<Bill> findAll();

    Optional<Bill> findByMongoId(String id);   // For Mongo _id

    Bill findById(Integer id);                  // For business id field

    List<Bill> findByPatientId(Integer patientId);

    void deleteById(String id);// Delete by MongoDB _id
    
    
    
    public List<Bill> findByAppointmentId(String appointmentId);// New method to find bills by status

	List<Bill> findByAppointmentIdAndBillType(String appointmentId, String billType);
}
