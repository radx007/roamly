package com.roamly.service.movie;

import com.roamly.exception.BadRequestException;
import com.roamly.exception.ForbiddenException;
import com.roamly.exception.ResourceNotFoundException;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.rating.CreateRatingRequest;
import com.roamly.model.dto.rating.RatingDTO;
import com.roamly.model.dto.rating.UpdateRatingRequest;
import com.roamly.model.entity.Movie;
import com.roamly.model.entity.Rating;
import com.roamly.model.entity.User;
import com.roamly.repository.MovieRepository;
import com.roamly.repository.RatingRepository;
import com.roamly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RatingDTO createRating(Long userId, CreateRatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        // Check if user already rated this movie
        if (ratingRepository.findByUserAndMovie(user, movie).isPresent()) {
            throw new BadRequestException("You have already rated this movie");
        }

        // Create rating
        Rating rating = Rating.builder()
                .user(user)
                .movie(movie)
                .ratingValue(request.getRatingValue())
                .reviewText(request.getReviewText())
                .spoilerTagged(request.isSpoilerTagged())
                .sentiment(determineSentiment(request.getRatingValue()))
                .build();

        rating = ratingRepository.save(rating);

        // Update movie rating
        updateMovieRating(movie);

        return mapToDTO(rating);
    }

    @Override
    @Transactional
    public RatingDTO updateRating(Long userId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only update your own ratings");
        }

        if (request.getRatingValue() != null) {
            rating.setRatingValue(request.getRatingValue());
            rating.setSentiment(determineSentiment(request.getRatingValue()));
        }
        if (request.getReviewText() != null) {
            rating.setReviewText(request.getReviewText());
        }
        if (request.getSpoilerTagged() != null) {
            rating.setSpoilerTagged(request.getSpoilerTagged());
        }

        rating = ratingRepository.save(rating);

        // Update movie rating
        updateMovieRating(rating.getMovie());

        return mapToDTO(rating);
    }

    @Override
    @Transactional
    public void deleteRating(Long userId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own ratings");
        }

        Movie movie = rating.getMovie();
        ratingRepository.delete(rating);

        // Update movie rating
        updateMovieRating(movie);
    }

    @Override
    public RatingDTO getUserRatingForMovie(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        Rating rating = ratingRepository.findByUserAndMovie(user, movie)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        return mapToDTO(rating);
    }

    @Override
    public List<RatingDTO> getUserRatings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ratingRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PagedResponse<RatingDTO> getMovieRatings(Long movieId, int page, int size) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Rating> ratingPage = ratingRepository.findByMovie(movie, pageable);

        List<RatingDTO> content = ratingPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<RatingDTO>builder()
                .content(content)
                .page(ratingPage.getNumber())
                .size(ratingPage.getSize())
                .totalElements(ratingPage.getTotalElements())
                .totalPages(ratingPage.getTotalPages())
                .last(ratingPage.isLast())
                .build();
    }

    private void updateMovieRating(Movie movie) {
        Double avgRating = ratingRepository.calculateAverageRating(movie);
        Integer voteCount = ratingRepository.countByMovie(movie);

        movie.setRating(avgRating != null ? avgRating : 0.0);
        movie.setVoteCount(voteCount != null ? voteCount : 0);

        movieRepository.save(movie);
    }

    private Rating.Sentiment determineSentiment(int ratingValue) {
        if (ratingValue >= 7) {
            return Rating.Sentiment.POSITIVE;
        } else if (ratingValue >= 4) {
            return Rating.Sentiment.NEUTRAL;
        } else {
            return Rating.Sentiment.NEGATIVE;
        }
    }

    private RatingDTO mapToDTO(Rating rating) {
        return RatingDTO.builder()
                .id(rating.getId())
                .userId(rating.getUser().getId())
                .username(rating.getUser().getUsername())
                .movieId(rating.getMovie().getId())
                .movieTitle(rating.getMovie().getTitle())
                .ratingValue(rating.getRatingValue())
                .reviewText(rating.getReviewText())
                .spoilerTagged(rating.isSpoilerTagged())
                .sentiment(rating.getSentiment().name())
                .helpfulCount(rating.getHelpfulCount())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
