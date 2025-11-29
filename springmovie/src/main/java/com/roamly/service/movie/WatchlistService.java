package com.roamly.service.movie;

import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.watchlist.*;

import java.util.List;

public interface WatchlistService {

    List<WatchlistDTO> getUserWatchlists(Long userId);

    WatchlistDetailDTO getWatchlistById(Long userId, Long watchlistId);

    WatchlistDTO createWatchlist(Long userId, CreateWatchlistRequest request);

    WatchlistDTO updateWatchlist(Long userId, Long watchlistId, UpdateWatchlistRequest request);

    void deleteWatchlist(Long userId, Long watchlistId);

    void addMovieToWatchlist(Long userId, Long watchlistId, Long movieId);

    void removeMovieFromWatchlist(Long userId, Long watchlistId, Long movieId);

    String generateWatchlistQRCode(Long watchlistId);

    PagedResponse<WatchlistDTO> getPublicWatchlists(int page, int size);

    PagedResponse<WatchlistDTO> searchPublicWatchlists(String query, int page, int size);

    PagedResponse<WatchlistDTO> getPopularWatchlists(int page, int size);

    WatchlistDetailDTO getPublicWatchlistById(Long watchlistId);
}
