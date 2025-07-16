import React, { useState, useEffect } from 'react';
import { MessageCircle, Filter, DollarSign, Zap, Building, Eye, ChevronDown, Send } from 'lucide-react';
import type { PortfolioData } from './PortfolioAIChat';

interface SuggestedQuestionsProps {
  portfolioData: PortfolioData;
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ portfolioData, onQuestionClick }) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  useEffect(() => {
    extractLocations();
  }, [portfolioData]);

  const extractLocations = () => {
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
    
    setAvailableLocations(Array.from(locations).sort());
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  const handleLocationQuestionSubmit = () => {
    if (selectedLocations.length > 0) {
      const locationList = selectedLocations.join(', ');
      const question = `What would be the top Scenarios if we were not to keep/exit these locations: ${locationList}`;
      onQuestionClick(question);
      setSelectedLocations([]);
      setIsLocationDropdownOpen(false);
    }
  };

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
        </div>
      </div>

      {/* Location Selection Question */}
      {availableLocations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Specific Location Analysis
          </h4>
          <div className="bg-white border border-forest-200 rounded-lg p-4 space-y-4">
            <p className="text-sm font-medium text-gray-700">
              What would be the top Scenarios if we were not to keep/exit specific locations?
            </p>
            
            {/* Location Multi-Select Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="w-full bg-white border border-forest-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-forest-400 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              >
                <span className="text-gray-700">
                  {selectedLocations.length === 0 
                    ? 'Select locations to analyze...' 
                    : `${selectedLocations.length} location(s) selected`
                  }
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLocationDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-forest-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {availableLocations.map((location) => (
                    <label
                      key={location}
                      className="flex items-center px-4 py-3 hover:bg-forest-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => handleLocationToggle(location)}
                        className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Locations Display */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800"
                  >
                    {location}
                    <button
                      onClick={() => handleLocationToggle(location)}
                      className="ml-2 text-forest-600 hover:text-forest-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Submit Button */}
            <button
              onClick={handleLocationQuestionSubmit}
              disabled={selectedLocations.length === 0}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedLocations.length > 0
                  ? 'bg-gradient-to-r from-forest-700 to-forest-800 hover:from-forest-800 hover:to-forest-900 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Ask About Selected Locations</span>
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-forest-200">
        <p className="text-xs text-gray-500 text-center">
          Or type your own question in the chat below
        </p>
      </div>
    </div>
  );
};

export default SuggestedQuestions;