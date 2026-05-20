package training.iqgateway.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.service.OtpService;


@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String phone = request.get("phone");

        if (userId == null || phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("userId and phone are required");
        }
        try {
            otpService.generateAndSendOtp(userId, phone);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String phone = request.get("phone");
        String otp = request.get("otp");

        if (userId == null || phone == null || otp == null ) {
            return ResponseEntity.badRequest().body("userId, phone, and otp are required");
        }

        boolean valid = otpService.verifyOtp(userId, phone, otp);
        if (valid) {
            return ResponseEntity.ok("OTP verified");
        } else {
            return ResponseEntity.status(2401).body("Invalid or expired OTP");
        }
    }
}
