package training.iqgateway.contoller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.entities.NurseCheckup;
import training.iqgateway.service.NurseCheckupService;

@RestController
@RequestMapping("/api/nurse-checkups")
public class NurseCheckupController {

    @Autowired
    private NurseCheckupService service;

    @PostMapping
    public ResponseEntity<NurseCheckup> createCheckup(@RequestBody NurseCheckup checkup) {
        NurseCheckup created = service.createCheckup(checkup);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NurseCheckup> getCheckupById(@PathVariable String id) {
        return service.getCheckupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<NurseCheckup> getByAppointmentId(@PathVariable String appointmentId) {
        return service.getCheckupByAppointmentId(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<NurseCheckup>> getAllCheckups() {
        return ResponseEntity.ok(service.getAllCheckups());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NurseCheckup> updateCheckup(@PathVariable String id, @RequestBody NurseCheckup checkup) {
        try {
            NurseCheckup updated = service.updateCheckup(id, checkup);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckup(@PathVariable String id) {
        service.deleteCheckup(id);
        return ResponseEntity.noContent().build();
    }
}
