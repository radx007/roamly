package com.roamly.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roamly.model.dto.movie.ActorDTO;
import com.roamly.model.dto.movie.StreamingProviderDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TMDBServiceImpl implements TMDBService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    @Value("${tmdb.api.image-base-url}")
    private String imageBaseUrl;

    @Override
    public Map<String, Object> searchMovies(String query, int page) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("page", page)
                .queryParam("language", "en-US")
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    public Map<String, Object> getMovieDetails(int tmdbId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + tmdbId)
                .queryParam("api_key", apiKey)
                .queryParam("append_to_response", "credits,videos")
                .queryParam("language", "en-US")
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    public Map<String, Object> getPopularMovies(int page) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/popular")
                .queryParam("api_key", apiKey)
                .queryParam("page", page)
                .queryParam("language", "en-US")
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    public Map<String, Object> getTrendingMovies(String timeWindow) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/trending/movie/" + timeWindow)
                .queryParam("api_key", apiKey)
                .queryParam("language", "en-US")
                .toUriString();

        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    public String getFullPosterUrl(String posterPath) {
        if (posterPath == null || posterPath.isEmpty()) {
            return null;
        }
        return imageBaseUrl + "/w500" + posterPath;
    }

    @Override
    public String getFullBackdropUrl(String backdropPath) {
        if (backdropPath == null || backdropPath.isEmpty()) {
            return null;
        }
        return imageBaseUrl + "/original" + backdropPath;
    }

    // ========== NEW METHODS ==========

    @Override
    public List<ActorDTO> getMovieCast(Integer tmdbId) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + tmdbId + "/credits")
                .queryParam("api_key", apiKey)
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode castArray = root.get("cast");

            List<ActorDTO> actors = new ArrayList<>();

            if (castArray != null && castArray.isArray()) {
                for (int i = 0; i < Math.min(10, castArray.size()); i++) { // Top 10 actors
                    JsonNode actor = castArray.get(i);
                    actors.add(ActorDTO.builder()
                            .id(actor.get("id").asInt())
                            .name(actor.get("name").asText())
                            .character(actor.has("character") ? actor.get("character").asText() : null)
                            .profilePath(actor.has("profile_path") && !actor.get("profile_path").isNull()
                                    ? actor.get("profile_path").asText()
                                    : null)
                            .order(actor.has("order") ? actor.get("order").asInt() : i)
                            .build());
                }
            }

            return actors;
        } catch (Exception e) {
            System.err.println("Error fetching cast for movie " + tmdbId + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<StreamingProviderDTO> getStreamingProviders(Integer tmdbId, String region) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + tmdbId + "/watch/providers")
                .queryParam("api_key", apiKey)
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("results");

            List<StreamingProviderDTO> providers = new ArrayList<>();

            if (results != null && results.has(region)) {
                JsonNode regionData = results.get(region);

                // Flatrate (streaming subscription)
                if (regionData.has("flatrate")) {
                    JsonNode flatrate = regionData.get("flatrate");
                    for (JsonNode provider : flatrate) {
                        providers.add(StreamingProviderDTO.builder()
                                .providerName(provider.get("provider_name").asText())
                                .logoPath(provider.has("logo_path") ? provider.get("logo_path").asText() : null)
                                .type("stream")
                                .build());
                    }
                }

                // Rent
                if (regionData.has("rent")) {
                    JsonNode rent = regionData.get("rent");
                    for (JsonNode provider : rent) {
                        providers.add(StreamingProviderDTO.builder()
                                .providerName(provider.get("provider_name").asText())
                                .logoPath(provider.has("logo_path") ? provider.get("logo_path").asText() : null)
                                .type("rent")
                                .build());
                    }
                }

                // Buy
                if (regionData.has("buy")) {
                    JsonNode buy = regionData.get("buy");
                    for (JsonNode provider : buy) {
                        providers.add(StreamingProviderDTO.builder()
                                .providerName(provider.get("provider_name").asText())
                                .logoPath(provider.has("logo_path") ? provider.get("logo_path").asText() : null)
                                .type("buy")
                                .build());
                    }
                }
            }

            return providers;
        } catch (Exception e) {
            System.err.println("Error fetching streaming providers for movie " + tmdbId + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public String getWatchLink(Integer tmdbId, String region) {
        return String.format("https://www.themoviedb.org/movie/%d/watch?locale=%s", tmdbId, region);
    }
}
