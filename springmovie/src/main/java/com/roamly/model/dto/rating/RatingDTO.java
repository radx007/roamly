package com.roamly.model.dto.rating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long movieId;
    private String movieTitle;
    private Integer ratingValue;
    private String reviewText;
    private boolean spoilerTagged;
    private String sentiment;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
}
