import axios from './axios';

export const chatbotApi = {
  askQuestion: (question, conversationId) => 
    axios.post('/chatbot/ask', { 
      question,
      conversationId 
    }),
};
