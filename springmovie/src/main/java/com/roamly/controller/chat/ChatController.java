package com.roamly.controller.chat;

import com.roamly.model.dto.chat.ChatMessageRequest;
import com.roamly.model.dto.chat.ChatMessageResponse;
import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.entity.User;
import com.roamly.security.SecurityUtils;
import com.roamly.service.gateway.ChatGatewayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatGatewayService chatGatewayService;
    private final SecurityUtils securityUtils;

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody ChatMessageRequest request) {

        User user = securityUtils.getCurrentUser();

        ChatMessageResponse response = chatGatewayService.sendMessage(
                user.getId(),
                user.getRole().name(),
                request.getMessage(),
                request.getConversationId()
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
