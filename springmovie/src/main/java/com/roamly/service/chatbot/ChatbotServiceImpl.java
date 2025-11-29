package com.roamly.service.chatbot;

import com.roamly.exception.BadRequestException;
import com.roamly.model.dto.chatbot.*;
import com.roamly.model.entity.Movie;
import com.roamly.model.entity.User;
import com.roamly.repository.MovieRepository;
import com.roamly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${nestjs.chatbot.url}")
    private String nestjsUrl;

    @Value("${nestjs.chatbot.apiKey}")
    private String nestjsApiKey;

    @Override
    public ChatbotResponse askQuestion(ChatbotRequest request) {
        long startTime = System.currentTimeMillis();

        User user = getCurrentUser();

        List<Movie> movies = movieRepository.findAll().stream()
                .limit(50)
                .collect(Collectors.toList());

        List<MovieContextDTO> movieContext = movies.stream()
                .map(this::mapToContext)
                .collect(Collectors.toList());

        NestJSChatbotRequest nestjsRequest = NestJSChatbotRequest.builder()
                .apiKey(nestjsApiKey)
                .userId(user.getId())
                .username(user.getUsername())
                .question(request.getQuestion())
                .movieContext(movieContext)
                .conversationId(request.getConversationId())
                .build();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<NestJSChatbotRequest> entity = new HttpEntity<>(nestjsRequest, headers);

            ResponseEntity<NestJSChatbotResponse> response = restTemplate.postForEntity(
                    nestjsUrl + "/chatbot/ask",
                    entity,
                    NestJSChatbotResponse.class
            );

            NestJSChatbotResponse nestjsResponse = response.getBody();

            if (nestjsResponse == null) {
                throw new BadRequestException("Failed to get response from chatbot");
            }

            long responseTime = System.currentTimeMillis() - startTime;

            return ChatbotResponse.builder()
                    .answer(nestjsResponse.getAnswer())
                    .conversationId(nestjsResponse.getConversationId())
                    .responseTime(responseTime)
                    .suggestedMovies(nestjsResponse.getSuggestedMovies())
                    .build();

        } catch (Exception e) {
            throw new BadRequestException("Chatbot service error: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private MovieContextDTO mapToContext(Movie movie) {
        Integer releaseYear = null;
        if (movie.getReleaseDate() != null) {
            releaseYear = movie.getReleaseDate().getYear();
        }

        return MovieContextDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genres(movie.getGenres())
                .releaseYear(releaseYear)
                .rating(movie.getRating())
                .posterPath(movie.getPosterPath())
                .build();
    }
}
