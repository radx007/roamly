package com.roamly.model.dto.watchlist;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateWatchlistRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @JsonProperty("isPublic")  // ← Maps JSON "isPublic" to this field
    private Boolean publicWatchlist = false;  // Use Boolean, not boolean

    // Add helper method for backward compatibility
    public boolean isPublic() {
        return publicWatchlist != null && publicWatchlist;
    }
}
