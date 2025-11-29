package com.roamly.service.auth;

import com.roamly.model.dto.auth.RegisterRequest;

public interface KeycloakService {
    String createUser(RegisterRequest request);
    void deleteUser(String keycloakId);
    void updateUserRole(String keycloakId, String role);
    void resetPassword(String keycloakId, String newPassword);
}
