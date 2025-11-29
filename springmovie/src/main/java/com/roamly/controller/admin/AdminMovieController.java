package com.roamly.controller.admin;

import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.dto.movie.CreateMovieRequest;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.UpdateMovieRequest;
import com.roamly.service.admin.AdminMovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
public class AdminMovieController {

    private final AdminMovieService adminMovieService;

    @PostMapping
    public ResponseEntity<ApiResponse<MovieDTO>> createMovie(
            @Valid @RequestBody CreateMovieRequest request) {
        MovieDTO movie = adminMovieService.createMovie(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(movie, "Movie created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieDTO>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMovieRequest request) {
        MovieDTO movie = adminMovieService.updateMovie(id, request);
        return ResponseEntity.ok(ApiResponse.success(movie, "Movie updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        adminMovieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Movie deleted successfully"));
    }

    @PostMapping("/{id}/feature")
    public ResponseEntity<ApiResponse<Void>> toggleFeaturedMovie(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        adminMovieService.toggleFeaturedMovie(id, featured);
        String message = featured ? "Movie featured" : "Movie unfeatured";
        return ResponseEntity.ok(ApiResponse.success(null, message));
    }
}
