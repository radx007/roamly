package com.roamly.model.dto.auth;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String profilePicture;
    private List<String> favoriteGenres;
}
