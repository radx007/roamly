package com.roamly.repository;

import com.roamly.model.entity.Movie;
import com.roamly.model.entity.Watchlist;
import com.roamly.model.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    Optional<WatchlistItem> findByWatchlistAndMovie(Watchlist watchlist, Movie movie);
    boolean existsByWatchlistAndMovie(Watchlist watchlist, Movie movie);
    void deleteByWatchlistAndMovie(Watchlist watchlist, Movie movie);
}
