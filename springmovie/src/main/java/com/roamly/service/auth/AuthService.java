package com.roamly.service.auth;

import com.roamly.model.dto.auth.*;

public interface AuthService {
    LoginResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(String refreshToken);
    void logout(String token);
}
