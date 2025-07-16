import React from 'react';
import { MessageCircle, Filter, DollarSign, Zap, Building, MapPin, Eye } from 'lucide-react';
import type { PortfolioData } from './PortfolioAIChat';

interface SuggestedQuestionsProps {
  portfolioData: PortfolioData;
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ portfolioData, onQuestionClick }) => {
  // Extract locations from portfolio data for dynamic questions
  const getAvailableLocations = () => {
    const { headers, data } = portfolioData;
    
    const locationColumnNames = [
      'location', 'locations', 'site', 'sites', 'city', 'cities', 
      'address', 'addresses', 'building', 'buildings', 'property', 
      'properties', 'facility', 'facilities', 'office', 'offices'
    ];
    
    let locationColumnIndex = -1;
    
    for (const columnName of locationColumnNames) {
      locationColumnIndex = headers.findIndex(header => 
        header.toLowerCase().includes(columnName.toLowerCase())
      );
      if (locationColumnIndex !== -1) break;
    }
    
    if (locationColumnIndex === -1) {
      locationColumnIndex = 0;
    }
    
    const locations = new Set<string>();
    data.forEach(row => {
      const location = row[locationColumnIndex];
      if (location && typeof location === 'string' && location.trim()) {
        locations.add(location.trim());
      }
    });
    
    return Array.from(locations).sort().slice(0, 5); // Show top 5 locations
  };

  const availableLocations = getAvailableLocations();

  const generalQuestions = [
    {
      icon: Filter,
      text: "Show me only results that do not include Sublease",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: DollarSign,
      text: "Show me scenarios with low capital spend",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      text: "Want to see strategies where Agile Scenarios are considered",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Building,
      text: "I would like to consider Scenarios without any consolidation of locations",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const locationQuestions = [
    {
      icon: Eye,
      text: "Would like to see strategies where I don't exit any location",
      color: "from-forest-500 to-forest-600"
    }
  ];

  return (
    <div className="bg-forest-50 border border-forest-200 rounded-xl p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 mr-2 text-forest-700" />
          Suggested Follow-up Questions
        </h3>
        <p className="text-gray-600 text-sm">
          Click on any question to explore specific aspects of your portfolio strategy
        </p>
      </div>

      {/* General Strategy Questions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Strategy Filters
        </h4>
        <div className="grid gap-3">
          {generalQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question.text)}
              className="flex items-center p-4 bg-white hover:bg-forest-50 border border-forest-200 rounded-lg transition-all duration-200 hover:border-forest-300 hover:shadow-sm text-left group"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${question.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                <question.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-forest-800 font-medium">
                {question.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Location-Based Questions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Location-Based Questions
        </h4>
        <div className="grid gap-3">
          {locationQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question.text)}
              className="flex items-center p-4 bg-white hover:bg-forest-50 border border-forest-200 rounded-lg transition-all duration-200 hover:border-forest-300 hover:shadow-sm text-left group"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${question.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                <question.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-forest-800 font-medium">
                {question.text}
              </span>
            </button>
          ))}

          {/* Dynamic location-specific questions */}
          {availableLocations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-4 mb-2">
                Specific Location Analysis
              </p>
              {availableLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick(`What would be the top Scenarios if we were not to keep/exit ${location}?`)}
                  className="flex items-center p-3 bg-white hover:bg-forest-50 border border-forest-200 rounded-lg transition-all duration-200 hover:border-forest-300 hover:shadow-sm text-left group w-full"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-forest-400 to-forest-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 group-hover:text-forest-800 font-medium">
                    Analysis without <span className="font-semibold text-forest-700">{location}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-forest-200">
        <p className="text-xs text-gray-500 text-center">
          Or type your own question in the chat below
        </p>
      </div>
    </div>
  );
};

export default SuggestedQuestions;