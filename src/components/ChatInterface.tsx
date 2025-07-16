import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';
import PredefinedQuestions from './PredefinedQuestions';
import type { PortfolioData } from './PortfolioAIChat';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isMarkdown?: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  sessionId: string;
  portfolioData: PortfolioData;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId, portfolioData, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialQuestions, setInitialQuestions] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true);
  
  const wsRef = useRef<WebSocket | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`ws://localhost:8000/chat/${sessionId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('Connected to chat');
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setIsLoading(false);

        if (message.type === 'error') {
          addMessage(`Error: ${message.message}`, false, false);
          setConnectionStatus(`Chat error: ${message.message}`);
        } else if (message.questions) {
          setInitialQuestions(message.questions);
        } else if (message.type === 'Strategy') {
          addMessage(message.message, false, true);
        } else {
          addMessage(`Unknown message type: ${JSON.stringify(message)}`, false, false);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('Disconnected from chat');
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        setIsConnected(false);
        setConnectionStatus('WebSocket error occurred');
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setConnectionStatus('Failed to connect');
      console.error('WebSocket connection error:', error);
    }
  };

  const addMessage = (content: string, isUser: boolean, isMarkdown: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      isMarkdown,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = (customMessage?: string) => {
    const query = customMessage || inputValue.trim();
    if (!query || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    addMessage(query, true);
    wsRef.current.send(query);
    setInputValue('');
    setIsLoading(true);
    setShowPredefinedQuestions(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handlePredefinedQuestionSubmit = (formattedQuestion: string) => {
    sendMessage(formattedQuestion);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Upload</span>
        </button>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-forest-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm ${isConnected ? 'text-forest-700' : 'text-red-600'}`}>
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Predefined Questions */}
      {showPredefinedQuestions && (
        <PredefinedQuestions 
          portfolioData={portfolioData}
          onSubmit={handlePredefinedQuestionSubmit}
        />
      )}

      {/* WebSocket Initial Questions */}
      {initialQuestions.length > 0 && !showPredefinedQuestions && (
        <div className="bg-forest-50 border border-forest-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-forest-700" />
            Additional Suggested Questions
          </h3>
          <div className="space-y-2">
            {initialQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="block w-full text-left p-3 bg-white hover:bg-forest-50 border border-forest-200 rounded-lg transition-colors text-sm hover:border-forest-300"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        ref={chatAreaRef}
        className="bg-forest-25 border border-forest-200 rounded-xl p-6 h-96 overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-forest-300" />
            <p>Start a conversation about your portfolio...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-forest-200">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex space-x-3">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your question about the portfolio..."
          disabled={!isConnected || isLoading}
          className="flex-1 px-4 py-3 border border-forest-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!inputValue.trim() || !isConnected || isLoading}
          className="bg-gradient-to-r from-forest-800 to-forest-900 hover:from-forest-900 hover:to-forest-950 disabled:from-gray-300 disabled:to-gray-300 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;