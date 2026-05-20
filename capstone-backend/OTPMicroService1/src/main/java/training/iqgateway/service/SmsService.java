package training.iqgateway.service;
 
 
 
public interface SmsService {
    boolean sendSms(String phoneNumber, String message);
}
 