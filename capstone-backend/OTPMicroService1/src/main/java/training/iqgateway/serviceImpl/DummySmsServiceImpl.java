package training.iqgateway.serviceImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import training.iqgateway.service.SmsService;

@Service
public class DummySmsServiceImpl implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(DummySmsServiceImpl.class);

    @Override
    public boolean sendSms(String phoneNumber, String message) {
        // Replace this with integration to an actual SMS provider such as Twilio or Nexmo.
        logger.info("Sending SMS to {}: {}", phoneNumber, message);
        return true; // simulate success
    }
}
