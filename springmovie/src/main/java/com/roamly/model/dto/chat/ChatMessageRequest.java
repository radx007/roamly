package com.roamly.model.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageRequest {

    @NotBlank
    private String message;

    private String conversationId;
}
