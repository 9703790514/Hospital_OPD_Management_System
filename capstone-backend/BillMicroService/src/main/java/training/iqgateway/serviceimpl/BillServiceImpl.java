package training.iqgateway.serviceimpl;

import org.springframework.stereotype.Service;
import training.iqgateway.entities.Bill;
import training.iqgateway.repository.BillRepository;
import training.iqgateway.service.BillService;

import java.util.List;
import java.util.Optional;

@Service
public class BillServiceImpl implements BillService {
    private final BillRepository repo;

    public BillServiceImpl(BillRepository repo) {
        this.repo = repo;
    }

    @Override
    public Bill save(Bill bill) {
        return repo.save(bill);
    }

    @Override
    public List<Bill> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Bill> findByMongoId(String id) {
        return repo.findById(id);
    }

    @Override
    public Bill findById(Integer id) {
        return repo.findByBillId(id);    // Assuming repo method is findByBillId(Integer id)
    }

    @Override
    public List<Bill> findByPatientId(Integer patientId) {
        return repo.findByPatientId(patientId); // Fix typo from findByPatient_iyd
    }

    @Override
    public void deleteById(String id) {
        repo.deleteById(id);
    }

	@Override
	public List<Bill> findByAppointmentId(String appointmentId) {
				return repo.findByAppointmentId(appointmentId); // Assuming repo method is findByAppointmentId(String appointmentId)
	}
	
	
	
	
	@Override
	public List<Bill> findByAppointmentIdAndBillType(String appointmentId, String billType) {
		return repo.findByAppointmentIdAndBillType(appointmentId, billType); // Assuming repo method is findByAppointmentIdAndBillType(String appointmentId, String billType)
	}
}
