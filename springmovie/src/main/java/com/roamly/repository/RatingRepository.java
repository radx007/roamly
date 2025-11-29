package com.roamly.repository;

import com.roamly.model.entity.Movie;
import com.roamly.model.entity.Rating;
import com.roamly.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndMovie(User user, Movie movie);
    List<Rating> findByUser(User user);
    Page<Rating> findByMovie(Movie movie, Pageable pageable);

    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.movie = :movie")
    Double calculateAverageRating(Movie movie);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.movie = :movie")
    Integer countByMovie(Movie movie);
}
