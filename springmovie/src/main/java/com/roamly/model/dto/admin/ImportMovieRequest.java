package com.roamly.model.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ImportMovieRequest {

    @NotNull
    private Integer tmdbId;
}
