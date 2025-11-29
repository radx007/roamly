import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiX, FiMessageCircle, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { chatbotApi } from '../../api/chatbotApi';
import { toast } from 'react-toastify';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m your ROAMLY movie assistant. Ask me about our movies!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotApi.askQuestion(input, conversationId);
      const data = response.data.data;

      setConversationId(data.conversationId);

      const botMessage = {
        type: 'bot',
        text: data.answer,
        timestamp: new Date(),
        suggestedMovies: data.suggestedMovies || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to get response. Please try again.');

      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setIsOpen(false);
  };

  const getImageUrl = (posterPath) => {
    if (!posterPath) return 'https://via.placeholder.com/200x300?text=No+Image';
    if (posterPath.startsWith('http')) return posterPath;
    return `https://image.tmdb.org/t/p/w200${posterPath}`;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-red-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        {isOpen ? <FiX size={28} /> : <FiMessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[650px] bg-secondary rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-red-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiMessageCircle size={24} />
              <div>
                <h3 className="font-bold text-lg">ROAMLY Assistant</h3>
                <p className="text-xs text-white/80">Ask me about movies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-dark text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Movie Suggestions */}
                {message.suggestedMovies && message.suggestedMovies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestedMovies.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleMovieClick(movie.id)}
                        className="flex items-center space-x-3 bg-dark/50 p-2 rounded-lg cursor-pointer hover:bg-dark transition group"
                      >
                        <img
                          src={getImageUrl(movie.posterPath)}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm group-hover:text-primary transition">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {movie.releaseYear || 'N/A'}
                          </p>
                          {movie.rating && (
                            <p className="text-yellow-400 text-xs mt-1">
                              ⭐ {movie.rating.toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark text-white p-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                  <FiLoader className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies..."
                disabled={loading}
                rows={2}
                className="flex-1 bg-dark text-white px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary text-white p-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
