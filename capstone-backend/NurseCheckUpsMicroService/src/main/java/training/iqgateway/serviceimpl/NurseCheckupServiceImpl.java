package training.iqgateway.serviceimpl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.NurseCheckup;
import training.iqgateway.repository.NurseCheckupRepository;
import training.iqgateway.service.NurseCheckupService;

@Service
public class NurseCheckupServiceImpl implements NurseCheckupService {

    @Autowired
    private NurseCheckupRepository repository;

    @Override
    public NurseCheckup createCheckup(NurseCheckup checkup) {
        return repository.save(checkup);
    }

    @Override
    public Optional<NurseCheckup> getCheckupById(String id) {
        return repository.findById(id);
    }

    @Override
    public NurseCheckup updateCheckup(String id, NurseCheckup checkup) {
        return repository.findById(id)
                .map(existing -> {
                    checkup.setId(existing.getId());
                    return repository.save(checkup);
                })
                .orElseThrow(() -> new RuntimeException("Checkup not found with id: " + id));
    }

    @Override
    public void deleteCheckup(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<NurseCheckup> getAllCheckups() {
        return repository.findAll();
    }

    @Override
    public Optional<NurseCheckup> getCheckupByAppointmentId(String appointmentId) {
        return Optional.ofNullable(repository.findByAppointmentId(appointmentId));
    }

	
}
