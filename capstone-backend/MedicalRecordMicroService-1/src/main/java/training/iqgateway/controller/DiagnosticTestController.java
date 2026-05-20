package training.iqgateway.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.service.DiagnosticTestService;

@RestController
@RequestMapping("/api/diagnostic-tests")
public class DiagnosticTestController {

    private final DiagnosticTestService service;
    private final Path fileStorageLocation; // Path to store uploaded files

    public DiagnosticTestController(DiagnosticTestService service) throws IOException {
        this.service = service;
        // Define and create the directory to store uploaded files.
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(this.fileStorageLocation);
    }

    @GetMapping
    public List<DiagnosticTest> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiagnosticTest> getById(@PathVariable String id) {
        return service.findById(id)
                      .map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("medical/{id}")
    public List<DiagnosticTest> getByMedicalId(@PathVariable String id) {
        return service.getTestsForRecord(id);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public DiagnosticTest create(
        @RequestParam("testName") String testName,
        @RequestParam(value = "testType", required = false) String testType,
        @RequestParam("orderedByDoctorId") String orderedByDoctorId,
        @RequestParam("results") String results,
        @RequestParam("resultNotes") String resultNotes,
        @RequestParam("performedByUserId") String performedByUserId,
        @RequestParam("medicalRecordId") String medicalRecordId,
        @RequestParam("status") String status, // Added status parameter
        @RequestPart(value = "document", required = false) MultipartFile document
    ) {
        String reportDocumentUrl = null;
        if (document != null && !document.isEmpty()) {
            try {
                // Generate a unique filename
                String originalFilename = document.getOriginalFilename();
                String filename = System.currentTimeMillis() + "_" + originalFilename.replace(" ", "_");
                Path targetLocation = this.fileStorageLocation.resolve(filename);
                Files.copy(document.getInputStream(), targetLocation);

                // Construct the complete, accessible URL for the saved file
                reportDocumentUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/diagnostic-tests/documents/")
                        .path(filename)
                        .toUriString();
                
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
            }
        }
        
        DiagnosticTest newTest = new DiagnosticTest();
        newTest.setTestName(testName);
        newTest.setTestType(testType);
        newTest.setOrderedByDoctorId(orderedByDoctorId);
        newTest.setResults(results);
        newTest.setResultNotes(resultNotes);
        newTest.setPerformedByUserId(performedByUserId);
        newTest.setMedicalRecordId(medicalRecordId);
        newTest.setReportDocumentUrl(reportDocumentUrl);

        newTest.setOrderDate(LocalDateTime.now());
        newTest.setUploadedAt(LocalDateTime.now());
        newTest.setCreatedAt(LocalDateTime.now());
        newTest.setUpdatedAt(LocalDateTime.now());
        newTest.setStatus(status); // Set status from the request parameter

        return service.save(newTest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiagnosticTest> update(@PathVariable String id, 
                                                 @RequestParam("testName") String testName,
                                                 @RequestParam(value = "testType", required = false) String testType,
                                                 @RequestParam("orderedByDoctorId") String orderedByDoctorId,
                                                 @RequestParam("results") String results,
                                                 @RequestParam("resultNotes") String resultNotes,
                                                 @RequestParam("performedByUserId") String performedByUserId,
                                                 @RequestParam("medicalRecordId") String medicalRecordId,
                                                 @RequestParam(value = "status", required = false) String status,
                                                 @RequestPart(value = "document", required = false) MultipartFile document) {
        return service.findById(id).map(existing -> {
            String reportDocumentUrl = existing.getReportDocumentUrl();

            if (document != null && !document.isEmpty()) {
                 try {
                    String originalFilename = document.getOriginalFilename();
                    String filename = System.currentTimeMillis() + "_" + originalFilename.replace(" ", "_");
                    Path targetLocation = this.fileStorageLocation.resolve(filename);
                    Files.copy(document.getInputStream(), targetLocation);

                    reportDocumentUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/diagnostic-tests/documents/")
                        .path(filename)
                        .toUriString();
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
                }
            }
            
            existing.setTestName(testName);
            existing.setTestType(testType);
            existing.setOrderedByDoctorId(orderedByDoctorId);
            existing.setResults(results);
            existing.setResultNotes(resultNotes);
            existing.setPerformedByUserId(performedByUserId);
            existing.setMedicalRecordId(medicalRecordId);
            existing.setStatus(status != null ? status : existing.getStatus());
            existing.setReportDocumentUrl(reportDocumentUrl);
            existing.setUpdatedAt(LocalDateTime.now());
            
            DiagnosticTest updated = service.save(existing);
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

    /**
     * New endpoint to serve the uploaded files.
     * The URL for this endpoint will be stored in the 'reportDocumentUrl' field.
     */
    @GetMapping("/documents/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found " + filename);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving file", e);
        }
    }
}