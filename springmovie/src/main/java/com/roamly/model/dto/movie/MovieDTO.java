package com.roamly.model.dto.movie;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private Integer tmdbId;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer runtime;
    private String posterPath;
    private String backdropPath;
    private String trailerUrl;
    private Double rating;
    private Integer voteCount;
    @JsonProperty("isFeatured")  // ← Make sure this exists
    private Boolean isFeatured;
    private List<String> genres;
    private List<String> cast;
    private List<String> directors;
}
