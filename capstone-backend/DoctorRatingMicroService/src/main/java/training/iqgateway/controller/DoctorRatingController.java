package training.iqgateway.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.entities.DoctorRating;
import training.iqgateway.service.DoctorRatingService;

@RestController
@RequestMapping("/ratings")
public class DoctorRatingController {

    private final DoctorRatingService service;

    public DoctorRatingController(DoctorRatingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DoctorRating> createRating(@RequestBody DoctorRating rating) {
        DoctorRating saved = service.saveRating(rating);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorRating>> getByDoctor(@PathVariable String doctorId) {
        List<DoctorRating> ratings = service.getRatingsByDoctorId(doctorId);
        return ResponseEntity.ok(ratings);
    }
    
    
    @GetMapping()
    public ResponseEntity<List<DoctorRating>> getAll() {
        List<DoctorRating> ratings = service.getAllRatings();
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<DoctorRating>> getByPatient(@PathVariable String patientId) {
        List<DoctorRating> ratings = service.getRatingsByPatientId(patientId);
        return ResponseEntity.ok(ratings);
    }
}
