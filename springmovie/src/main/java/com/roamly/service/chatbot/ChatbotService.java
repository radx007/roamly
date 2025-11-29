package com.roamly.service.chatbot;

import com.roamly.model.dto.chatbot.ChatbotRequest;
import com.roamly.model.dto.chatbot.ChatbotResponse;

public interface ChatbotService {
    ChatbotResponse askQuestion(ChatbotRequest request);
}
