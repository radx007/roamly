package com.roamly.model.dto.chatbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NestJSChatbotRequest {
    private String apiKey;
    private Long userId;
    private String username;
    private String question;
    private List<MovieContextDTO> movieContext;
    private String conversationId;
}
