package com.roamly.service.admin;

import com.roamly.model.dto.admin.AnalyticsDTO;
import com.roamly.repository.MovieRepository;
import com.roamly.repository.RatingRepository;
import com.roamly.repository.UserRepository;
import com.roamly.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;
    private final WatchlistRepository watchlistRepository;

    @Override
    public AnalyticsDTO getOverview() {
        long totalUsers = userRepository.count();
        long totalMovies = movieRepository.count();
        long totalRatings = ratingRepository.count();
        long totalWatchlists = watchlistRepository.count();

        // Calculate average rating across all movies
        double averageRating = movieRepository.findAll().stream()
                .mapToDouble(movie -> movie.getRating() != null ? movie.getRating() : 0.0)
                .average()
                .orElse(0.0);

        return AnalyticsDTO.builder()
                .totalUsers(totalUsers)
                .totalMovies(totalMovies)
                .totalRatings(totalRatings)
                .totalWatchlists(totalWatchlists)
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .build();
    }
}
