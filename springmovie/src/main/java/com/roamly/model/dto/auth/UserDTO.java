package com.roamly.model.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePicture;
    private List<String> favoriteGenres;
    // ADD THESE FIELDS FOR ADMIN
    @JsonProperty("isBanned")  // ← Make sure this exists
    private Boolean isBanned;
    private String banReason;
    private LocalDateTime createdAt;
}
