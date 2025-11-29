package com.roamly.service.movie;

import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.common.StatsDTO;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.MovieDetailsDTO;

import java.util.List;

public interface MovieService {
    PagedResponse<MovieDTO> browseMovies(int page, int size, String genre, String sortBy);
    MovieDTO getMovieById(Long id);
    List<MovieDTO> getFeaturedMovies();
    List<MovieDTO> getPopularMovies(int limit);
    PagedResponse<MovieDTO> searchMovies(String query, int page, int size);
    List<MovieDTO> getRecommendations(Long userId);
    // ADD THIS TO MovieService.java interface
    MovieDTO toggleFeatured(Long movieId);

    PagedResponse<MovieDTO> getAllMovies(int page, int size, String sort);
    MovieDetailsDTO getMovieDetails(Long id);

    StatsDTO getPublicStats();


}
