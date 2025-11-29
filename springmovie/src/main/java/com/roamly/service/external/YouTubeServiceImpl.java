package com.roamly.service.external;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YouTubeServiceImpl implements YouTubeService {

    private final RestTemplate restTemplate;

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${youtube.api.base-url}")
    private String baseUrl;

    @Override
    public String searchMovieTrailer(String movieTitle, int year) {
        String searchQuery = movieTitle + " " + year + " official trailer";

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search")
                .queryParam("key", apiKey)
                .queryParam("q", searchQuery)
                .queryParam("part", "snippet")
                .queryParam("type", "video")
                .queryParam("maxResults", 1)
                .toUriString();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

            if (items != null && !items.isEmpty()) {
                Map<String, Object> firstItem = items.get(0);
                Map<String, Object> id = (Map<String, Object>) firstItem.get("id");
                String videoId = (String) id.get("videoId");
                return "https://www.youtube.com/watch?v=" + videoId;
            }
        } catch (Exception e) {
            System.err.println("Error fetching YouTube trailer: " + e.getMessage());
        }

        return null;
    }

    @Override
    public String getEmbedUrl(String videoUrl) {
        if (videoUrl == null || videoUrl.isEmpty()) {
            return null;
        }

        // Extract video ID from URL
        String videoId;
        if (videoUrl.contains("watch?v=")) {
            videoId = videoUrl.substring(videoUrl.lastIndexOf("=") + 1);
        } else if (videoUrl.contains("youtu.be/")) {
            videoId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
        } else {
            return null;
        }

        return "https://www.youtube.com/embed/" + videoId;
    }
}
