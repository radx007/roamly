package com.roamly.service.external;

public interface YouTubeService {
    String searchMovieTrailer(String movieTitle, int year);
    String getEmbedUrl(String videoUrl);
}
