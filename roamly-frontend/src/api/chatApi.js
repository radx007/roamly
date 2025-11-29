import axios from './axios';

export const chatApi = {
  sendMessage: (data) => axios.post('/chat/message', data),
};
