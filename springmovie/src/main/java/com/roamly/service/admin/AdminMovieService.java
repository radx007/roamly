package com.roamly.service.admin;

import com.roamly.model.dto.admin.TMDBSearchResultDTO;
import com.roamly.model.dto.movie.CreateMovieRequest;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.movie.UpdateMovieRequest;

public interface AdminMovieService {
    TMDBSearchResultDTO searchTMDB(String query, int page);
    MovieDTO importMovieFromTMDB(int tmdbId);
    void bulkImportPopularMovies(int pages);
    MovieDTO createMovie(CreateMovieRequest request);
    MovieDTO updateMovie(Long movieId, UpdateMovieRequest request);
    void deleteMovie(Long movieId);
    void toggleFeaturedMovie(Long movieId, boolean featured);
}
