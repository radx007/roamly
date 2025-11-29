package com.roamly.model.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TMDBSearchResultDTO {
    private List<Map<String, Object>> results;
    private int page;
    private int totalPages;
    private int totalResults;
}
