package com.roamly.controller.admin;

import com.roamly.model.dto.admin.TMDBSearchResultDTO;
import com.roamly.model.dto.common.ApiResponse;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.service.admin.AdminMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tmdb")
@RequiredArgsConstructor
public class AdminTMDBController {

    private final AdminMovieService adminMovieService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<TMDBSearchResultDTO>> searchTMDB(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        TMDBSearchResultDTO results = adminMovieService.searchTMDB(query, page);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping("/import/{tmdbId}")
    public ResponseEntity<ApiResponse<MovieDTO>> importMovie(@PathVariable int tmdbId) {
        MovieDTO movie = adminMovieService.importMovieFromTMDB(tmdbId);
        return ResponseEntity.ok(ApiResponse.success(movie, "Movie imported successfully"));
    }

    @PostMapping("/bulk-import")
    public ResponseEntity<ApiResponse<Void>> bulkImportPopularMovies(
            @RequestParam(defaultValue = "5") int pages) {
        adminMovieService.bulkImportPopularMovies(pages);
        return ResponseEntity.ok(ApiResponse.success(null, "Bulk import started"));
    }
}
