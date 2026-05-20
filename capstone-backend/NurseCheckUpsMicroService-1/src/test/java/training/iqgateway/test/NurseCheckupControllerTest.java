package training.iqgateway.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import training.iqgateway.contoller.NurseCheckupController;
import training.iqgateway.entities.NurseCheckup;
import training.iqgateway.entities.NurseCheckup.Vitals;
import training.iqgateway.service.NurseCheckupService;

class NurseCheckupControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NurseCheckupService service;

    @InjectMocks
    private NurseCheckupController controller;

    private ObjectMapper objectMapper;

    private NurseCheckup sampleCheckup;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();

        sampleCheckup = new NurseCheckup();
        sampleCheckup.setId("check123");
        sampleCheckup.setAppointmentId("appt1");
        sampleCheckup.setPatientId("pat1");
        sampleCheckup.setNotes("All good");
        sampleCheckup.setNurseId("nurse12");

        // Add vitals for completeness
        Vitals vitals = new Vitals();
        Vitals.BloodPressure bp = new Vitals.BloodPressure();
        bp.setSystolic(120);
        bp.setDiastolic(80);
        bp.setUnit("mmHg");
        vitals.setBloodPressure(bp);
        vitals.setPulseRate(72);
        sampleCheckup.setVitals(vitals);
    }

    @Test
    void testCreateCheckup() throws Exception {
        when(service.createCheckup(any(NurseCheckup.class))).thenReturn(sampleCheckup);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/nurse-checkups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleCheckup)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("check123"))
                .andExpect(jsonPath("$.notes").value("All good"));

        verify(service, times(1)).createCheckup(any(NurseCheckup.class));
    }

    @Test
    void testGetCheckupById_Found() throws Exception {
        when(service.getCheckupById("check123")).thenReturn(Optional.of(sampleCheckup));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nurse-checkups/check123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("check123"))
                .andExpect(jsonPath("$.patientId").value("pat1"));

        verify(service, times(1)).getCheckupById("check123");
    }

    @Test
    void testGetCheckupById_NotFound() throws Exception {
        when(service.getCheckupById("xyz")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nurse-checkups/xyz"))
                .andExpect(status().isNotFound());

        verify(service, times(1)).getCheckupById("xyz");
    }

    @Test
    void testGetByAppointmentId_Found() throws Exception {
        when(service.getCheckupByAppointmentId("appt1")).thenReturn(Optional.of(sampleCheckup));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nurse-checkups/appointment/appt1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appointmentId").value("appt1"));

        verify(service, times(1)).getCheckupByAppointmentId("appt1");
    }

    @Test
    void testGetByAppointmentId_NotFound() throws Exception {
        when(service.getCheckupByAppointmentId("apptX")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nurse-checkups/appointment/apptX"))
                .andExpect(status().isNotFound());

        verify(service, times(1)).getCheckupByAppointmentId("apptX");
    }

    @Test
    void testGetAllCheckups() throws Exception {
        when(service.getAllCheckups()).thenReturn(List.of(sampleCheckup));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nurse-checkups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("check123"));

        verify(service, times(1)).getAllCheckups();
    }

    @Test
    void testUpdateCheckup_Found() throws Exception {
        when(service.updateCheckup(eq("check123"), any(NurseCheckup.class)))
                .thenReturn(sampleCheckup);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/nurse-checkups/check123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleCheckup)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("check123"));

        verify(service, times(1)).updateCheckup(eq("check123"), any(NurseCheckup.class));
    }

    @Test
    void testUpdateCheckup_NotFound() throws Exception {
        when(service.updateCheckup(eq("badId"), any(NurseCheckup.class)))
                .thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(MockMvcRequestBuilders.put("/api/nurse-checkups/badId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleCheckup)))
                .andExpect(status().isNotFound());

        verify(service, times(1)).updateCheckup(eq("badId"), any(NurseCheckup.class));
    }

    @Test
    void testDeleteCheckup() throws Exception {
        doNothing().when(service).deleteCheckup("check123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/nurse-checkups/check123"))
                .andExpect(status().isNoContent());

        verify(service, times(1)).deleteCheckup("check123");
    }
}
