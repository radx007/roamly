package com.roamly.model.dto.movie;

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
public class MovieDetailsDTO {
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
    private Boolean isFeatured;
    private List<String> genres;
    private List<String> directors;

    // NEW: Enhanced data
    private List<ActorDTO> cast;
    private List<StreamingProviderDTO> streamingProviders;
    private String watchLink;
}
