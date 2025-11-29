package com.roamly.service.auth;

import com.roamly.exception.BadRequestException;
import com.roamly.model.dto.auth.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class KeycloakServiceImpl implements KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Override
    public String createUser(RegisterRequest request) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // Create user representation
        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(true);
        user.setEmailVerified(false);

        // Set password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        // Create user
        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            throw new BadRequestException("Failed to create user in Keycloak: " + response.getStatusInfo());
        }

        // Extract user ID from location header
        String locationHeader = response.getHeaderString("Location");
        String keycloakId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);

        response.close();
        return keycloakId;
    }

    @Override
    public void deleteUser(String keycloakId) {
        RealmResource realmResource = keycloak.realm(realm);
        realmResource.users().delete(keycloakId);
    }

    @Override
    public void updateUserRole(String keycloakId, String role) {
        // Implementation for role assignment
        // This requires configuring realm roles in Keycloak
    }

    @Override
    public void resetPassword(String keycloakId, String newPassword) {
        RealmResource realmResource = keycloak.realm(realm);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(newPassword);
        credential.setTemporary(false);

        realmResource.users().get(keycloakId).resetPassword(credential);
    }
}
