package com.roamly.controller.chatbot;

import com.roamly.model.dto.chatbot.ChatbotRequest;
import com.roamly.model.dto.chatbot.ChatbotResponse;
import com.roamly.model.dto.common.ApiResponse;
import com.roamly.service.chatbot.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<ChatbotResponse>> askQuestion(
            @Valid @RequestBody ChatbotRequest request) {
        ChatbotResponse response = chatbotService.askQuestion(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Question answered successfully"));
    }
}
