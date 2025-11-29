import axios from './axios';

export const adminApi = {
  // Users
  getAllUsers: (page = 0, size = 20) => axios.get('/admin/users', { params: { page, size } }),
  getUserById: (id) => axios.get(`/admin/users/${id}`),
  banUser: (id, reason) => axios.post(`/admin/users/${id}/ban`, { reason }),
  unbanUser: (id) => axios.post(`/admin/users/${id}/unban`),
  deleteUser: (id) => axios.delete(`/admin/users/${id}`),

  // Movies - ADMIN CRUD
  createMovie: (data) => axios.post('/admin/movies', data),
  updateMovie: (id, data) => axios.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => axios.delete(`/admin/movies/${id}`),
  
  // Toggle featured - FIXED
  toggleFeatured: (id) => axios.patch(`/movies/${id}/featured`),

  // TMDB Import
  searchTMDB: (query, page = 1) => axios.get('/admin/tmdb/search', { params: { query, page } }),
  importMovie: (tmdbId) => axios.post(`/admin/tmdb/import/${tmdbId}`),
  bulkImport: (pages = 5) => axios.post('/admin/tmdb/bulk-import', null, { params: { pages } }),

  // Analytics
  getAnalytics: () => axios.get('/admin/analytics/overview'),
};
