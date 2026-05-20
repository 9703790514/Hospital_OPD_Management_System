package training.iqgateway.test;


import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.entities.Doctor;
import training.iqgateway.service.DoctorService;

/**
 * REST controller for managing Doctor entities.
 * Exposes a set of endpoints for CRUD operations and searching doctors.
 */
@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from your frontend
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    /**
     * Creates a new Doctor record.
     * The URL will be: POST http://localhost:2005/api/doctors
     *
     * @param doctor The Doctor object to be saved.
     * @return ResponseEntity with the created Doctor and HTTP status 201 Created.
     */
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorService.saveDoctor(doctor);
        return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
    }

    /**
     * Retrieves all doctors from the database.
     * The URL will be: GET http://localhost:2005/api/doctors/all
     *
     * @return ResponseEntity containing a list of all Doctors.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Retrieves a doctor by their primary MongoDB _id.
     * The URL will be: GET http://localhost:2005/api/doctors/{id}
     *
     * @param id The primary MongoDB _id of the doctor.
     * @return ResponseEntity containing the Doctor or a 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves a doctor by their custom user ID.
     * The URL will be: GET http://localhost:2005/api/doctors/customId/{customId}
     *
     * @param customId The custom ID of the doctor (e.g., "DOC001").
     * @return ResponseEntity containing the Doctor or a 404 Not Found.
     */
    @GetMapping("/customId/{customId}")
    public ResponseEntity<Doctor> getDoctorByCustomId(@PathVariable String customId) {
        return doctorService.getDoctorByCustomId(customId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing doctor's details by their primary MongoDB _id.
     * The URL will be: PUT http://localhost:2005/api/doctors/{id}
     *
     * @param id The _id of the doctor to update.
     * @param doctor The Doctor object with the updated details.
     * @return ResponseEntity with the updated Doctor or a 404 Not Found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a doctor by their primary MongoDB _id.
     * The URL will be: DELETE http://localhost:2005/api/doctors/{id}
     *
     * @param id The _id of the doctor to delete.
     * @return ResponseEntity with no content and HTTP status 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
