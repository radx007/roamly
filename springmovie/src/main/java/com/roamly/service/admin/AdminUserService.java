package com.roamly.service.admin;

import com.roamly.model.dto.admin.BanUserRequest;
import com.roamly.model.dto.auth.UserDTO;
import com.roamly.model.dto.common.PagedResponse;

public interface AdminUserService {
    PagedResponse<UserDTO> getAllUsers(int page, int size);
    UserDTO getUserById(Long userId);
    void banUser(Long userId, BanUserRequest request);
    void unbanUser(Long userId);
    void deleteUser(Long userId);
}
