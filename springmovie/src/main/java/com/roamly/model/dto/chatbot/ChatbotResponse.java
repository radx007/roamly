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
public class ChatbotResponse {
    private String answer;
    private String conversationId;
    private Long responseTime;
    private List<MovieSuggestionDTO> suggestedMovies;  // ← ADD THIS
}
