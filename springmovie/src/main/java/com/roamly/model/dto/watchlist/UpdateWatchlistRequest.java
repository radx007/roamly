package com.roamly.model.dto.watchlist;

import lombok.Data;

@Data
public class UpdateWatchlistRequest {
    private String name;
    private String description;
    private Boolean isPublic;
}
