package training.iqgateway.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import training.iqgateway.entities.DoctorRating;
import training.iqgateway.repository.DoctorRatingRepository;
import training.iqgateway.service.DoctorRatingService;

@Service
public class DoctorRatingServiceImpl implements DoctorRatingService {

    private final DoctorRatingRepository repository;

    public DoctorRatingServiceImpl(DoctorRatingRepository repository) {
        this.repository = repository;
    }

    @Override
    public DoctorRating saveRating(DoctorRating rating) {
        return repository.save(rating);
    }

    @Override
    public List<DoctorRating> getRatingsByDoctorId(String doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    @Override
    public List<DoctorRating> getRatingsByPatientId(String patientId) {
        return repository.findByPatientId(patientId);
    }

	@Override
	public List<DoctorRating> getAllRatings() {
		return repository.findAll();
	}
}
