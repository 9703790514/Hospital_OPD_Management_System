package training.iqgateway.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.entities.Patient;
import training.iqgateway.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public List<Patient> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getById(@PathVariable String id) {
        Optional<Patient> patient = service.findById(id);
        return patient.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Patient create(@RequestBody Patient patient) {
        return service.save(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable String id, @RequestBody Patient patient) {
        return service.findById(id).map(existing -> {
            patient.set_id(existing.get_id());
            Patient updated = service.save(patient);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Additional endpoint to get patients by user_id
    @GetMapping("/user/{userId}")
    public List<Patient> getByUserId(@PathVariable String userId) {
        return service.findByUserId(userId);
    }
}
