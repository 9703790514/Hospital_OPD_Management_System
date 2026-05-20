package training.iqgateway.controller;


import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList; // Import ArrayList for null-safe list initialization
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import training.iqgateway.entities.Bill;
import training.iqgateway.service.BillService;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillService service;

    private final String uploadDir = "uploads/bill_documents/";

    public BillController(BillService service) {
        this.service = service;
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            // Directory creation failed - logged elsewhere
        }
    }

    @GetMapping
    public List<Bill> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getByMongoId(@PathVariable String id) {
        Optional<Bill> opt = service.findByMongoId(id);
        return opt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/bill-id/{id}")
    public ResponseEntity<Bill> getById(@PathVariable Integer id) {
        Bill bill = service.findById(id);
        return bill != null ? ResponseEntity.ok(bill) : ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{patientId}")
    public List<Bill> getByPatientId(@PathVariable Integer patientId) {
        return service.findByPatientId(patientId);
    }

    @PostMapping
    public Bill create(@RequestBody Bill bill) {
        return service.save(bill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> update(@PathVariable String id, @RequestBody Bill bill) {
        return service.findByMongoId(id)
                .map(existing -> {
                    bill.setId(existing.getId());
                    return ResponseEntity.ok(service.save(bill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findByMongoId(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/appointments/{appointmentId}")
    public ResponseEntity<List<Bill>> getBillsByAppointmentId(@PathVariable String appointmentId) {
        List<Bill> bills = service.findByAppointmentId(appointmentId);
        if (bills.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bills);
    }

    /**
     * Finds a list of bills by appointment ID and bill type.
     * This endpoint is useful for retrieving specific types of bills for a given appointment.
     * * @param appointmentId The ID of the appointment.
     * @param billType The type of the bill to search for (e.g., "Consultation").
     * @return A list of Bill objects that match both the appointment ID and bill type.
     */
    @GetMapping("/appointments/{appointmentId}/type/{billType}")
    public ResponseEntity<List<Bill>> getBillsByAppointmentIdAndBillType(@PathVariable String appointmentId, @PathVariable String billType) {
        List<Bill> bills = service.findByAppointmentIdAndBillType(appointmentId, billType);
        if (bills.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bills);
    }
    
    /**
     * Correctly handles the PATCH request to add new bill item IDs to the existing 'bills' list.
     * This method appends new IDs instead of replacing the entire list.
     *
     * @param id The MongoDB ID of the main bill document.
     * @param updates A map containing the fields to update (e.g., {"bills": ["item1_id", "item2_id"]}).
     * @return The updated Bill document.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Bill> updateBills(@PathVariable String id, @RequestBody Map<String, List<String>> updates) {
        Optional<Bill> optionalBill = service.findByMongoId(id);
        if (!optionalBill.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Bill existingBill = optionalBill.get();
        List<String> newBillItems = updates.get("bills");

        if (newBillItems == null || newBillItems.isEmpty()) {
            // If the 'bills' key is missing or the list is empty, it's a bad request.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        List<String> currentBills = existingBill.getBills();
        
        // Ensure the list is not null before adding to it.
        if (currentBills == null) {
            currentBills = new ArrayList<>();
            existingBill.setBills(currentBills);
        }

        // Add all new bill items to the existing list.
        currentBills.addAll(newBillItems);

        Bill updatedBill = service.save(existingBill);
        return ResponseEntity.ok(updatedBill);
    }

    @PostMapping("/upload-document")
    public ResponseEntity<?> uploadBillDocument(@RequestParam("billDocument") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please select a file to upload.");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed.");
        }

        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(uploadDir, uniqueFileName);

            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "http://localhost:2009/uploads/bill_documents/" + uniqueFileName;

            return ResponseEntity.ok(new FileUploadResponse(
                "File uploaded successfully",
                uniqueFileName,
                filePath.toString(),
                fileUrl
            ));

        } catch (IOException e) {
            System.err.println("Error uploading file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }
}

// Helper class for the response body
class FileUploadResponse {
    private String message;
    private String fileName;
    private String filePath;
    private String fileUrl;

    public FileUploadResponse(String message, String fileName, String filePath, String fileUrl) {
        this.message = message;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileUrl = fileUrl;
    }

    public String getMessage() { return message; }
    public String getFileName() { return fileName; }
    public String getFilePath() { return filePath; }
    public String getFileUrl() { return fileUrl; }
}
