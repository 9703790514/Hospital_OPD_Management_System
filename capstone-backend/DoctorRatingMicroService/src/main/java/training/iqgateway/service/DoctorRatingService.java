package training.iqgateway.service;
import java.util.List;

import training.iqgateway.entities.DoctorRating;

public interface DoctorRatingService {

    DoctorRating saveRating(DoctorRating rating);

    List<DoctorRating> getRatingsByDoctorId(String doctorId);

    List<DoctorRating> getRatingsByPatientId(String patientId);
    
    List<DoctorRating> getAllRatings();

}
