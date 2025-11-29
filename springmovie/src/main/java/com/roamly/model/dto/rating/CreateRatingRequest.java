package com.roamly.model.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRatingRequest {

    @NotNull
    private Long movieId;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer ratingValue;

    @Size(max = 2000)
    private String reviewText;

    private boolean spoilerTagged = false;
}
