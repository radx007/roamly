import axios from './axios';

export const profileApi = {
  getProfile: () => axios.get('/profile'),
  updateProfile: (data) => axios.put('/profile', data),
};
