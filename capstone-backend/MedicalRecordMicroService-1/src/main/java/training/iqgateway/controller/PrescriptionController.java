package training.iqgateway.controller;


import java.util.List;

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

import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.entities.Prescription;
import training.iqgateway.service.PrescriptionService;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Prescription> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getById(@PathVariable String id) {
        return service.findById(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Prescription create(@RequestBody Prescription prescription) {
        return service.save(prescription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> update(@PathVariable String id, @RequestBody Prescription prescription) {
        return service.findById(id).map(existing -> {
            prescription.setId(existing.getId());
            Prescription updated = service.save(prescription);
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
    
    @GetMapping("medical/{id}")
    public ResponseEntity<List<Prescription>> getByMedicalId(@PathVariable String id) {
        List<Prescription> prescriptions = service.getTestsForRecord(id);
        if (prescriptions == null || prescriptions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prescriptions);
    }

    
    
}
