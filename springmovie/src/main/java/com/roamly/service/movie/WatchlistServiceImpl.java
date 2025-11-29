package com.roamly.service.movie;

import com.roamly.exception.ForbiddenException;
import com.roamly.exception.ResourceNotFoundException;
import com.roamly.model.dto.common.PagedResponse;
import com.roamly.model.dto.movie.MovieDTO;
import com.roamly.model.dto.watchlist.*;
import com.roamly.model.entity.Movie;
import com.roamly.model.entity.User;
import com.roamly.model.entity.Watchlist;
import com.roamly.model.entity.WatchlistItem;
import com.roamly.repository.MovieRepository;
import com.roamly.repository.UserRepository;
import com.roamly.repository.WatchlistItemRepository;
import com.roamly.repository.WatchlistRepository;
import com.roamly.util.QRCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final WatchlistItemRepository watchlistItemRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final QRCodeUtil qrCodeUtil;

    @Override
    public List<WatchlistDTO> getUserWatchlists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return watchlistRepository.findByUser(user).stream()
                .filter(Objects::nonNull)
                .map(this::mapToDTO)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public WatchlistDetailDTO getWatchlistById(Long userId, Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.isPublic() && !watchlist.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You don't have access to this watchlist");
        }

        return mapToDetailDTO(watchlist);
    }

    @Override
    @Transactional
    public WatchlistDTO createWatchlist(Long userId, CreateWatchlistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .isPublic(request.isPublic())
                .items(new ArrayList<>())
                .build();

        watchlist = watchlistRepository.save(watchlist);
        return mapToDTO(watchlist);
    }

    @Override
    @Transactional
    public WatchlistDTO updateWatchlist(Long userId, Long watchlistId, UpdateWatchlistRequest request) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only update your own watchlists");
        }

        if (request.getName() != null) {
            watchlist.setName(request.getName());
        }
        if (request.getDescription() != null) {
            watchlist.setDescription(request.getDescription());
        }
        if (request.getIsPublic() != null) {
            watchlist.setPublic(request.getIsPublic());
        }

        watchlist = watchlistRepository.save(watchlist);
        return mapToDTO(watchlist);
    }

    @Override
    @Transactional
    public void deleteWatchlist(Long userId, Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own watchlists");
        }

        watchlistRepository.delete(watchlist);
    }

    @Override
    @Transactional
    public void addMovieToWatchlist(Long userId, Long watchlistId, Long movieId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own watchlists");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        if (watchlistItemRepository.existsByWatchlistAndMovie(watchlist, movie)) {
            return;
        }

        WatchlistItem item = WatchlistItem.builder()
                .watchlist(watchlist)
                .movie(movie)
                .build();

        watchlistItemRepository.save(item);
    }

    @Override
    @Transactional
    public void removeMovieFromWatchlist(Long userId, Long watchlistId, Long movieId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own watchlists");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        watchlistItemRepository.deleteByWatchlistAndMovie(watchlist, movie);
    }

    @Override
    public String generateWatchlistQRCode(Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.isPublic()) {
            throw new ForbiddenException("Cannot generate QR code for private watchlist");
        }

        String watchlistUrl = "http://localhost:3000/watchlist/" + watchlistId;

        try {
            return qrCodeUtil.generateQRCodeBase64(watchlistUrl);
        } catch (Exception e) {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        }
    }

    @Override
    public PagedResponse<WatchlistDTO> getPublicWatchlists(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Watchlist> watchlistPage = watchlistRepository.findByIsPublicTrue(pageable);

        List<WatchlistDTO> content = watchlistPage.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::mapToDTO)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return PagedResponse.<WatchlistDTO>builder()
                .content(content)
                .page(watchlistPage.getNumber())
                .size(watchlistPage.getSize())
                .totalElements(watchlistPage.getTotalElements())
                .totalPages(watchlistPage.getTotalPages())
                .last(watchlistPage.isLast())
                .build();
    }

    @Override
    public PagedResponse<WatchlistDTO> searchPublicWatchlists(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Watchlist> watchlistPage = watchlistRepository.searchPublicWatchlists(query, pageable);

        List<WatchlistDTO> content = watchlistPage.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::mapToDTO)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return PagedResponse.<WatchlistDTO>builder()
                .content(content)
                .page(watchlistPage.getNumber())
                .size(watchlistPage.getSize())
                .totalElements(watchlistPage.getTotalElements())
                .totalPages(watchlistPage.getTotalPages())
                .last(watchlistPage.isLast())
                .build();
    }

    @Override
    public PagedResponse<WatchlistDTO> getPopularWatchlists(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Watchlist> watchlistPage = watchlistRepository.findPopularPublicWatchlists(pageable);

        List<WatchlistDTO> content = watchlistPage.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::mapToDTO)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return PagedResponse.<WatchlistDTO>builder()
                .content(content)
                .page(watchlistPage.getNumber())
                .size(watchlistPage.getSize())
                .totalElements(watchlistPage.getTotalElements())
                .totalPages(watchlistPage.getTotalPages())
                .last(watchlistPage.isLast())
                .build();
    }

    @Override
    public WatchlistDetailDTO getPublicWatchlistById(Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        if (!watchlist.isPublic()) {
            throw new ForbiddenException("This watchlist is private");
        }

        return mapToDetailDTO(watchlist);
    }

    private WatchlistDTO mapToDTO(Watchlist watchlist) {
        if (watchlist == null) {
            return null;
        }

        return WatchlistDTO.builder()
                .id(watchlist.getId())
                .name(watchlist.getName())
                .description(watchlist.getDescription())
                .isPublic(watchlist.isPublic())
                .movieCount(watchlist.getItems() != null ? watchlist.getItems().size() : 0)
                .createdAt(watchlist.getCreatedAt())
                .updatedAt(watchlist.getUpdatedAt())
                .build();
    }


    private WatchlistDetailDTO mapToDetailDTO(Watchlist watchlist) {
        if (watchlist == null) {
            return null;
        }

        List<MovieDTO> movies = new ArrayList<>();

        if (watchlist.getItems() != null) {
            movies = watchlist.getItems().stream()
                    .filter(Objects::nonNull)
                    .map(WatchlistItem::getMovie)
                    .filter(Objects::nonNull)
                    .map(this::mapMovieToDTO)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        // DEBUG: Print to backend console
        Long ownerId = watchlist.getUser() != null ? watchlist.getUser().getId() : null;
        String ownerName = watchlist.getUser() != null ? watchlist.getUser().getUsername() : null;
        System.out.println("DEBUG - Watchlist ID: " + watchlist.getId() + ", Owner ID: " + ownerId + ", Owner Name: " + ownerName);

        return WatchlistDetailDTO.builder()
                .id(watchlist.getId())
                .name(watchlist.getName())
                .description(watchlist.getDescription())
                .isPublic(watchlist.isPublic())
                .movies(movies)
                .createdAt(watchlist.getCreatedAt())
                .userId(ownerId)      // ← ADD THIS
                .username(ownerName)  // ← ADD THIS
                .build();
    }


    private MovieDTO mapMovieToDTO(Movie movie) {
        if (movie == null) {
            return null;
        }

        return MovieDTO.builder()
                .id(movie.getId())
                .tmdbId(movie.getTmdbId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .runtime(movie.getRuntime())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .rating(movie.getRating())
                .voteCount(movie.getVoteCount())
                .genres(movie.getGenres())
                .cast(movie.getCast())
                .directors(movie.getDirectors())
                .isFeatured(movie.isFeatured())
                .trailerUrl(movie.getTrailerUrl())
                .build();
    }
}
