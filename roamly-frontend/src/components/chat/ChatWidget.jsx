import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { chatApi } from '../../api/chatApi';
import ChatMessage from './ChatMessage';
import { useAuth } from '../../hooks/useAuth';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const { data } = await chatApi.sendMessage({
        message: inputMessage,
        conversationId,
      });

      const botMessage = {
        role: 'assistant',
        content: data.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setConversationId(data.data.conversationId);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition z-40"
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-secondary rounded-lg shadow-2xl flex flex-col z-40">
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiMessageCircle />
              <span className="font-bold">Roamly Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded transition"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <p>👋 Hi! I&apos;m your movie assistant.</p>
                <p className="text-sm mt-2">Ask me anything about movies!</p>
              </div>
            )}
            {messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-primary text-white p-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
