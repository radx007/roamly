package com.roamly.repository;

import com.roamly.model.entity.User;
import com.roamly.model.entity.Watchlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findByUser(User user);

    Page<Watchlist> findByIsPublicTrue(Pageable pageable);

    @Query("SELECT w FROM Watchlist w WHERE w.isPublic = true AND " +
            "(LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Watchlist> searchPublicWatchlists(@Param("query") String query, Pageable pageable);

    @Query("SELECT w FROM Watchlist w WHERE w.isPublic = true ORDER BY SIZE(w.items) DESC")
    Page<Watchlist> findPopularPublicWatchlists(Pageable pageable);
}
