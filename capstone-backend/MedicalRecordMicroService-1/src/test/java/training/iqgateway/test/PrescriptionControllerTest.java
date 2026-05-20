package training.iqgateway.test;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Collections;
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

import training.iqgateway.controller.PrescriptionController;
import training.iqgateway.entities.Prescription;
import training.iqgateway.service.PrescriptionService;

class PrescriptionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PrescriptionService service;

    @InjectMocks
    private PrescriptionController controller;

    private ObjectMapper objectMapper;
    private Prescription samplePrescription;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();

        samplePrescription = new Prescription();
        samplePrescription.setId("pres123");
        samplePrescription.setMedicalRecordId("med001");
        samplePrescription.setMedicationName("Paracetamol");
        samplePrescription.setDosage("500mg");
        samplePrescription.setFrequency("Twice a day");
        samplePrescription.setRoute("Oral");
        samplePrescription.setStartDate(LocalDateTime.now());
        samplePrescription.setEndDate(LocalDateTime.now().plusDays(5));
        samplePrescription.setNotes("Take after meals");
        samplePrescription.setPrescribedByDoctorId("doc123");
        samplePrescription.setCreatedAt(LocalDateTime.now());
        samplePrescription.setUpdatedAt(LocalDateTime.now());
        samplePrescription.setPrescriptionType("Regular");
    }

    @Test
    void testGetAll() throws Exception {
        when(service.findAll()).thenReturn(List.of(samplePrescription));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/prescriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].medicationName").value("Paracetamol"));

        verify(service, times(1)).findAll();
    }

    @Test
    void testGetById_Found() throws Exception {
        when(service.findById("pres123")).thenReturn(Optional.of(samplePrescription));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/prescriptions/pres123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dosage").value("500mg"));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(service.findById("x")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/prescriptions/x"))
                .andExpect(status().isNotFound());
    }

//    @Test
//    void testCreate() throws Exception {
//        when(service.save(any(Prescription.class))).thenReturn(samplePrescription);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/prescriptions")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(samplePrescription)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.medicationName").value("Paracetamol"));
//
//        verify(service, times(1)).save(any(Prescription.class));
//    }

//    @Test
//    void testUpdate_Found() throws Exception {
//        when(service.findById("pres123")).thenReturn(Optional.of(samplePrescription));
//        when(service.save(any(Prescription.class))).thenReturn(samplePrescription);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/prescriptions/pres123")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(samplePrescription)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value("pres123"));
//    }
//
//     @Test
//    void testUpdate_NotFound() throws Exception {
//        when(service.findById("x")).thenReturn(Optional.empty());
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/prescriptions/x")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(samplePrescription)))
//                .andExpect(status().isNotFound());
//    }

    @Test
    void testDelete_Found() throws Exception {
        when(service.findById("pres123")).thenReturn(Optional.of(samplePrescription));
        doNothing().when(service).deleteById("pres123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/prescriptions/pres123"))
                .andExpect(status().isNoContent());

        verify(service, times(1)).deleteById("pres123");
    }

    @Test
    void testDelete_NotFound() throws Exception {
        when(service.findById("nope")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/prescriptions/nope"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetByMedicalId_Found() throws Exception {
        when(service.getTestsForRecord("med001")).thenReturn(List.of(samplePrescription));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/prescriptions/medical/med001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].medicalRecordId").value("med001"));
    }

    @Test
    void testGetByMedicalId_NotFound() throws Exception {
        when(service.getTestsForRecord("med002")).thenReturn(Collections.emptyList());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/prescriptions/medical/med002"))
                .andExpect(status().isNotFound());
    }
}

