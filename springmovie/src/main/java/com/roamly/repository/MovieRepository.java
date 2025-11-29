package com.roamly.repository;

import com.roamly.model.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbId(Integer tmdbId);
    List<Movie> findByIsFeaturedTrue();

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Movie> searchByTitle(@Param("query") String query, Pageable pageable);

    Page<Movie> findByGenresContaining(String genre, Pageable pageable);

    @Query("SELECT m FROM Movie m ORDER BY m.rating DESC, m.voteCount DESC")
    List<Movie> findTopRatedMovies(Pageable pageable);

    @Query("SELECT m FROM Movie m ORDER BY m.voteCount DESC")
    List<Movie> findMostPopularMovies(Pageable pageable);
}
