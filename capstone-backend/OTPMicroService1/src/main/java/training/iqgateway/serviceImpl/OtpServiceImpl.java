package training.iqgateway.serviceImpl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.UserOtp;
import training.iqgateway.repositories.UserOtpRepository;
import training.iqgateway.service.OtpService;
import training.iqgateway.service.SmsSenderService;

@Service
public class OtpServiceImpl implements OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;

    @Autowired
    private UserOtpRepository userOtpRepository;

    @Autowired
    private SmsSenderService smsSenderService;

    // Generate 4-digit OTP between 1000 and 9999
    private String generateOtp() {
        int otp = (int) (Math.random() * 9000) + 1000;
        return String.valueOf(otp);
    }

    @Override
    public void generateAndSendOtp(String userId, String phone) throws Exception {
        String otp = generateOtp();

        Instant now = Instant.now();
        Instant expiry = now.plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES);

        // Remove any existing OTP for the user and phone
        userOtpRepository.deleteByUserIdAndPhone(userId, phone);

        // Save new OTP with expiry
        UserOtp userOtp = new UserOtp(userId, phone, otp, expiry);
        userOtpRepository.save(userOtp);

        // Construct SMS message
        String message = "Your OTP code is: " + otp + ". It is valid for " + OTP_EXPIRY_MINUTES + " minutes.";

        // Send SMS and check result (assumes sendSms returns boolean)
        boolean smsSent = smsSenderService.sendSms(phone, message);
        if (!smsSent) {
            // Optionally remove OTP record on failure to send SMS
            userOtpRepository.delete(userOtp);
            throw new Exception("Failed to send OTP SMS");
        }
    }

    @Override
    public boolean verifyOtp(String userId, String phone, String otp) {
        Optional<UserOtp> userOtpOpt = userOtpRepository.findByUserIdAndPhoneAndOtp(userId, phone, otp);
        if (userOtpOpt.isEmpty()) {
            return false; // No match found
        }

        UserOtp userOtp = userOtpOpt.get();

        // Check if OTP expired
        if (userOtp.getExpiresAt().isBefore(Instant.now())) {
            // OTP expired - delete from DB
            userOtpRepository.delete(userOtp);
            return false;
        }

        // OTP is valid, remove it to prevent reuse
        userOtpRepository.delete(userOtp);
        return true;
    }
}
