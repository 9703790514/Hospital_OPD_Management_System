package training.iqgateway.test;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.controller.BillItemController;
import training.iqgateway.entities.BillItem;
import training.iqgateway.service.BillItemService;

// @WebMvcTest configures a Spring MVC environment for the controller being tested.
// It auto-configures MockMvc and scans for controllers, but not other components like services.
@WebMvcTest(BillItemController.class)
public class BillItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // @MockBean provides a Mockito mock of the service, which is a dependency of the controller.
    @MockBean
    private BillItemService billItemService;

    // Helper for converting objects to JSON strings
    @Autowired
    private ObjectMapper objectMapper;

    private BillItem billItem;
    private final String API_BASE_PATH = "/api/bill-items";

    @BeforeEach
    void setUp() {
        // Initialize a sample BillItem object for use in tests
        billItem = new BillItem();
        billItem.setId("mongo_id_123");
        billItem.setBillItemId(1);
        billItem.setBillId("bill_123");
        billItem.setDescription("Service X");
        billItem.setQuantity(2);
        billItem.setUnitPrice(100.0);
        billItem.setServiceDate("2024-01-01");
        billItem.setNotes("Test notes");
        billItem.setCreatedAt(Instant.now());
        billItem.setUpdatedAt(Instant.now());
        billItem.setAppointmentId("appointment_123");
    }

    // --- Test cases for GET endpoints ---

    @Test
    void testGetAllBillItems_ShouldReturnListOfItems() throws Exception {
        // Given a list of bill items
        List<BillItem> allItems = List.of(billItem);
        given(billItemService.findAll()).willReturn(allItems);

        // When a GET request is made to the base path
        mockMvc.perform(get(API_BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(allItems.size()))
                .andExpect(jsonPath("$[0].id").value(billItem.getId()));
    }

    @Test
    void testGetBillItemBy_Id_WhenFound_ShouldReturnItem() throws Exception {
        // Given an existing bill item
        given(billItemService.findById(anyString())).willReturn(Optional.of(billItem));

        // When a GET request is made with the item's _id
        mockMvc.perform(get(API_BASE_PATH + "/{_id}", billItem.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(billItem.getId()))
                .andExpect(jsonPath("$.description").value(billItem.getDescription()));
    }

    @Test
    void testGetBillItemBy_Id_WhenNotFound_ShouldReturnNotFound() throws Exception {
        // Given no item is found
        given(billItemService.findById(anyString())).willReturn(Optional.empty());

        // When a GET request is made with a non-existent _id
        mockMvc.perform(get(API_BASE_PATH + "/{_id}", "non_existent_id")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetBillItemsByBillId_ShouldReturnListOfItems() throws Exception {
        // Given a list of bill items for a specific billId
        List<BillItem> billItemsForSpecificBill = List.of(billItem);
        given(billItemService.findByBillId(billItem.getBillItemId())).willReturn(billItemsForSpecificBill);

        // When a GET request is made with the billId
        mockMvc.perform(get(API_BASE_PATH + "/bill/{billId}", billItem.getBillItemId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(billItemsForSpecificBill.size()))
                .andExpect(jsonPath("$[0].billId").value(billItem.getBillId()));
    }

    // --- Test cases for POST endpoint ---

    @Test
    void testCreateBillItem_ShouldReturnCreatedItem() throws Exception {
        // Given a new bill item to be created
        BillItem newBillItem = new BillItem();
        newBillItem.setBillId("new_bill_id");
        given(billItemService.save(any(BillItem.class))).willReturn(newBillItem);

        // When a POST request is made with the new item's data
        mockMvc.perform(post(API_BASE_PATH)
                .content(objectMapper.writeValueAsString(newBillItem))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").value(newBillItem.getBillId()));
    }

    // --- Test cases for PUT endpoint ---

    @Test
    void testUpdateBillItem_WhenFound_ShouldReturnUpdatedItem() throws Exception {
        // Given an existing bill item and updated data
        String existingId = "mongo_id_123";
        BillItem updatedItemDetails = new BillItem();
        updatedItemDetails.setDescription("Updated Description");

        BillItem existingItem = new BillItem();
        existingItem.setId(existingId);

        given(billItemService.findById(existingId)).willReturn(Optional.of(existingItem));
        given(billItemService.save(any(BillItem.class))).willAnswer(invocation -> {
            BillItem itemToSave = invocation.getArgument(0);
            itemToSave.setId(existingId); // Ensure the ID is preserved
            itemToSave.setDescription(updatedItemDetails.getDescription());
            return itemToSave;
        });

        // When a PUT request is made to update the item
        mockMvc.perform(put(API_BASE_PATH + "/{_id}", existingId)
                .content(objectMapper.writeValueAsString(updatedItemDetails))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingId))
                .andExpect(jsonPath("$.description").value(updatedItemDetails.getDescription()));
    }

    @Test
    void testUpdateBillItem_WhenNotFound_ShouldReturnNotFound() throws Exception {
        // Given a non-existent item
        String nonExistentId = "non_existent_id";
        given(billItemService.findById(nonExistentId)).willReturn(Optional.empty());

        // When a PUT request is made
        mockMvc.perform(put(API_BASE_PATH + "/{_id}", nonExistentId)
                .content(objectMapper.writeValueAsString(billItem))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // --- Test cases for DELETE endpoint ---

    @Test
    void testDeleteBillItem_WhenFound_ShouldReturnNoContent() throws Exception {
        // Given an existing item to be deleted
        String existingId = "mongo_id_123";
        given(billItemService.findById(existingId)).willReturn(Optional.of(billItem));
        doNothing().when(billItemService).deleteById(existingId);

        // When a DELETE request is made
        mockMvc.perform(delete(API_BASE_PATH + "/{_id}", existingId))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteBillItem_WhenNotFound_ShouldReturnNotFound() throws Exception {
        // Given a non-existent item
        String nonExistentId = "non_existent_id";
        given(billItemService.findById(nonExistentId)).willReturn(Optional.empty());

        // When a DELETE request is made
        mockMvc.perform(delete(API_BASE_PATH + "/{_id}", nonExistentId))
                .andExpect(status().isNotFound());
    }
}
