import axios from './axios';

export const watchlistApi = {
  getMyWatchlists: () => axios.get('/watchlists'),
  
  getWatchlistById: (id) => axios.get(`/watchlists/${id}`),
  
  createWatchlist: (data) => axios.post('/watchlists', data),
  
  updateWatchlist: (id, data) => axios.put(`/watchlists/${id}`, data),
  
  deleteWatchlist: (id) => axios.delete(`/watchlists/${id}`),
  
  addMovie: (watchlistId, movieId) => 
    axios.post(`/watchlists/${watchlistId}/movies/${movieId}`),
  
  removeMovie: (watchlistId, movieId) => 
    axios.delete(`/watchlists/${watchlistId}/movies/${movieId}`),
  
  getQRCode: (watchlistId) => 
    axios.get(`/watchlists/${watchlistId}/qr-code`)
      .catch(() => ({ data: { data: null } })),
  
  getPublicWatchlists: (page = 0, size = 12) => 
    axios.get('/watchlists/public', { params: { page, size } }),
  
  searchPublicWatchlists: (query, page = 0, size = 12) => 
    axios.get('/watchlists/public/search', { params: { query, page, size } }),
  
  getPopularWatchlists: (page = 0, size = 12) => 
    axios.get('/watchlists/public/popular', { params: { page, size } }),
  
  getPublicWatchlistById: (id) => 
    axios.get(`/watchlists/public/${id}`),
};
