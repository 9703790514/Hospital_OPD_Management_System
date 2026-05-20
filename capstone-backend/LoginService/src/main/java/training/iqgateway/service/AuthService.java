package training.iqgateway.service;

import training.iqgateway.entities.LoginRequest;
import training.iqgateway.entities.LoginResponse;

public interface AuthService {
    LoginResponse authenticateUser(LoginRequest loginRequest);
}
