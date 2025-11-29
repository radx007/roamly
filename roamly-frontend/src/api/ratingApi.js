import axios from './axios';

export const ratingApi = {
  // Create rating
  createRating: (data) => axios.post('/ratings', data),
  
  // Update existing rating
  updateRating: (id, data) => axios.put(`/ratings/${id}`, data),
  
  // Delete rating
  deleteRating: (id) => axios.delete(`/ratings/${id}`),
  
  // Get my rating for a specific movie
  // Returns null if not rated yet - this is EXPECTED
  getMyRatingForMovie: (movieId) => 
    axios.get(`/ratings/movie/${movieId}/my-rating`)
      .then(res => res)
      .catch(err => {
        // 404 or 401 means no rating exists - this is OK
        if (err.response?.status === 404 || err.response?.status === 401) {
          return { data: { data: null } };
        }
        throw err;
      }),
  
  // Get all ratings for a movie (with pagination)
  getMovieRatings: (movieId, page = 0, size = 10) => 
    axios.get(`/ratings/movie/${movieId}`, { 
      params: { page, size } 
    }),
  
  // Get all my ratings
  getMyRatings: () => axios.get('/ratings/my-ratings'),
};
