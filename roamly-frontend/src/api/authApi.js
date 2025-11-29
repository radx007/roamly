import axios from './axios';

export const authApi = {
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
  logout: () => axios.post('/auth/logout'),
  refreshToken: (refreshToken) => axios.post('/auth/refresh', { refreshToken }),  // ✅ Already correct
};
