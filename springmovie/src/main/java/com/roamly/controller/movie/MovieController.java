package com.roamly.controller.movie;

import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.common.StatsDTO;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.MovieDetailsDTO;
import com.roamly.security.SecurityUtils;
import com.roamly.service.movie.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<PagedResponse<MovieDTO>> browseMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "rating") String sortBy) {

        PagedResponse<MovieDTO> response = movieService.browseMovies(page, size, genre, sortBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieDTO>> getMovieById(@PathVariable Long id) {
        MovieDTO movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getFeaturedMovies() {
        List<MovieDTO> movies = movieService.getFeaturedMovies();
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getPopularMovies(
            @RequestParam(defaultValue = "10") int limit) {
        List<MovieDTO> movies = movieService.getPopularMovies(limit);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<MovieDTO>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PagedResponse<MovieDTO> response = movieService.searchMovies(query, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getRecommendations() {
        Long userId = securityUtils.getCurrentUserId();
        List<MovieDTO> movies = movieService.getRecommendations(userId);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    // ADD THIS METHOD TO MovieController.java

    @PatchMapping("/{id}/featured")
    public ResponseEntity<ApiResponse<MovieDTO>> toggleFeatured(@PathVariable Long id) {
        MovieDTO movie = movieService.toggleFeatured(id);
        return ResponseEntity.ok(ApiResponse.success(movie, "Featured status updated"));
    }

    // NEW: Enhanced movie details with cast and streaming
    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<MovieDetailsDTO>> getMovieDetails(@PathVariable Long id) {
        MovieDetailsDTO movie = movieService.getMovieDetails(id);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    // ADD THIS NEW ENDPOINT - PUBLIC (NO AUTH REQUIRED)
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsDTO>> getPublicStats() {
        StatsDTO stats = movieService.getPublicStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }


}
