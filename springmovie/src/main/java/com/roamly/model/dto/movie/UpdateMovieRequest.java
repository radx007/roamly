package com.roamly.model.dto.movie;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateMovieRequest {
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer runtime;
    private String posterPath;
    private String backdropPath;
    private String trailerUrl;
    private List<String> genres;
    private List<String> cast;
    private List<String> directors;
    private Boolean isFeatured;
}
