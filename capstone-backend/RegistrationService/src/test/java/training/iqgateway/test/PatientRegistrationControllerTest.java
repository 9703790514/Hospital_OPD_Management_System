package training.iqgateway.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

import training.iqgateway.controller.PatientRegistrationController;
import training.iqgateway.dto.PatientRegistrationRequest;
import training.iqgateway.service.PatientRegistrationService;

class PatientRegistrationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PatientRegistrationService patientRegistrationService;

    @InjectMocks
    private PatientRegistrationController patientRegistrationController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(patientRegistrationController).build();
        objectMapper = new ObjectMapper();
    }

    private PatientRegistrationRequest createValidRequest() {
        PatientRegistrationRequest req = new PatientRegistrationRequest();
        req.setUsername("testuser");
        req.setPassword("password123");
        req.setEmail("test@example.com");
        req.setPhoneNumber("1234567890");
        // Set all optional patient fields if needed
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setDateOfBirth("1990-01-01");
        req.setGender("Male");
        req.setContactNumber("9999999999");
        req.setAddress("123 Street");
        req.setBloodGroup("A+");
        req.setAllergies("None");
        req.setCurrentMedications("None");
        return req;
    }

    @Test
    void testRegisterPatient_Success() throws Exception {
        PatientRegistrationRequest request = createValidRequest();
        doNothing().when(patientRegistrationService).registerPatient(any(PatientRegistrationRequest.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Patient registration successful."));

        verify(patientRegistrationService, times(1)).registerPatient(any(PatientRegistrationRequest.class));
    }

    @Test
    void testRegisterPatient_MissingFields() throws Exception {
        PatientRegistrationRequest invalidReq = new PatientRegistrationRequest();
        // All null – should fail validation in controller
        
        mockMvc.perform(MockMvcRequestBuilders.post("/api/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username, email, and password are required."));

        verify(patientRegistrationService, never()).registerPatient(any(PatientRegistrationRequest.class));
    }

    @Test
    void testRegisterPatient_ServiceThrowsException() throws Exception {
        PatientRegistrationRequest request = createValidRequest();
        doThrow(new RuntimeException("Database error"))
                .when(patientRegistrationService).registerPatient(any(PatientRegistrationRequest.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/patient/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Registration failed")));

        verify(patientRegistrationService, times(1)).registerPatient(any(PatientRegistrationRequest.class));
    }
}
