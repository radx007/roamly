package com.roamly.controller.auth;

import com.roamly.model.dto.auth.UpdateProfileRequest;
import com.roamly.model.dto.auth.UserDTO;
import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.entity.User;
import com.roamly.repository.UserRepository;
import com.roamly.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<UserDTO>> getProfile() {
        User user = securityUtils.getCurrentUser();
        UserDTO userDTO = mapToDTO(user);
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @RequestBody UpdateProfileRequest request) {
        User user = securityUtils.getCurrentUser();

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getFavoriteGenres() != null) {
            user.setFavoriteGenres(request.getFavoriteGenres());
        }

        user = userRepository.save(user);
        UserDTO userDTO = mapToDTO(user);

        return ResponseEntity.ok(ApiResponse.success(userDTO, "Profile updated successfully"));
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .profilePicture(user.getProfilePicture())
                .favoriteGenres(user.getFavoriteGenres())
                .build();
    }
}
