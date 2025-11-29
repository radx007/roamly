package com.roamly.service.external;

import com.roamly.model.dto.movie.ActorDTO;
import com.roamly.model.dto.movie.StreamingProviderDTO;

import java.util.List;
import java.util.Map;

public interface TMDBService {
    Map<String, Object> searchMovies(String query, int page);
    Map<String, Object> getMovieDetails(int tmdbId);
    Map<String, Object> getPopularMovies(int page);
    Map<String, Object> getTrendingMovies(String timeWindow);
    String getFullPosterUrl(String posterPath);
    String getFullBackdropUrl(String backdropPath);

    // NEW: Actor/Cast methods
    List<ActorDTO> getMovieCast(Integer tmdbId);

    // NEW: Streaming providers
    List<StreamingProviderDTO> getStreamingProviders(Integer tmdbId, String region);

    // NEW: Watch link
    String getWatchLink(Integer tmdbId, String region);
}
