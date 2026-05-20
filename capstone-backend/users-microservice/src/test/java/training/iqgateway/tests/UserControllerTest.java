package training.iqgateway.tests;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import training.iqgateway.contoller.UserController;
import training.iqgateway.entities.User;
import training.iqgateway.service.UserService;

public class UserControllerTest {

    private MockMvc mockMvc;
    
    @Mock
    private UserService userService;
    
    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();
    }

    private User createTestUser() {
        User user = new User();
        user.set_id("123abc");
        user.setCustomId("cust123");
        user.setUsername("testuser");
        user.setPassword_hash("hashedpassword");
        user.setEmail("test@example.com");
        user.setPhone_number("1234567890");
        user.setRole_id(1);
        user.setImage("testimage".getBytes());
        user.setLast_login(LocalDateTime.now());
        user.setCreated_at(LocalDateTime.now());
        user.setUpdated_at(LocalDateTime.now());
        return user;
    }

//    @Test
//    public void testCreateUser() throws Exception {
//        User user = createTestUser();
//        when(userService.createUser(any(User.class))).thenReturn(user);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/users")
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(objectMapper.writeValueAsString(user)))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$.username").value("testuser"));
//
//        verify(userService, times(1)).createUser(any(User.class));
//    }

    @Test
    public void testGetUserByIdFound() throws Exception {
        User user = createTestUser();
        when(userService.getUserById("123abc")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/123abc"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserById("123abc");
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        when(userService.getUserById("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/notfound"))
            .andExpect(status().isNotFound());

        verify(userService).getUserById("notfound");
    }

    @Test
    public void testGetUserByUsername() throws Exception {
        User user = createTestUser();
        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/username/testuser"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserByUsername("testuser");
    }

    @Test
    public void testGetUserByEmail() throws Exception {
        User user = createTestUser();
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/email/test@example.com"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).findByEmail("test@example.com");
    }

    @Test
    public void testGetAllUsers() throws Exception {
        User user1 = createTestUser();
        User user2 = createTestUser();
        user2.set_id("456def");
        user2.setUsername("anotheruser");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].username").value("testuser"))
            .andExpect(jsonPath("$[1].username").value("anotheruser"));

        verify(userService).getAllUsers();
    }

//    @Test
//    public void testUpdateUserFound() throws Exception {
//        User updatedUser = createTestUser();
//        updatedUser.setUsername("updateduser");
//
//        when(userService.updateUser(eq("123abc"), any(User.class))).thenReturn(updatedUser);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/123abc")
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(objectMapper.writeValueAsString(updatedUser)))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$.username").value("updateduser"));
//
//        verify(userService).updateUser(eq("123abc"), any(User.class));
//    }

//    @Test
//    public void testUpdateUserNotFound() throws Exception {
//        when(userService.updateUser(eq("notfound"), any(User.class))).thenReturn(null);
//
//        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/notfound")
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(objectMapper.writeValueAsString(createTestUser())))
//            .andExpect(status().isNotFound());
//
//        verify(userService).updateUser(eq("notfound"), any(User.class));
//    }

    @Test
    public void testPatchUserFound() throws Exception {
        User patchedUser = createTestUser();
        patchedUser.setEmail("patched@example.com");

        when(userService.patchUser(eq("123abc"), anyMap())).thenReturn(patchedUser);

        Map<String,Object> updates = Map.of("email", "patched@example.com");

        mockMvc.perform(MockMvcRequestBuilders.patch("/api/users/123abc")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updates)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("patched@example.com"));

        verify(userService).patchUser(eq("123abc"), anyMap());
    }

    @Test
    public void testPatchUserNotFound() throws Exception {
        when(userService.patchUser(eq("notfound"), anyMap())).thenReturn(null);

        Map<String,Object> updates = Map.of("email", "patched@example.com");

        mockMvc.perform(MockMvcRequestBuilders.patch("/api/users/notfound")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updates)))
            .andExpect(status().isNotFound());

        verify(userService).patchUser(eq("notfound"), anyMap());
    }

    @Test
    public void testUpdatePasswordSuccess() throws Exception {
        User user = createTestUser();
        when(userService.updatePassword(eq("123abc"), eq("newPassword123"))).thenReturn(user);

        Map<String,String> body = Map.of("newPassword", "newPassword123");

        mockMvc.perform(MockMvcRequestBuilders.patch("/api/users/updatePassword/123abc")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isOk());

        verify(userService).updatePassword("123abc", "newPassword123");
    }

    @Test
    public void testUpdatePasswordBadRequest() throws Exception {
        Map<String,String> body = Collections.emptyMap();

        mockMvc.perform(MockMvcRequestBuilders.patch("/api/users/updatePassword/123abc")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest());

        verify(userService, never()).updatePassword(anyString(), anyString());
    }

    @Test
    public void testUpdateProfilePicSuccess() throws Exception {
        User user = createTestUser();
        when(userService.updateProfilePic(eq("123abc"), any(byte[].class))).thenReturn(user);

        MockMultipartFile file = new MockMultipartFile(
            "file", "profile.jpg", MediaType.IMAGE_JPEG_VALUE, "image data".getBytes());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/users/123abc/profile-pic").file(file).with(request -> {
            request.setMethod("PATCH"); // because multipart defaults to POST
            return request;
        }))
            .andExpect(status().isOk());

        verify(userService).updateProfilePic(eq("123abc"), any(byte[].class));
    }

    @Test
    public void testUpdateProfilePicBadRequestWhenNoFile() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile("file", new byte[0]);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/users/123abc/profile-pic").file(emptyFile).with(request -> {
            request.setMethod("PATCH");
            return request;
        }))
            .andExpect(status().isBadRequest());

        verify(userService, never()).updateProfilePic(anyString(), any());
    }

    @Test
    public void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser("123abc");

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/123abc"))
            .andExpect(status().isNoContent());

        verify(userService).deleteUser("123abc");
    }

    @Test
    public void testGetUserImageFound() throws Exception {
        User user = createTestUser();
        user.setImage("imagedata".getBytes());
        when(userService.getUserById("123abc")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/123abc/image"))
            .andExpect(status().isOk())
            .andExpect(content().bytes("imagedata".getBytes()));
        
        verify(userService).getUserById("123abc");
    }

    @Test
    public void testGetUserImageNotFound() throws Exception {
        User user = createTestUser();
        user.setImage(null);
        when(userService.getUserById("123abc")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/123abc/image"))
            .andExpect(status().isNotFound());

        verify(userService).getUserById("123abc");
    }

    @Test
    public void testGetUserImageUserNotFound() throws Exception {
        when(userService.getUserById("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/notfound/image"))
            .andExpect(status().isNotFound());

        verify(userService).getUserById("notfound");
    }

    @Test
    public void testGetUserByCustomIdFound() throws Exception {
        User user = createTestUser();
        when(userService.findByCustomId("cust123")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/custom-id/cust123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).findByCustomId("cust123");
    }

    @Test
    public void testGetUserByCustomIdNotFound() throws Exception {
        when(userService.findByCustomId("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/custom-id/notfound"))
            .andExpect(status().isNotFound());

        verify(userService).findByCustomId("notfound");
    }
}
