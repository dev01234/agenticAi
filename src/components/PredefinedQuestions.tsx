import React, { useState, useEffect } from 'react';
import { ChevronDown, Target, MapPin, LogOut, Send } from 'lucide-react';
import type { PortfolioData } from './PortfolioAIChat';

interface PredefinedQuestionsProps {
  portfolioData: PortfolioData;
  onSubmit: (formattedQuestion: string) => void;
}

const strategicObjectives = [
  'Rightsize',
  'Reduce expense',
  'Save money but with low capital/Capex cost',
  'Consolidation',
  'Make space more efficient (densify)',
  'Flexibility'
];

const PredefinedQuestions: React.FC<PredefinedQuestionsProps> = ({ portfolioData, onSubmit }) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [locationsToKeep, setLocationsToKeep] = useState<string[]>([]);
  const [locationsToExit, setLocationsToExit] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [isKeepLocationsOpen, setIsKeepLocationsOpen] = useState(false);
  const [isExitLocationsOpen, setIsExitLocationsOpen] = useState(false);

  useEffect(() => {
    extractLocations();
  }, [portfolioData]);

  const extractLocations = () => {
    const { headers, data } = portfolioData;
    
    // Look for common location column names
    const locationColumnNames = [
      'location', 'locations', 'site', 'sites', 'city', 'cities', 
      'address', 'addresses', 'building', 'buildings', 'property', 
      'properties', 'facility', 'facilities', 'office', 'offices'
    ];
    
    let locationColumnIndex = -1;
    
    // Find the location column
    for (const columnName of locationColumnNames) {
      locationColumnIndex = headers.findIndex(header => 
        header.toLowerCase().includes(columnName.toLowerCase())
      );
      if (locationColumnIndex !== -1) break;
    }
    
    // If no specific location column found, use the first column
    if (locationColumnIndex === -1) {
      locationColumnIndex = 0;
    }
    
    // Extract unique locations
    const locations = new Set<string>();
    data.forEach(row => {
      const location = row[locationColumnIndex];
      if (location && typeof location === 'string' && location.trim()) {
        locations.add(location.trim());
      }
    });
    
    setAvailableLocations(Array.from(locations).sort());
  };

  const handleObjectiveToggle = (objective: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objective)
        ? prev.filter(obj => obj !== objective)
        : [...prev, objective]
    );
  };

  const handleLocationToggle = (location: string, type: 'keep' | 'exit') => {
    if (type === 'keep') {
      setLocationsToKeep(prev => 
        prev.includes(location)
          ? prev.filter(loc => loc !== location)
          : [...prev, location]
      );
      // Remove from exit if it was there
      setLocationsToExit(prev => prev.filter(loc => loc !== location));
    } else {
      setLocationsToExit(prev => 
        prev.includes(location)
          ? prev.filter(loc => loc !== location)
          : [...prev, location]
      );
      // Remove from keep if it was there
      setLocationsToKeep(prev => prev.filter(loc => loc !== location));
    }
  };

  const handleSubmit = () => {
    let formattedQuestion = '';
    
    if (selectedObjectives.length > 0) {
      formattedQuestion += `My primary strategic objectives are: ${selectedObjectives.join(', ')}. `;
    }
    
    if (locationsToKeep.length > 0) {
      formattedQuestion += `I would like to keep these locations: ${locationsToKeep.join(', ')}. `;
    }
    
    if (locationsToExit.length > 0) {
      formattedQuestion += `I would like to exit these locations: ${locationsToExit.join(', ')}. `;
    }
    
    if (formattedQuestion) {
      formattedQuestion += 'Please provide strategic recommendations based on these preferences.';
      onSubmit(formattedQuestion);
    }
  };

  const isFormValid = selectedObjectives.length > 0 || locationsToKeep.length > 0 || locationsToExit.length > 0;

  return (
    <div className="bg-forest-50 border border-forest-200 rounded-xl p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center">
          <Target className="w-6 h-6 mr-2 text-forest-700" />
          Strategic Planning Questions
        </h3>
        <p className="text-gray-600 text-sm">
          Help us understand your portfolio objectives and preferences
        </p>
      </div>

      {/* Strategic Objectives */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          What is your primary strategic objective? (Select multiple)
        </label>
        <div className="relative">
          <button
            onClick={() => setIsObjectivesOpen(!isObjectivesOpen)}
            className="w-full bg-white border border-forest-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-forest-400 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
          >
            <span className="text-gray-700">
              {selectedObjectives.length === 0 
                ? 'Select strategic objectives...' 
                : `${selectedObjectives.length} objective(s) selected`
              }
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isObjectivesOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isObjectivesOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-forest-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {strategicObjectives.map((objective) => (
                <label
                  key={objective}
                  className="flex items-center px-4 py-3 hover:bg-forest-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(objective)}
                    onChange={() => handleObjectiveToggle(objective)}
                    className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{objective}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {selectedObjectives.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedObjectives.map((objective) => (
              <span
                key={objective}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800"
              >
                {objective}
                <button
                  onClick={() => handleObjectiveToggle(objective)}
                  className="ml-2 text-forest-600 hover:text-forest-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Locations to Keep */}
      {availableLocations.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-forest-600" />
            Any specific locations you would like to keep?
          </label>
          <div className="relative">
            <button
              onClick={() => setIsKeepLocationsOpen(!isKeepLocationsOpen)}
              className="w-full bg-white border border-forest-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-forest-400 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              <span className="text-gray-700">
                {locationsToKeep.length === 0 
                  ? 'Select locations to keep...' 
                  : `${locationsToKeep.length} location(s) selected`
                }
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isKeepLocationsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isKeepLocationsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-forest-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {availableLocations.map((location) => (
                  <label
                    key={location}
                    className="flex items-center px-4 py-3 hover:bg-forest-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={locationsToKeep.includes(location)}
                      onChange={() => handleLocationToggle(location, 'keep')}
                      className="w-4 h-4 text-forest-600 border-gray-300 rounded focus:ring-forest-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {locationsToKeep.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {locationsToKeep.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {location}
                  <button
                    onClick={() => handleLocationToggle(location, 'keep')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Locations to Exit */}
      {availableLocations.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center">
            <LogOut className="w-4 h-4 mr-2 text-red-600" />
            Any specific locations you would like to exit?
          </label>
          <div className="relative">
            <button
              onClick={() => setIsExitLocationsOpen(!isExitLocationsOpen)}
              className="w-full bg-white border border-forest-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-forest-400 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            >
              <span className="text-gray-700">
                {locationsToExit.length === 0 
                  ? 'Select locations to exit...' 
                  : `${locationsToExit.length} location(s) selected`
                }
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExitLocationsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExitLocationsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-forest-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {availableLocations.map((location) => (
                  <label
                    key={location}
                    className="flex items-center px-4 py-3 hover:bg-forest-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={locationsToExit.includes(location)}
                      onChange={() => handleLocationToggle(location, 'exit')}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {locationsToExit.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {locationsToExit.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {location}
                  <button
                    onClick={() => handleLocationToggle(location, 'exit')}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-forest-200">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            isFormValid
              ? 'bg-gradient-to-r from-forest-800 to-forest-900 hover:from-forest-900 hover:to-forest-950 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Submit Strategic Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default PredefinedQuestions;