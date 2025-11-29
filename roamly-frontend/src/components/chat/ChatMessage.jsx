import React from 'react';
import { FiUser } from 'react-icons/fi';
import { format } from 'date-fns';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-gray-600'
        }`}>
          {isUser ? <FiUser size={16} /> : '🤖'}
        </div>
        <div>
          <div className={`p-3 rounded-lg ${
            isUser ? 'bg-primary text-white' : 'bg-dark text-gray-200'
          }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(message.timestamp), 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
