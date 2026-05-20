// src/main/java/training/iqgateway/controller/AppointmentController.java
package training.iqgateway.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.entities.Appointment;
import training.iqgateway.entities.ScheduleUpdatePayload;
import training.iqgateway.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    

    @PostMapping("/update-on-schedule-change")
    public ResponseEntity<?> handleScheduleChange(@RequestBody ScheduleUpdatePayload payload) {
        // Implementation of the new endpoint logic
        try {
            String doctorId = payload.getDoctorId();
            List<Instant> leaveDates = payload.getLeaveDates();

            if (leaveDates != null && !leaveDates.isEmpty()) {
                for (Instant leaveDateInstant : leaveDates) {
                    LocalDate leaveDate = leaveDateInstant.atZone(java.time.ZoneId.of("UTC")).toLocalDate();
                    appointmentService.cancelAppointmentsByDoctorAndDate(doctorId, leaveDate);
                }
            }

            return ResponseEntity.ok("Appointments updated based on schedule changes.");
        } catch (Exception e) {
            System.err.println("Error updating appointments on schedule change: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error updating appointments: " + e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable String id) {
        // Your logic to update the appointment status
        appointmentService.updateAppointmentStatus(id, "Completed");
        return ResponseEntity.ok().body("Appointment status updated successfully.");
    }
    
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment createdAppointment = appointmentService.createAppointment(appointment);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable String patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        // It's generally better to return an empty list with 200 OK than 204 No Content for lists
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable String doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        // It's generally better to return an empty list with 200 OK than 204 No Content for lists
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorAndDate(
            @PathVariable String doctorId,
            @PathVariable String date) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date); // Parses YYYY-MM-DD
            List<Appointment> appointments = appointmentService.getAppointmentsByDoctorAndDate(doctorId, appointmentDate);
            // --- FIX APPLIED HERE ---
            // Always return ResponseEntity.ok(appointments)
            // If 'appointments' is empty, Spring will serialize it to '[]' (empty JSON array)
            // which the frontend can correctly parse.
            return ResponseEntity.ok(appointments);
        } catch (DateTimeParseException e) {
            System.err.println("Error parsing date: " + date + " - " + e.getMessage());
            return ResponseEntity.badRequest().body(null); // Invalid date format
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment updatedAppointment) {
        Optional<Appointment> existing = appointmentService.getAppointmentById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        updatedAppointment.setId(id);
        Appointment savedAppointment = appointmentService.updateAppointment(updatedAppointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        Appointment updated = appointmentService.updateAppointmentStatus(id, newStatus);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointmentById(id);
        return ResponseEntity.noContent().build();
    }
}