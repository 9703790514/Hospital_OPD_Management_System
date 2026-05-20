package training.iqgateway.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

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

import training.iqgateway.controller.PatientController;
import training.iqgateway.entities.Patient;
import training.iqgateway.service.PatientService;

class PatientControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PatientService patientService;

    @InjectMocks
    private PatientController patientController;

    private ObjectMapper objectMapper;

    private Patient patient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(patientController).build();
        objectMapper = new ObjectMapper();

        patient = new Patient();
        patient.set_id("mongo123");
        patient.setId(1);
        patient.setUser_id("user123");
        patient.setFirst_name("John");
        patient.setLast_name("Doe");
        patient.setDate_of_birth("1990-01-01");
        patient.setGender("Male");
        patient.setContact_number("1234567890");
        patient.setAddress("123 Street");
        patient.setBlood_group("O+");
        patient.setAllergies("None");
        patient.setCurrent_medications("None");
        patient.setCreated_at(Instant.now());
        patient.setUpdated_at(Instant.now());
    }

    @Test
    void testGetAllPatients() throws Exception {
        when(patientService.findAll()).thenReturn(List.of(patient));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].first_name").value("John"));

        verify(patientService, times(1)).findAll();
    }

    @Test
    void testGetPatientById_Found() throws Exception {
        when(patientService.findById("mongo123")).thenReturn(Optional.of(patient));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/patients/mongo123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.first_name").value("John"));

        verify(patientService, times(1)).findById("mongo123");
    }

    @Test
    void testGetPatientById_NotFound() throws Exception {
        when(patientService.findById("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/patients/notfound"))
                .andExpect(status().isNotFound());

        verify(patientService, times(1)).findById("notfound");
    }

//    @Test
//    void testCreatePatient() throws Exception {
//        when(patientService.save(any(Patient.class))).thenReturn(patient);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/patients")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(patient)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.first_name").value("John"));
//
//        verify(patientService, times(1)).save(any(Patient.class));
//    }

//    @Test
//    void testUpdatePatient_Found() throws Exception {
//        when(patientService.findById("mongo123")).thenReturn(Optional.of(patient));
//        when(patientService.save(any(Patient.class))).thenReturn(patient);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/patients/mongo123")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(patient)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.first_name").value("John"));
//
//        verify(patientService, times(1)).findById("mongo123");
//        verify(patientService, times(1)).save(any(Patient.class));
//    }

//    @Test
//    void testUpdatePatient_NotFound() throws Exception {
//        when(patientService.findById("notfound")).thenReturn(Optional.empty());
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/patients/notfound")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(patient)))
//                .andExpect(status().isNotFound());
//
//        verify(patientService, times(1)).findById("notfound");
//        verify(patientService, never()).save(any(Patient.class));
//    }

    @Test
    void testDeletePatient_Found() throws Exception {
        when(patientService.findById("mongo123")).thenReturn(Optional.of(patient));
        doNothing().when(patientService).deleteById("mongo123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/patients/mongo123"))
                .andExpect(status().isNoContent());

        verify(patientService, times(1)).findById("mongo123");
        verify(patientService, times(1)).deleteById("mongo123");
    }

    @Test
    void testDeletePatient_NotFound() throws Exception {
}
}