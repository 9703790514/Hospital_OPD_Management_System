package training.iqgateway.test;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.controller.DiagnosticTestController;
import training.iqgateway.entities.DiagnosticTest;
import training.iqgateway.service.DiagnosticTestService;

class DiagnosticTestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DiagnosticTestService diagnosticTestService;

    @InjectMocks
    private DiagnosticTestController diagnosticTestController;

    private ObjectMapper objectMapper;
    private DiagnosticTest sampleTest;

    @BeforeEach
    void setup() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Ensure uploads directory exists for test
        Path uploadsDir = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadsDir);

        mockMvc = MockMvcBuilders.standaloneSetup(diagnosticTestController).build();
        objectMapper = new ObjectMapper();

        sampleTest = new DiagnosticTest();
        sampleTest.setId("test123");
        sampleTest.setMedicalRecordId("med123");
        sampleTest.setTestName("Blood Test");
        sampleTest.setTestType("Lab");
        sampleTest.setOrderedByDoctorId("doc123");
        sampleTest.setResults("Positive");
        sampleTest.setResultNotes("All good");
        sampleTest.setPerformedByUserId("nurse01");
        sampleTest.setOrderDate(LocalDateTime.now());
        sampleTest.setStatus("Completed");
        sampleTest.setReportDocumentUrl("http://localhost/doc1.pdf");
        sampleTest.setCreatedAt(LocalDateTime.now());
        sampleTest.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testGetAll() throws Exception {
        when(diagnosticTestService.findAll()).thenReturn(List.of(sampleTest));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].testName").value("Blood Test"));

        verify(diagnosticTestService, times(1)).findAll();
    }

    @Test
    void testGetById_Found() throws Exception {
        when(diagnosticTestService.findById("test123")).thenReturn(Optional.of(sampleTest));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests/test123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testName").value("Blood Test"));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(diagnosticTestService.findById("x")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests/x"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetByMedicalId() throws Exception {
        when(diagnosticTestService.getTestsForRecord("med123")).thenReturn(List.of(sampleTest));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests/medical/med123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].medicalRecordId").value("med123"));
    }

//    @Test
//    void testCreate_NoFile() throws Exception {
//        when(diagnosticTestService.save(any(DiagnosticTest.class))).thenReturn(sampleTest);
//
//        MockMultipartFile testName = new MockMultipartFile("testName", "", "text/plain", "Blood Test".getBytes());
//        MockMultipartFile orderedByDoctorId = new MockMultipartFile("orderedByDoctorId", "", "text/plain", "doc123".getBytes());
//        MockMultipartFile results = new MockMultipartFile("results", "", "text/plain", "Positive".getBytes());
//        MockMultipartFile resultNotes = new MockMultipartFile("resultNotes", "", "text/plain", "All good".getBytes());
//        MockMultipartFile performedByUserId = new MockMultipartFile("performedByUserId", "", "text/plain", "nurse01".getBytes());
//        MockMultipartFile medicalRecordId = new MockMultipartFile("medicalRecordId", "", "text/plain", "med123".getBytes());
//        MockMultipartFile status = new MockMultipartFile("status", "", "text/plain", "Completed".getBytes());
//
//        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/diagnostic-tests")
//                        .file(testName)
//                        .file(orderedByDoctorId)
//                        .file(results)
//                        .file(resultNotes)
//                        .file(performedByUserId)
//                        .file(medicalRecordId)
//                        .file(status)
//                        .contentType(MediaType.MULTIPART_FORM_DATA))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.testName").value("Blood Test"));
//    }

//    @Test
//    void testUpdate_Found() throws Exception {
//        when(diagnosticTestService.findById("test123")).thenReturn(Optional.of(sampleTest));
//        when(diagnosticTestService.save(any(DiagnosticTest.class))).thenReturn(sampleTest);
//
//        MockMultipartFile testName = new MockMultipartFile("testName", "", "text/plain", "Blood Test".getBytes());
//        MockMultipartFile orderedByDoctorId = new MockMultipartFile("orderedByDoctorId", "", "text/plain", "doc123".getBytes());
//        MockMultipartFile results = new MockMultipartFile("results", "", "text/plain", "Positive".getBytes());
//        MockMultipartFile resultNotes = new MockMultipartFile("resultNotes", "", "text/plain", "All good".getBytes());
//        MockMultipartFile performedByUserId = new MockMultipartFile("performedByUserId", "", "text/plain", "nurse01".getBytes());
//        MockMultipartFile medicalRecordId = new MockMultipartFile("medicalRecordId", "", "text/plain", "med123".getBytes());
//
//        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/diagnostic-tests/test123")
//                        .file(testName)
//                        .file(orderedByDoctorId)
//                        .file(results)
//                        .file(resultNotes)
//                        .file(performedByUserId)
//                        .file(medicalRecordId)
//                        .param("status", "Completed")
//                        .with(req -> { req.setMethod("PUT"); return req; })
//                        .contentType(MediaType.MULTIPART_FORM_DATA))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value("test123"));
//    }

    @Test
    void testUpdate_NotFound() throws Exception {
        when(diagnosticTestService.findById("x")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/diagnostic-tests/x")
                        .param("testName", "Blood Test")
                        .param("orderedByDoctorId", "doc1")
                        .param("results", "Positive")
                        .param("resultNotes", "All good")
                        .param("performedByUserId", "nurse01")
                        .param("medicalRecordId", "med1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete_Found() throws Exception {
        when(diagnosticTestService.findById("test123")).thenReturn(Optional.of(sampleTest));
        doNothing().when(diagnosticTestService).deleteById("test123");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/diagnostic-tests/test123"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDelete_NotFound() throws Exception {
        when(diagnosticTestService.findById("x")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/diagnostic-tests/x"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDownloadFile_Found() throws Exception {
        // Create a dummy file in uploads dir to simulate real file
        Path uploadsDir = Paths.get("uploads").toAbsolutePath().normalize();
        Path filePath = uploadsDir.resolve("sample.txt");
        Files.write(filePath, "dummy content".getBytes());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests/documents/sample.txt"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("sample.txt")));
    }
//
//    @Test
//    void testDownloadFile_NotFound() throws Exception {
//        mockMvc.perform(MockMvcRequestBuilders.get("/api/diagnostic-tests/documents/no_such_file.txt"))
//                .andExpect(status().isNotFound());
//    }
}
