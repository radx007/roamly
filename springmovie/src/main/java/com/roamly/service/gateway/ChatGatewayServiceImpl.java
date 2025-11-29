package com.roamly.service.gateway;

import com.roamly.model.dto.chat.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatGatewayServiceImpl implements ChatGatewayService {

    private final RestTemplate restTemplate;

    @Value("${nestjs.chatbot.url}")
    private String nestjsUrl;

    @Override
    public ChatMessageResponse sendMessage(Long userId, String userRole, String message, String conversationId) {
        String url = nestjsUrl + "/chat/process";

        // Build request payload
        Map<String, Object> request = new HashMap<>();
        request.put("userId", userId);
        request.put("userRole", userRole);
        request.put("message", message);
        request.put("conversationId", conversationId);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            // Call NestJS chatbot
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            return ChatMessageResponse.builder()
                    .response((String) response.get("response"))
                    .conversationId((String) response.get("conversationId"))
                    .build();

        } catch (Exception e) {
            System.err.println("Error calling NestJS chatbot: " + e.getMessage());

            // Return fallback response
            return ChatMessageResponse.builder()
                    .response("Sorry, the chatbot service is currently unavailable. Please try again later.")
                    .conversationId(conversationId)
                    .build();
        }
    }
}
