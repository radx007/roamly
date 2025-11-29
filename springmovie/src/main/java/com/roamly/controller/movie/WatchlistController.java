package com.roamly.controller.movie;

import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.watchlist.*;
import com.roamly.security.SecurityUtils;
import com.roamly.service.movie.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlists")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;
    private final SecurityUtils securityUtils;

    // ========== PUBLIC ENDPOINTS (MUST BE FIRST) ==========

    @GetMapping("/public")
    public ResponseEntity<PagedResponse<WatchlistDTO>> getPublicWatchlists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PagedResponse<WatchlistDTO> response = watchlistService.getPublicWatchlists(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/search")
    public ResponseEntity<PagedResponse<WatchlistDTO>> searchPublicWatchlists(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PagedResponse<WatchlistDTO> response = watchlistService.searchPublicWatchlists(query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/popular")
    public ResponseEntity<PagedResponse<WatchlistDTO>> getPopularWatchlists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PagedResponse<WatchlistDTO> response = watchlistService.getPopularWatchlists(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/{watchlistId}")
    public ResponseEntity<ApiResponse<WatchlistDetailDTO>> getPublicWatchlist(
            @PathVariable Long watchlistId) {

        WatchlistDetailDTO watchlist = watchlistService.getPublicWatchlistById(watchlistId);
        return ResponseEntity.ok(ApiResponse.success(watchlist));
    }

    // ========== USER ENDPOINTS (AUTHENTICATED) ==========

    @GetMapping
    public ResponseEntity<ApiResponse<List<WatchlistDTO>>> getMyWatchlists() {
        Long userId = securityUtils.getCurrentUserId();
        List<WatchlistDTO> watchlists = watchlistService.getUserWatchlists(userId);
        return ResponseEntity.ok(ApiResponse.success(watchlists));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WatchlistDTO>> createWatchlist(
            @Valid @RequestBody CreateWatchlistRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        WatchlistDTO watchlist = watchlistService.createWatchlist(userId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(watchlist, "Watchlist created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WatchlistDetailDTO>> getWatchlistById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        WatchlistDetailDTO watchlist = watchlistService.getWatchlistById(userId, id);
        return ResponseEntity.ok(ApiResponse.success(watchlist));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WatchlistDTO>> updateWatchlist(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWatchlistRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        WatchlistDTO watchlist = watchlistService.updateWatchlist(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success(watchlist, "Watchlist updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWatchlist(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        watchlistService.deleteWatchlist(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Watchlist deleted successfully"));
    }

    @PostMapping("/{watchlistId}/movies/{movieId}")
    public ResponseEntity<ApiResponse<Void>> addMovieToWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long movieId) {
        Long userId = securityUtils.getCurrentUserId();
        watchlistService.addMovieToWatchlist(userId, watchlistId, movieId);
        return ResponseEntity.ok(ApiResponse.success(null, "Movie added to watchlist"));
    }

    @DeleteMapping("/{watchlistId}/movies/{movieId}")
    public ResponseEntity<ApiResponse<Void>> removeMovieFromWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long movieId) {
        Long userId = securityUtils.getCurrentUserId();
        watchlistService.removeMovieFromWatchlist(userId, watchlistId, movieId);
        return ResponseEntity.ok(ApiResponse.success(null, "Movie removed from watchlist"));
    }

    @GetMapping("/{id}/qr-code")
    public ResponseEntity<ApiResponse<String>> generateQRCode(@PathVariable Long id) {
        String qrCode = watchlistService.generateWatchlistQRCode(id);
        return ResponseEntity.ok(ApiResponse.success(qrCode));
    }
}
