package training.iqgateway.test;


import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.entities.Bill;
import training.iqgateway.service.BillService;

@SpringBootTest
@AutoConfigureMockMvc
class BillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @MockBean
    private BillService billService;

    @Autowired
    private ObjectMapper objectMapper;

    // Sample Bill objects for testing
    private Bill bill1;
    private Bill bill2;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        bill1 = new Bill();
        bill1.setId("60c72b2f5f1b2c3d4e5f6a7b"); // MongoDB _id
        bill1.setBillId("1001");
        bill1.setPatientId("5001");
        bill1.setTotalAmount(150.75);
        bill1.setAppointmentId("app_123");
        bill1.setBillType("Consultation");
        bill1.setBills(new ArrayList<>());
        bill1.setCreatedAt(Instant.now());

        bill2 = new Bill();
        bill2.setId("60c72b2f5f1b2c3d4e5f6a7c");
        bill2.setBillId("1002");
        bill2.setPatientId("5002");
        bill2.setTotalAmount(250.00);
        bill2.setAppointmentId("app_456");
        bill2.setBillType("Lab Test");
        bill2.setBills(Collections.emptyList());
        bill2.setCreatedAt(Instant.now());
    }

    @Test
    void testGetAllBills_shouldReturnListOfBills() throws Exception {
        // Arrange
        List<Bill> allBills = List.of(bill1, bill2);
        when(billService.findAll()).thenReturn(allBills);

        // Act & Assert
        mockMvc.perform(get("/api/bills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].billId", is("1001")))
                .andExpect(jsonPath("$[1].patientId", is("5002")));
    }

    @Test
    void testGetByMongoId_found_shouldReturnBill() throws Exception {
        // Arrange
        when(billService.findByMongoId(bill1.getId())).thenReturn(Optional.of(bill1));

        // Act & Assert
        mockMvc.perform(get("/api/bills/{id}", bill1.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.billId", is("1001")));
    }

    @Test
    void testGetByMongoId_notFound_shouldReturnNotFound() throws Exception {
        // Arrange
        when(billService.findByMongoId("non-existent-id")).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/bills/{id}", "non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetByBillId_found_shouldReturnBill() throws Exception {
        // Arrange
        when(billService.findById(1001)).thenReturn(bill1);

        // Act & Assert
        mockMvc.perform(get("/api/bills/bill-id/{id}", 1001)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.billId", is("1001")));
    }

    @Test
    void testGetByBillId_notFound_shouldReturnNotFound() throws Exception {
        // Arrange
        when(billService.findById(9999)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/bills/bill-id/{id}", 9999)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetByPatientId_shouldReturnListOfBills() throws Exception {
        // Arrange
        List<Bill> patientBills = List.of(bill1);
        when(billService.findByPatientId(5001)).thenReturn(patientBills);

        // Act & Assert
        mockMvc.perform(get("/api/bills/patient/{patientId}", 5001)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].patientId", is("5001")));
    }

    @Test
    void testCreateBill_shouldReturnCreatedBill() throws Exception {
        // Arrange
        Bill newBill = new Bill();
        newBill.setPatientId("5003");
        when(billService.save(any(Bill.class))).thenReturn(newBill);

        // Act & Assert
        mockMvc.perform(post("/api/bills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newBill)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.patientId", is("5003")));
    }

    @Test
    void testUpdateBill_found_shouldReturnUpdatedBill() throws Exception {
        // Arrange
        Bill updatedBillData = new Bill();
        updatedBillData.setPatientId("5001-updated");
        updatedBillData.setTotalAmount(200.00);

        Bill existingBill = bill1;
        when(billService.findByMongoId(existingBill.getId())).thenReturn(Optional.of(existingBill));
        when(billService.save(any(Bill.class))).thenReturn(updatedBillData);

        // Act & Assert
        mockMvc.perform(put("/api/bills/{id}", existingBill.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedBillData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patientId", is("5001-updated")))
                .andExpect(jsonPath("$.totalAmount", is(200.00)));
    }

    @Test
    void testUpdateBill_notFound_shouldReturnNotFound() throws Exception {
        // Arrange
        when(billService.findByMongoId("non-existent-id")).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(put("/api/bills/{id}", "non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Bill())))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteBill_found_shouldReturnNoContent() throws Exception {
        // Arrange
        when(billService.findByMongoId(bill1.getId())).thenReturn(Optional.of(bill1));
        doNothing().when(billService).deleteById(bill1.getId());

        // Act & Assert
        mockMvc.perform(delete("/api/bills/{id}", bill1.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(billService, times(1)).deleteById(bill1.getId());
    }

    @Test
    void testDeleteBill_notFound_shouldReturnNotFound() throws Exception {
        // Arrange
        when(billService.findByMongoId("non-existent-id")).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(delete("/api/bills/{id}", "non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(billService, never()).deleteById(anyString());
    }

    @Test
    void testGetBillsByAppointmentId_found_shouldReturnListOfBills() throws Exception {
        // Arrange
        List<Bill> bills = List.of(bill1);
        when(billService.findByAppointmentId("app_123")).thenReturn(bills);

        // Act & Assert
        mockMvc.perform(get("/api/bills/appointments/{appointmentId}", "app_123")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].appointmentId", is("app_123")));
    }

    @Test
    void testGetBillsByAppointmentId_notFound_shouldReturnNoContent() throws Exception {
        // Arrange
        when(billService.findByAppointmentId("non-existent-app-id")).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/bills/appointments/{appointmentId}", "non-existent-app-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetBillsByAppointmentIdAndBillType_found_shouldReturnListOfBills() throws Exception {
        // Arrange
        List<Bill> bills = List.of(bill1);
        when(billService.findByAppointmentIdAndBillType("app_123", "Consultation")).thenReturn(bills);

        // Act & Assert
        mockMvc.perform(get("/api/bills/appointments/{appointmentId}/type/{billType}", "app_123", "Consultation")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].appointmentId", is("app_123")))
                .andExpect(jsonPath("$[0].billType", is("Consultation")));
    }

    @Test
    void testGetBillsByAppointmentIdAndBillType_notFound_shouldReturnNoContent() throws Exception {
        // Arrange
        when(billService.findByAppointmentIdAndBillType("app_123", "non-existent-type")).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/bills/appointments/{appointmentId}/type/{billType}", "app_123", "non-existent-type")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

//    @Test
//    void testUpdateBills_addItems_shouldSucceed() throws Exception {
//        // Arrange
//        Bill existingBill = bill1;
//        existingBill.setBills(new ArrayList<>());
//        when(billService.findByMongoId(existingBill.getId())).thenReturn(Optional.of(existingBill));
//
//        Bill updatedBill = existingBill;
//        updatedBill.getBills().add("item_456");
//        when(billService.save(any(Bill.class))).thenReturn(updatedBill);
//
//        String jsonUpdate = objectMapper.writeValueAsString(Map.of("bills", List.of("item_456")));
//
//        // Act & Assert
//        mockMvc.perform(patch("/api/bills/{id}", existingBill.getId())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(jsonUpdate))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.bills", hasSize(1)))
//                .andExpect(jsonPath("$.bills[0]", is("item_456")));
//
//        // Verify that save was called with the correct argument
//        verify(billService, times(1)).save(argThat(bill ->
//                bill.getBills().size() == 1 && bill.getBills().get(0).equals("item_456")));
//    }

//    @Test
//    void testUpdateBills_addItemsToExistingList_shouldSucceed() throws Exception {
//        // Arrange
//        Bill existingBill = bill1;
//        existingBill.setBills(new ArrayList<>(List.of("item_123")));
//        when(billService.findByMongoId(existingBill.getId())).thenReturn(Optional.of(existingBill));
//
//        Bill updatedBill = existingBill;
//        updatedBill.getBills().add("item_456");
//        when(billService.save(any(Bill.class))).thenReturn(updatedBill);
//
//        String jsonUpdate = objectMapper.writeValueAsString(Map.of("bills", List.of("item_456")));
//
//        // Act & Assert
//        mockMvc.perform(patch("/api/bills/{id}", existingBill.getId())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(jsonUpdate))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.bills", hasSize(2)))
//                .andExpect(jsonPath("$.bills", hasItem("item_123")))
//                .andExpect(jsonPath("$.bills", hasItem("item_456")));
//    }

    @Test
    void testUpdateBills_notFound_shouldReturnNotFound() throws Exception {
        // Arrange
        when(billService.findByMongoId("non-existent-id")).thenReturn(Optional.empty());
        String jsonUpdate = objectMapper.writeValueAsString(Map.of("bills", List.of("item_123")));

        // Act & Assert
        mockMvc.perform(patch("/api/bills/{id}", "non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonUpdate))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateBills_invalidRequest_shouldReturnBadRequest() throws Exception {
        // Arrange
        when(billService.findByMongoId(bill1.getId())).thenReturn(Optional.of(bill1));
        String jsonUpdate = objectMapper.writeValueAsString(Map.of("some_other_key", List.of("item_123")));

        // Act & Assert
        mockMvc.perform(patch("/api/bills/{id}", bill1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonUpdate))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUploadBillDocument_shouldSucceed() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "billDocument",
                "test-bill.pdf",
                "application/pdf",
                "pdf content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/bills/upload-document")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("File uploaded successfully")));
    }

    @Test
    void testUploadBillDocument_emptyFile_shouldReturnBadRequest() throws Exception {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "billDocument",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/bills/upload-document")
                        .file(emptyFile))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Please select a file to upload."));
    }

    @Test
    void testUploadBillDocument_invalidFile_shouldReturnBadRequest() throws Exception {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
                "billDocument",
                "test.jpg",
                "image/jpeg",
                "image content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/bills/upload-document")
                        .file(invalidFile))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Only PDF files are allowed."));
    }
}
