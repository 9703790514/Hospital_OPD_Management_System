package training.iqgateway.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Added this import
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import training.iqgateway.dto.EmailRequest;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.password}")
    private String mailPassword;
    // Use @Value to inject the from address from application.properties
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromAddress;

    /**
     * Sends a simple email.
     * @param emailRequest The request containing recipient, subject, and body.
     */
    public void sendSimpleEmail(EmailRequest emailRequest) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress); // Corrected to use the configured value
            message.setTo(emailRequest.getTo());
            message.setSubject(emailRequest.getSubject());
            message.setText(emailRequest.getBody());
            mailSender.send(message);
        } catch (MailException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Sends a password reset email with a dynamic reset link.
     * @param emailRequest The request containing recipient, subject, and the reset link.
     */
    public void sendPasswordResetEmail(EmailRequest emailRequest) {
        String subject = emailRequest.getSubject() != null ? emailRequest.getSubject() : "Password Reset Request";
        String body = String.format(
                "Dear User,\n\nYou have requested to reset your password. Please click on the following link to reset your password:\n\n%s\n\nThis link will expire in a short time. If you did not request a password reset, please ignore this email.\n\nRegards,\nYour Application Team",
                emailRequest.getResetLink()
        );

        EmailRequest resetEmail = new EmailRequest(emailRequest.getTo(), subject, body, emailRequest.getResetLink());
        sendSimpleEmail(resetEmail);
    }
}