package com.roamly.service.admin;

import com.roamly.exception.BadRequestException;
import com.roamly.exception.ResourceNotFoundException;
import com.roamly.model.dto.admin.TMDBSearchResultDTO;
import com.roamly.model.dto.movie.CreateMovieRequest;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.UpdateMovieRequest;
import com.roamly.model.entity.Movie;
import com.roamly.repository.MovieRepository;
import com.roamly.service.external.TMDBService;
import com.roamly.service.external.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminMovieServiceImpl implements AdminMovieService {

    private final MovieRepository movieRepository;
    private final TMDBService tmdbService;
    private final YouTubeService youtubeService;

    @Override
    public TMDBSearchResultDTO searchTMDB(String query, int page) {
        Map<String, Object> response = tmdbService.searchMovies(query, page);

        return TMDBSearchResultDTO.builder()
                .results((List<Map<String, Object>>) response.get("results"))
                .page((Integer) response.get("page"))
                .totalPages((Integer) response.get("total_pages"))
                .totalResults((Integer) response.get("total_results"))
                .build();
    }

    @Override
    @Transactional
    public MovieDTO importMovieFromTMDB(int tmdbId) {
        // Check if movie already exists
        Optional<Movie> existingMovie = movieRepository.findByTmdbId(tmdbId);
        if (existingMovie.isPresent()) {
            throw new BadRequestException("Movie already exists in database");
        }

        // Fetch movie details from TMDB
        Map<String, Object> tmdbData = tmdbService.getMovieDetails(tmdbId);

        // Extract movie data
        String title = (String) tmdbData.get("title");
        String description = (String) tmdbData.get("overview");
        String releaseDateStr = (String) tmdbData.get("release_date");
        Integer runtime = (Integer) tmdbData.get("runtime");
        String posterPath = tmdbService.getFullPosterUrl((String) tmdbData.get("poster_path"));
        String backdropPath = tmdbService.getFullBackdropUrl((String) tmdbData.get("backdrop_path"));

        // Extract genres
        List<Map<String, Object>> genresData = (List<Map<String, Object>>) tmdbData.get("genres");
        List<String> genres = genresData.stream()
                .map(g -> (String) g.get("name"))
                .collect(Collectors.toList());

        // Extract cast
        Map<String, Object> credits = (Map<String, Object>) tmdbData.get("credits");
        List<Map<String, Object>> castData = (List<Map<String, Object>>) credits.get("cast");
        List<String> cast = castData.stream()
                .limit(10)
                .map(c -> (String) c.get("name"))
                .collect(Collectors.toList());

        // Extract directors
        List<Map<String, Object>> crewData = (List<Map<String, Object>>) credits.get("crew");
        List<String> directors = crewData.stream()
                .filter(c -> "Director".equals(c.get("job")))
                .map(c -> (String) c.get("name"))
                .collect(Collectors.toList());

        // Get trailer from YouTube
        int year = releaseDateStr != null && !releaseDateStr.isEmpty()
                ? Integer.parseInt(releaseDateStr.substring(0, 4))
                : 0;
        String trailerUrl = youtubeService.searchMovieTrailer(title, year);

        // Create movie entity
        Movie movie = Movie.builder()
                .tmdbId(tmdbId)
                .title(title)
                .description(description)
                .releaseDate(releaseDateStr != null && !releaseDateStr.isEmpty()
                        ? LocalDate.parse(releaseDateStr)
                        : null)
                .runtime(runtime)
                .posterPath(posterPath)
                .backdropPath(backdropPath)
                .trailerUrl(trailerUrl)
                .genres(genres)
                .cast(cast)
                .directors(directors)
                .build();

        movie = movieRepository.save(movie);
        return mapToDTO(movie);
    }

    @Override
    @Transactional
    public void bulkImportPopularMovies(int pages) {
        for (int page = 1; page <= pages; page++) {
            Map<String, Object> response = tmdbService.getPopularMovies(page);
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

            for (Map<String, Object> result : results) {
                Integer tmdbId = (Integer) result.get("id");

                // Skip if already exists
                if (movieRepository.findByTmdbId(tmdbId).isPresent()) {
                    continue;
                }

                try {
                    importMovieFromTMDB(tmdbId);
                    Thread.sleep(250); // Rate limiting
                } catch (Exception e) {
                    System.err.println("Error importing movie " + tmdbId + ": " + e.getMessage());
                }
            }
        }
    }

    @Override
    @Transactional
    public MovieDTO createMovie(CreateMovieRequest request) {
        Movie movie = Movie.builder()
                .tmdbId(request.getTmdbId())
                .title(request.getTitle())
                .description(request.getDescription())
                .releaseDate(request.getReleaseDate())
                .runtime(request.getRuntime())
                .posterPath(request.getPosterPath())
                .backdropPath(request.getBackdropPath())
                .trailerUrl(request.getTrailerUrl())
                .genres(request.getGenres())
                .cast(request.getCast())
                .directors(request.getDirectors())
                .build();

        movie = movieRepository.save(movie);
        return mapToDTO(movie);
    }

    @Override
    @Transactional
    public MovieDTO updateMovie(Long movieId, UpdateMovieRequest request) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        if (request.getTitle() != null) {
            movie.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            movie.setDescription(request.getDescription());
        }
        if (request.getReleaseDate() != null) {
            movie.setReleaseDate(request.getReleaseDate());
        }
        if (request.getRuntime() != null) {
            movie.setRuntime(request.getRuntime());
        }
        if (request.getPosterPath() != null) {
            movie.setPosterPath(request.getPosterPath());
        }
        if (request.getBackdropPath() != null) {
            movie.setBackdropPath(request.getBackdropPath());
        }
        if (request.getTrailerUrl() != null) {
            movie.setTrailerUrl(request.getTrailerUrl());
        }
        if (request.getGenres() != null) {
            movie.setGenres(request.getGenres());
        }
        if (request.getCast() != null) {
            movie.setCast(request.getCast());
        }
        if (request.getDirectors() != null) {
            movie.setDirectors(request.getDirectors());
        }
        if (request.getIsFeatured() != null) {
            movie.setFeatured(request.getIsFeatured());
        }

        movie = movieRepository.save(movie);
        return mapToDTO(movie);
    }

    @Override
    @Transactional
    public void deleteMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        movieRepository.delete(movie);
    }

    @Override
    @Transactional
    public void toggleFeaturedMovie(Long movieId, boolean featured) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        movie.setFeatured(featured);
        movieRepository.save(movie);
    }

    private MovieDTO mapToDTO(Movie movie) {
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
}
