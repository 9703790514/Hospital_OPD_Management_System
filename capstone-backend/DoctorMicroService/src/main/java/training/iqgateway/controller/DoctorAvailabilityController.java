package training.iqgateway.controller;

import java.time.Instant;
import java.time.LocalDate; // Keep LocalDate import if needed for other methods, or remove if not.
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // Import RequestParam
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.entities.DoctorAvailability;
import training.iqgateway.service.DoctorAvailabilityService; // Assuming this service exists and has the new methods
import training.iqgateway.service.DoctorService; // Import DoctorService

@RestController
@RequestMapping("/api/doctor-availabilities")
public class DoctorAvailabilityController {
    @Autowired
    private DoctorAvailabilityService doctorAvailabilityService;

    @Autowired // Autowire DoctorService as well
    private DoctorService doctorService;

    /**
     * Retrieves a doctor's availability record by its unique ID.
     * @param id The unique ID of the DoctorAvailability record.
     * @return ResponseEntity containing the DoctorAvailability or a 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DoctorAvailability> getAvailabilityById(@PathVariable String id) {
        return doctorAvailabilityService.getAvailabilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves a doctor's availability record by their doctorId.
     * @param doctorId The ID of the doctor.
     * @return ResponseEntity containing the DoctorAvailability or a 404 Not Found.
     */
    @GetMapping("/byDoctorId/{doctorId}")
    public ResponseEntity<DoctorAvailability> getAvailabilityByDoctorId(@PathVariable String doctorId) {
        return doctorAvailabilityService.getAvailabilityByDoctorId(doctorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new doctor availability record.
     * @param doctorAvailability The DoctorAvailability object to create.
     * @return ResponseEntity with the created DoctorAvailability and HTTP status 201 Created.
     */
    @PostMapping
    public ResponseEntity<DoctorAvailability> createAvailability(@RequestBody DoctorAvailability doctorAvailability) {
        DoctorAvailability createdAvailability = doctorAvailabilityService.createAvailability(doctorAvailability);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAvailability);
    }

    /**
     * Updates an existing doctor availability record by its unique ID.
     * @param id The unique ID of the DoctorAvailability record to update.
     * @param doctorAvailabilityDetails The DoctorAvailability object with updated details.
     * @return ResponseEntity with the updated DoctorAvailability or a 404 Not Found if the record doesn't exist.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DoctorAvailability> updateAvailability(@PathVariable String id, @RequestBody DoctorAvailability doctorAvailabilityDetails) {
        try {
            DoctorAvailability updatedAvailability = doctorAvailabilityService.updateAvailability(id, doctorAvailabilityDetails);
            return ResponseEntity.ok(updatedAvailability);
        } catch (RuntimeException e) { // Catch the exception from service if not found
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upserts (updates or inserts) a doctor availability record by doctorId.
     * This endpoint is primarily used by the frontend for saving availability schedules.
     * @param doctorId The ID of the doctor.
     * @param doctorAvailabilityDetails The DoctorAvailability object to upsert.
     * @return ResponseEntity with the upserted DoctorAvailability.
     */
    @PatchMapping("/byDoctorId/{doctorId}") // Using PATCH for partial update/upsert semantics
    // You can also use @PutMapping if your frontend sends the full object every time
    public ResponseEntity<DoctorAvailability> upsertAvailabilityByDoctorId(@PathVariable String doctorId, @RequestBody DoctorAvailability doctorAvailabilityDetails) {
        DoctorAvailability upsertedAvailability = doctorAvailabilityService.upsertAvailabilityByDoctorId(doctorId, doctorAvailabilityDetails);
        return ResponseEntity.ok(upsertedAvailability);
    }

    /**
     * Deletes a doctor's availability record by its unique ID.
     * @param id The unique ID of the DoctorAvailability record to delete.
     * @return ResponseEntity with no content and HTTP status 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable String id) {
        doctorAvailabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }

    // --- New Endpoints for Doctor Availability ---

    /**
     * Retrieves a doctor's availability schedule for a specific day of the week.
     * This returns the entire DoctorAvailability document, with the expectation that
     * the client will extract the relevant daily slots.
     * @param doctorId The ID of the doctor.
     * @param day The day of the week (e.g., "MONDAY", "TUESDAY").
     * @return ResponseEntity containing the DoctorAvailability or a 404 Not Found.
     */
    @GetMapping("/byDoctorId/{doctorId}/dailySlot/{day}")
    public ResponseEntity<DoctorAvailability> getAvailabilityByDoctorIdAndDay(
            @PathVariable String doctorId,
            @PathVariable String day) {
        return doctorAvailabilityService.getAvailabilityByDoctorIdAndDay(doctorId, day)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Checks if a doctor is available on a specific date (considering their leave dates).
     * The date should be provided in ISO 8601 format (e.g., "2025-07-30T00:00:00Z").
     * @param doctorId The ID of the doctor.
     * @param date The specific date (Instant) to check for availability. Expected format: ISO 8601 string.
     * @return ResponseEntity with a boolean indicating availability (true if available, false if on leave or record not found).
     */
    @GetMapping("/byDoctorId/{doctorId}/isAvailableOnDate")
    public ResponseEntity<Boolean> isDoctorAvailableOnDate(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant date) {
        boolean available = doctorService.isDoctorAvailableOnDate(doctorId, date); // Changed to doctorService
        return ResponseEntity.ok(available);
    }
}
