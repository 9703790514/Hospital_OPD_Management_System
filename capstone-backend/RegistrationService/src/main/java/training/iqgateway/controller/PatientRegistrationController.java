//package training.iqgateway.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import training.iqgateway.dto.PatientRegistrationRequest;
//import training.iqgateway.service.PatientRegistrationService;
//
//@RestController
//@RequestMapping("/api/patient")
//@CrossOrigin(origins = "http://localhost:5173") // Adjust as needed for your React app's URL
//
//public class PatientRegistrationController {
//
//    @Autowired
//    private PatientRegistrationService patientRegistrationService;
//
//    @PostMapping("/register")
//    public ResponseEntity<String> registerPatient(@RequestBody PatientRegistrationRequest request) {
//        System.out.println("Called");
//    	if (request.getEmail() == null || request.getEmail().isEmpty() ||
//            request.getUsername() == null || request.getUsername().isEmpty() ||
//            request.getPassword() == null || request.getPassword().isEmpty()) {
//            return ResponseEntity.badRequest().body("Username, email, and password are required.");
//        }
//
//        try {
//            patientRegistrationService.registerPatient(request);
//            return ResponseEntity.ok("Patient registration successful.");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
//        }
//    }
//}

package training.iqgateway.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.dto.PatientRegistrationRequest;
import training.iqgateway.service.PatientRegistrationService;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient")
public class PatientRegistrationController {
    // Logger for detailed server-side error messages
    private static final Logger logger = LoggerFactory.getLogger(PatientRegistrationController.class);

    @Autowired
    private PatientRegistrationService patientRegistrationService;

    @PostMapping("/register")
    public ResponseEntity<String> registerPatient(@Valid @RequestBody PatientRegistrationRequest request, BindingResult result) {
        if (result.hasErrors()) {
            String errors = result.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // This is where the core logic and potential error resides
            patientRegistrationService.registerPatient(request);
            return ResponseEntity.ok("Patient registration successful.");
        } catch (Exception e) {
            // Log the full exception for debugging purposes
            logger.error("Registration failed due to an unexpected server error.", e);

            // Return a 500 status code with a user-friendly message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }
}

