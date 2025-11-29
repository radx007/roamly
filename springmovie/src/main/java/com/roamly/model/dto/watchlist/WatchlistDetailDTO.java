package com.roamly.model.dto.watchlist;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.roamly.model.dto.movie.MovieDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistDetailDTO {

    private Long id;
    private String name;
    private String description;

    @JsonProperty("isPublic")
    private Boolean isPublic;

    private List<MovieDTO> movies;
    private LocalDateTime createdAt;

    // ADD THESE FIELDS
    private Long userId;  // ← Owner's user ID
    private String username;  // ← Owner's username (optional)
}
