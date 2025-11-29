package com.roamly.model.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalUsers;
    private long totalMovies;
    private long totalRatings;
    private long totalWatchlists;
    private double averageRating;
}
