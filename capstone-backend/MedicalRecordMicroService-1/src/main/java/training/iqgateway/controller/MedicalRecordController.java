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

import training.iqgateway.entities.MedicalRecord;
import training.iqgateway.service.MedicalRecordService;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService service;

    public MedicalRecordController(MedicalRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<MedicalRecord> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getById(@PathVariable String id) {
        return service.findById(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MedicalRecord create(@RequestBody MedicalRecord record) {
        return service.save(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> update(@PathVariable String id, @RequestBody MedicalRecord record) {
        return service.findById(id).map(existing -> {
            record.setId(existing.getId());
            MedicalRecord updated = service.save(record);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getByPatientId(@PathVariable String patientId) {
        List<MedicalRecord> records = service.getRecordsByPatientId(patientId);
        if (records.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(records);
    }

  
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
