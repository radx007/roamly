package com.roamly.controller.admin;

import com.roamly.model.dto.admin.AnalyticsDTO;
import com.roamly.model.dto.common.ApiResponse;
import com.roamly.service.admin.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getOverview() {
        AnalyticsDTO analytics = analyticsService.getOverview();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
