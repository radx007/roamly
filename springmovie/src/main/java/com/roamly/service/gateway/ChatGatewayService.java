package com.roamly.service.gateway;

import com.roamly.model.dto.chat.ChatMessageResponse;

public interface ChatGatewayService {
    ChatMessageResponse sendMessage(Long userId, String userRole, String message, String conversationId);
}
