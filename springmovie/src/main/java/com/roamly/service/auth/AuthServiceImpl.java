package com.roamly.service.auth;

import com.roamly.exception.BadRequestException;
import com.roamly.exception.UnauthorizedException;
import com.roamly.model.dto.auth.*;
import com.roamly.model.entity.User;
import com.roamly.repository.UserRepository;
import com.roamly.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final KeycloakService keycloakService;

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Create user in Keycloak
        String keycloakId = keycloakService.createUser(request);

        // Create user in database
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .keycloakId(keycloakId)
                .role(User.Role.USER)
                .build();

        user = userRepository.save(user);

        // Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(mapToUserDTO(user))
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Authenticate with Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        // Find user
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Check if banned
        if (user.isBanned()) {
            throw new UnauthorizedException("User is banned: " + user.getBanReason());
        }

        // Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(mapToUserDTO(user))
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // ADD NULL/EMPTY CHECK
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new UnauthorizedException("Refresh token cannot be null or empty");
        }

        try {
            String username = jwtService.extractUsername(refreshToken);

            if (username == null || username.trim().isEmpty()) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                throw new UnauthorizedException("Invalid or expired refresh token");
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            // CHECK IF USER IS BANNED
            if (user.isBanned()) {
                throw new UnauthorizedException("User is banned: " + user.getBanReason());
            }

            String newAccessToken = jwtService.generateToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400000L)
                    .user(mapToUserDTO(user))
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Failed to refresh token: " + e.getMessage());
        }
    }

    @Override
    public void logout(String token) {
        // In a real implementation, you'd add the token to a blacklist
        // For now, client-side token removal is sufficient
    }

    private UserDTO mapToUserDTO(User user) {
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
