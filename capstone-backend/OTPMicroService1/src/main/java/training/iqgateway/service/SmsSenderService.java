package training.iqgateway.service;
 
 
 
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
 
@Service
public class SmsSenderService {
 
    @Value("${twilio.phone-number}")
    private String fromPhoneNumber;
 
    public boolean sendSms(String toPhoneNumber, String messageBody) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(fromPhoneNumber),
                    messageBody)
                .create();
 
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
 
 
 