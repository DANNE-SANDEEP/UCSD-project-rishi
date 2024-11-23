import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SurveyInformation() {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/surveys');
        setSurveys(response.data);
        
        const uniqueCategories = [...new Set(response.data.map(survey => survey.section))];
        setCategories(uniqueCategories);
        
        setFilteredSurveys(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch surveys');
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  useEffect(() => {
    let result = surveys;

    if (selectedCategory) {
      result = result.filter(survey => survey.section === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(survey => 
        survey.query.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSurveys(result);
  }, [selectedCategory, searchQuery, surveys]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <div className="flex p-4 bg-white border-b px-24">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Search questions..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded flex-grow focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-grow overflow-auto p-4 px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map(survey => (
            <div 
              key={survey._id} 
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
            >
              <h2 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">{survey.query}</h2>
              <p className="text-gray-600 flex-grow overflow-hidden text-ellipsis line-clamp-3">{survey.answer}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">{survey.section}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SurveyInformation;