import React from 'react';
import { User, Bot } from 'lucide-react';
import { markdownToHtml } from '../utils/markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isMarkdown?: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, isUser, isMarkdown } = message;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-forest-800 to-forest-900' 
            : 'bg-forest-200'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-forest-800" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-forest-800 to-forest-900 text-white'
            : 'bg-white border border-forest-200 text-gray-800'
        }`}>
          {isMarkdown && !isUser ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;