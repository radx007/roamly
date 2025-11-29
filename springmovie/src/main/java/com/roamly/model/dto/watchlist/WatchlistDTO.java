package com.roamly.model.dto.watchlist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistDTO {
    private Long id;
    private String name;
    private String description;
    @JsonProperty("isPublic")  // ← Make sure this exists
    private Boolean isPublic;
    private int movieCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
