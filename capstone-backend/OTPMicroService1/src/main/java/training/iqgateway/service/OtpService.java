package training.iqgateway.service;

public interface OtpService {

    // Generate and send OTP to phone for user
    void generateAndSendOtp(String userId, String phone) throws Exception;

    // Verify OTP submitted by user
    boolean verifyOtp(String userId, String phone, String otp);
}