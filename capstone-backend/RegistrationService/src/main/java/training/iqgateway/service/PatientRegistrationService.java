package training.iqgateway.service;

import training.iqgateway.dto.PatientRegistrationRequest;

public interface PatientRegistrationService {
    void registerPatient(PatientRegistrationRequest request);
}
