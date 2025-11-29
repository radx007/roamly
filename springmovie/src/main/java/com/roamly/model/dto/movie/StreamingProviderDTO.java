package com.roamly.model.dto.movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreamingProviderDTO {
    private String providerName;
    private String logoPath;
    private String type; // "flatrate", "rent", "buy"
}
