package com.roamly.service.admin;

import com.roamly.exception.ResourceNotFoundException;
import com.roamly.model.dto.admin.BanUserRequest;
import com.roamly.model.dto.auth.UserDTO;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.entity.User;
import com.roamly.repository.UserRepository;
import com.roamly.service.auth.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Override
    public PagedResponse<UserDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findAll(pageable);

        List<UserDTO> content = userPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<UserDTO>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public void banUser(Long userId, BanUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsBanned(true);
        user.setBanReason(request.getReason());
        userRepository.save(user);

        System.out.println("User " + user.getUsername() + " has been banned. Reason: " + request.getReason());
    }

    @Override
    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsBanned(false);
        user.setBanReason(null);
        userRepository.save(user);

        System.out.println("User " + user.getUsername() + " has been unbanned");
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete from Keycloak if exists
        if (user.getKeycloakId() != null) {
            try {
                keycloakService.deleteUser(user.getKeycloakId());
            } catch (Exception e) {
                System.err.println("Error deleting user from Keycloak: " + e.getMessage());
            }
        }

        // Delete from database (cascade will delete watchlists and ratings)
        userRepository.delete(user);

        System.out.println("User " + user.getUsername() + " has been deleted");
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
                .isBanned(user.getIsBanned())
                .banReason(user.getBanReason())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
