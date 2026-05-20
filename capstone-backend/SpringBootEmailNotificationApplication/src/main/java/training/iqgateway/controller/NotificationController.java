package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.dto.EmailRequest;
import training.iqgateway.service.EmailService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint to send a generic email.
     * Example Usage (POST):
     * URL: http://localhost:8080/api/notifications/send-email
     * Body:
     * {
     * "to": "recipient@example.com",
     * "subject": "Test Email",
     * "body": "This is a test email from Spring Boot."
     * }
     */
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendSimpleEmail(emailRequest);
            return ResponseEntity.ok("Email sent successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Endpoint to send a password reset email.
     * Example Usage (POST):
     * URL: http://localhost:8080/api/notifications/forgot-password
     * Body:
     * {
     * "to": "user@example.com",
     * "resetLink": "http://your-frontend-app/reset-password?token=someSecureToken123"
     * }
     * The subject and body will be pre-defined for password reset emails.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> sendForgotPasswordEmail(@RequestBody EmailRequest emailRequest) {
        // Basic validation: ensure 'to' and 'resetLink' are provided
        if (emailRequest.getTo() == null || emailRequest.getTo().isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient email 'to' cannot be empty.");
        }
        if (emailRequest.getResetLink() == null || emailRequest.getResetLink().isEmpty()) {
            return ResponseEntity.badRequest().body("Reset link 'resetLink' cannot be empty.");
        }

        try {
            emailService.sendPasswordResetEmail(emailRequest);
            return ResponseEntity.ok("Password reset email sent successfully to " + emailRequest.getTo());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send password reset email: " + e.getMessage());
        }
    }
}
