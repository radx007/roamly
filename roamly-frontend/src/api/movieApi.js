import axios from './axios';

export const movieApi = {
  // Browse/Get all movies with pagination
  getAllMovies: (page = 0, size = 20, sort = 'rating') =>
    axios.get('/movies', { params: { page, size, sortBy: sort } }),

  // Browse with filters
  browseMovies: (page = 0, size = 20, genre = null, sortBy = 'rating') =>
    axios.get('/movies', {
      params: {
        page,
        size,
        ...(genre && { genre }),
        sortBy,
      },
    }),

  // Get single movie by ID
  getMovieById: (id) => axios.get(`/movies/${id}`),

  // Search movies
  searchMovies: (query, page = 0, size = 20) =>
    axios.get('/movies/search', { params: { query, page, size } }),

  // Get featured movies
  getFeaturedMovies: () => axios.get('/movies/featured'),

  // Get popular movies
  getPopularMovies: (limit = 10) =>
    axios.get('/movies/popular', { params: { limit } }),

  // Get recommendations (authenticated)
  getRecommendations: () => axios.get('/movies/recommendations'),

  // NEW: Get movie with cast and streaming providers
  getMovieDetails: (id) => axios.get(`/movies/${id}/details`),
  getPublicStats: () => axios.get('/movies/stats'),
};
