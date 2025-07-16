import React, { useState } from 'react';
import { MessageSquare, TrendingUp } from 'lucide-react';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import DataPreview from './DataPreview';

export interface PortfolioData {
  headers: string[];
  data: (string | number)[][];
}

const PortfolioAIChat: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleUploadSuccess = (id: string, data: PortfolioData) => {
    setSessionId(id);
    setPortfolioData(data);
    setShowChat(true);
  };

  const handleBackToUpload = () => {
    setSessionId(null);
    setPortfolioData(null);
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-[#003f2fd] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-forest-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 p-6 text-white">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Portfolio AI Chat</h1>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <p className="text-center text-forest-100 mt-2">
            Upload your portfolio data and chat with AI for insights
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!showChat ? (
            <div className="space-y-6">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
              {portfolioData && (
                <DataPreview data={portfolioData} />
              )}
            </div>
          ) : (
            <ChatInterface 
              sessionId={sessionId!} 
              onBack={handleBackToUpload}
              portfolioData={portfolioData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAIChat;