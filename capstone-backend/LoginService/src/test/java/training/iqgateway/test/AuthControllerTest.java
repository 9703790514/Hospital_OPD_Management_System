package training.iqgateway.test;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.controller.AuthController;
import training.iqgateway.entities.LoginRequest;
import training.iqgateway.entities.LoginResponse;
import training.iqgateway.service.AuthService;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;
    private LoginResponse sampleResponse;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();

        sampleResponse = new LoginResponse(
                "user123",
                "John Doe",
                "john@example.com",
                "Patient",
                "/dashboard/patient",
                "jwt-token-123",
                "profilepic".getBytes()
        );
    }

    @Test
    void testLogin_MissingEmailOrPassword() throws Exception {
        LoginRequest reqMissingEmail = new LoginRequest(null, "pass");
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqMissingEmail)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email and password are required."));

        LoginRequest reqMissingPassword = new LoginRequest("john@example.com", "");
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqMissingPassword)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email and password are required."));

        verify(authService, never()).authenticateUser(any(LoginRequest.class));
    }

    @Test
    void testLogin_Success() throws Exception {
        when(authService.authenticateUser(any(LoginRequest.class)))
                .thenReturn(sampleResponse);

        LoginRequest req = new LoginRequest("john@example.com", "pass");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user123"))
                .andExpect(jsonPath("$.username").value("John Doe"))
                .andExpect(jsonPath("$.role").value("Patient"));

        verify(authService, times(1)).authenticateUser(any(LoginRequest.class));
    }

    @Test
    void testLogin_AuthenticationFailure() throws Exception {
        when(authService.authenticateUser(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        LoginRequest req = new LoginRequest("john@example.com", "wrong");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));

        verify(authService, times(1)).authenticateUser(any(LoginRequest.class));
    }

//    @Test
//    void testLogin_UnexpectedError() throws Exception {
//        when(authService.authenticateUser(any(LoginRequest.class)))
//                .thenThrow(new Exception("DB down"));
//
//        LoginRequest req = new LoginRequest("john@example.com", "pass");
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(req)))
//                .andExpect(status().isInternalServerError())
//                .andExpect(content().string(org.hamcrest.Matchers.containsString("An unexpected error occurred")));
//
//        verify(authService, times(1)).authenticateUser(any(LoginRequest.class));
//    }
}
