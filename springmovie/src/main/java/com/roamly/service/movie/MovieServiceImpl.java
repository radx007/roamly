package com.roamly.service.movie;

import com.roamly.exception.ResourceNotFoundException;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.common.StatsDTO;
import com.roamly.model.dto.movie.ActorDTO;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.MovieDetailsDTO;
import com.roamly.model.dto.movie.StreamingProviderDTO;
import com.roamly.model.entity.Movie;
import com.roamly.model.entity.Rating;
import com.roamly.model.entity.User;
import com.roamly.repository.MovieRepository;
import com.roamly.repository.RatingRepository;
import com.roamly.repository.UserRepository;
import com.roamly.service.external.TMDBService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final TMDBService tmdbService;

    @Override
    public PagedResponse<MovieDTO> browseMovies(int page, int size, String genre, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, sortBy != null ? sortBy : "rating");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Movie> moviePage;
        if (genre != null && !genre.isEmpty()) {
            moviePage = movieRepository.findByGenresContaining(genre, pageable);
        } else {
            moviePage = movieRepository.findAll(pageable);
        }

        List<MovieDTO> content = moviePage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<MovieDTO>builder()
                .content(content)
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .last(moviePage.isLast())
                .build();
    }

    @Override
    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return mapToDTO(movie);
    }

    @Override
    public List<MovieDTO> getFeaturedMovies() {
        return movieRepository.findByIsFeaturedTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieDTO> getPopularMovies(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return movieRepository.findMostPopularMovies(pageable).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PagedResponse<MovieDTO> searchMovies(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.searchByTitle(query, pageable);

        List<MovieDTO> content = moviePage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<MovieDTO>builder()
                .content(content)
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .last(moviePage.isLast())
                .build();
    }

    @Override
    public List<MovieDTO> getRecommendations(Long userId) {
        try {
            // If userId is null, get current authenticated user
            if (userId == null) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated()
                        || "anonymousUser".equals(authentication.getName())) {
                    return getDefaultRecommendations();
                }

                String username = authentication.getName();
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isEmpty()) {
                    return getDefaultRecommendations();
                }
                userId = userOpt.get().getId();
            }

            // Validate userId is not null after all checks
            if (userId == null) {
                return getDefaultRecommendations();
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Get user's rated movies with null checks
            List<Rating> userRatings = ratingRepository.findByUser(user);
            if (userRatings == null || userRatings.isEmpty()) {
                return getDefaultRecommendations();
            }

            // Get rated movie IDs with null safety
            Set<Long> ratedMovieIds = userRatings.stream()
                    .filter(Objects::nonNull)
                    .map(Rating::getMovie)
                    .filter(Objects::nonNull)
                    .map(Movie::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            // Get user's favorite genres
            List<String> favoriteGenres = user.getFavoriteGenres();

            if (favoriteGenres == null || favoriteGenres.isEmpty()) {
                // Extract genres from highly rated movies (rating >= 7)
                favoriteGenres = userRatings.stream()
                        .filter(Objects::nonNull)
                        .filter(r -> r.getRatingValue() != null && r.getRatingValue() >= 7)
                        .map(Rating::getMovie)
                        .filter(Objects::nonNull)
                        .map(Movie::getGenres)
                        .filter(Objects::nonNull)
                        .flatMap(List::stream)
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());
            }

            if (favoriteGenres.isEmpty()) {
                return getDefaultRecommendations();
            }

            // Find movies with matching genres that user hasn't rated
            List<Movie> recommendations = new ArrayList<>();
            for (String genre : favoriteGenres) {
                if (genre == null || genre.isEmpty()) {
                    continue;
                }

                Pageable pageable = PageRequest.of(0, 10);
                Page<Movie> movies = movieRepository.findByGenresContaining(genre, pageable);

                if (movies != null && movies.hasContent()) {
                    recommendations.addAll(movies.getContent().stream()
                            .filter(Objects::nonNull)
                            .filter(m -> m.getId() != null)
                            .filter(m -> !ratedMovieIds.contains(m.getId()))
                            .collect(Collectors.toList()));
                }
            }

            if (recommendations.isEmpty()) {
                return getDefaultRecommendations();
            }

            // Remove duplicates, sort by rating, and limit to 20
            return recommendations.stream()
                    .filter(Objects::nonNull)
                    .distinct()
                    .sorted(Comparator.comparing(
                            Movie::getRating,
                            Comparator.nullsLast(Comparator.reverseOrder())
                    ))
                    .limit(20)
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            // Log error and return default recommendations
            System.err.println("Error getting recommendations: " + e.getMessage());
            return getDefaultRecommendations();
        }
    }

    /**
     * Returns default recommendations (popular movies) when personalized recommendations fail
     */
    private List<MovieDTO> getDefaultRecommendations() {
        try {
            Pageable pageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "rating", "voteCount"));
            return movieRepository.findAll(pageable).getContent().stream()
                    .filter(Objects::nonNull)
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // If even default recommendations fail, return empty list
            return new ArrayList<>();
        }
    }

    private MovieDTO mapToDTO(Movie movie) {
        if (movie == null) {
            return null;
        }

        return MovieDTO.builder()
                .id(movie.getId())
                .tmdbId(movie.getTmdbId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .runtime(movie.getRuntime())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .trailerUrl(movie.getTrailerUrl())
                .rating(movie.getRating())
                .voteCount(movie.getVoteCount())
                .isFeatured(movie.isFeatured())
                .genres(movie.getGenres())
                .cast(movie.getCast())
                .directors(movie.getDirectors())
                .build();
    }

    // ADD THIS METHOD TO MovieServiceImpl.java

    @Override
    @Transactional
    public MovieDTO toggleFeatured(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        // Toggle the featured status
        movie.setFeatured(!movie.isFeatured());

        movie = movieRepository.save(movie);

        System.out.println("Movie '" + movie.getTitle() + "' featured status: " + movie.isFeatured());

        return mapToDTO(movie);
    }
// ========== ADD THESE 3 METHODS ==========

    @Override
    public PagedResponse<MovieDTO> getAllMovies(int page, int size, String sort) {
        Sort sorting = Sort.by(Sort.Direction.DESC, sort != null ? sort : "rating");
        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<Movie> moviePage = movieRepository.findAll(pageable);

        List<MovieDTO> content = moviePage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<MovieDTO>builder()
                .content(content)
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .last(moviePage.isLast())
                .build();
    }

    @Override
    public MovieDetailsDTO getMovieDetails(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        // Get cast from TMDB
        List<ActorDTO> cast = new ArrayList<>();
        List<StreamingProviderDTO> providers = new ArrayList<>();
        String watchLink = null;

        if (movie.getTmdbId() != null && tmdbService != null) {
            try {
                cast = tmdbService.getMovieCast(movie.getTmdbId());
                providers = tmdbService.getStreamingProviders(movie.getTmdbId(), "US");
                watchLink = tmdbService.getWatchLink(movie.getTmdbId(), "US");
            } catch (Exception e) {
                System.err.println("Error fetching TMDB data: " + e.getMessage());
            }
        }

        return MovieDetailsDTO.builder()
                .id(movie.getId())
                .tmdbId(movie.getTmdbId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .runtime(movie.getRuntime())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .trailerUrl(movie.getTrailerUrl())
                .rating(movie.getRating())
                .voteCount(movie.getVoteCount())
                .isFeatured(movie.isFeatured())
                .genres(movie.getGenres())
                .directors(movie.getDirectors())
                .cast(cast)
                .streamingProviders(providers)
                .watchLink(watchLink)
                .build();
    }

    @Override
    public StatsDTO getPublicStats() {
        long totalMovies = movieRepository.count();
        long totalUsers = userRepository.count();
        long totalRatings = ratingRepository.count();

        return StatsDTO.builder()
                .totalMovies(totalMovies)
                .totalUsers(totalUsers)
                .totalRatings(totalRatings)
                .build();
    }

}
