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
public class MovieContextDTO {
    private Long id;
    private String title;
    private String description;
    private List<String> genres;
    private Integer releaseYear;
    private Double rating;
    private String posterPath;  // ← ADD THIS
}
