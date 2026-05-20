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

import training.iqgateway.controller.MedicalRecordController;
import training.iqgateway.entities.MedicalRecord;
import training.iqgateway.service.MedicalRecordService;

class MedicalRecordControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MedicalRecordService service;

    @InjectMocks
    private MedicalRecordController controller;

    private ObjectMapper objectMapper;
    private MedicalRecord sampleRecord;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();

        sampleRecord = new MedicalRecord();
        sampleRecord.setId("rec123");
        sampleRecord.setPatientId("pat001");
        sampleRecord.setDoctorId(101L);
        sampleRecord.setRecordDate(LocalDateTime.now());
        sampleRecord.setChiefComplaint("Pain");
        sampleRecord.setDiagnosis("Flu");
        sampleRecord.setTreatmentPlan("Rest and hydration");
        sampleRecord.setNotes("Sample notes");
        sampleRecord.setCreatedAt(LocalDateTime.now());
        sampleRecord.setUpdatedAt(LocalDateTime.now());
        sampleRecord.setCreatedByUserId(999L);
    }

    @Test
    void testGetAll() throws Exception {
        when(service.findAll()).thenReturn(List.of(sampleRecord));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/medical-records"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId").value("pat001"));

        verify(service, times(1)).findAll();
    }

    @Test
    void testGetById_Found() throws Exception {
        when(service.findById("rec123")).thenReturn(Optional.of(sampleRecord));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/medical-records/rec123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosis").value("Flu"));

        verify(service, times(1)).findById("rec123");
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(service.findById("x")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/medical-records/x"))
                .andExpect(status().isNotFound());
    }

//    @Test
//    void testCreate() throws Exception {
//        when(service.save(any(MedicalRecord.class))).thenReturn(sampleRecord);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/medical-records")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(sampleRecord)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.chiefComplaint").value("Pain"));
//
//        verify(service, times(1)).save(any(MedicalRecord.class));
//    }

//    @Test
//    void testUpdate_Found() throws Exception {
//        when(service.findById("rec123")).thenReturn(Optional.of(sampleRecord));
//        when(service.save(any(MedicalRecord.class))).thenReturn(sampleRecord);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/medical-records/rec123")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(sampleRecord)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value("rec123"));
//
//        verify(service, times(1)).findById("rec123");
//        verify(service, times(1)).save(any(MedicalRecord.class));
//    }

//    @Test
//    void testUpdate_NotFound() throws Exception {
//        when(service.findById("x")).thenReturn(Optional.empty());
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/medical-records/x")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(sampleRecord)))
//                .andExpect(status().isNotFound());
//    }

    @Test
    void testGetByPatientId_Found() throws Exception {
        when(service.getRecordsByPatientId("pat001")).thenReturn(List.of(sampleRecord));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/medical-records/patient/pat001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId").value("pat001"));

        verify(service, times(1)).getRecordsByPatientId("pat001");
    }

    @Test
    void testGetByPatientId_NoContent() throws Exception {
        when(service.getRecordsByPatientId("pat002")).thenReturn(Collections.emptyList());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/medical-records/patient/pat002"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDelete_Found() throws Exception {
        when(service.findById("rec123")).thenReturn(Optional.of(sampleRecord));
        doNothing().when(service).deleteById("rec123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/medical-records/rec123"))
                .andExpect(status().isNoContent());

        verify(service, times(1)).findById("rec123");
        verify(service, times(1)).deleteById("rec123");
    }

    @Test
    void testDelete_NotFound() throws Exception {
        when(service.findById("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/medical-records/notfound"))
                .andExpect(status().isNotFound());
    }
}
