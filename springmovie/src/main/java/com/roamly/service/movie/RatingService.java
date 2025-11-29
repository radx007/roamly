package com.roamly.service.movie;

import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.rating.CreateRatingRequest;
import com.roamly.model.dto.rating.RatingDTO;
import com.roamly.model.dto.rating.UpdateRatingRequest;

import java.util.List;

public interface RatingService {
    RatingDTO createRating(Long userId, CreateRatingRequest request);
    RatingDTO updateRating(Long userId, Long ratingId, UpdateRatingRequest request);
    void deleteRating(Long userId, Long ratingId);
    RatingDTO getUserRatingForMovie(Long userId, Long movieId);
    List<RatingDTO> getUserRatings(Long userId);
    PagedResponse<RatingDTO> getMovieRatings(Long movieId, int page, int size);
}
