package com.roamly.controller.movie;

import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.rating.CreateRatingRequest;
import com.roamly.model.dto.rating.RatingDTO;
import com.roamly.model.dto.rating.UpdateRatingRequest;
import com.roamly.security.SecurityUtils;
import com.roamly.service.movie.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingDTO>> createRating(
            @Valid @RequestBody CreateRatingRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        RatingDTO rating = ratingService.createRating(userId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(rating, "Rating created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RatingDTO>> updateRating(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRatingRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        RatingDTO rating = ratingService.updateRating(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success(rating, "Rating updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        ratingService.deleteRating(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Rating deleted successfully"));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<PagedResponse<RatingDTO>> getMovieRatings(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PagedResponse<RatingDTO> response = ratingService.getMovieRatings(movieId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/movie/{movieId}/my-rating")
    public ResponseEntity<ApiResponse<RatingDTO>> getMyRatingForMovie(
            @PathVariable Long movieId) {
        Long userId = securityUtils.getCurrentUserId();
        RatingDTO rating = ratingService.getUserRatingForMovie(userId, movieId);
        return ResponseEntity.ok(ApiResponse.success(rating));
    }

    @GetMapping("/my-ratings")
    public ResponseEntity<ApiResponse<List<RatingDTO>>> getMyRatings() {
        Long userId = securityUtils.getCurrentUserId();
        List<RatingDTO> ratings = ratingService.getUserRatings(userId);
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }
}
