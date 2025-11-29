package com.roamly.model.dto.chatbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieSuggestionDTO {
    private Long id;
    private String title;
    private String posterPath;
    private Double rating;
    private Integer releaseYear;
}
