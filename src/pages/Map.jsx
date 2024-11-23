import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const NEARBY_CITIES = [
  { name: 'Patha Mallayapalem' },
  { name: 'Kotha Mallayapalem' },
  { name: 'Murikipudi' },
  { name: 'Tatapudi' },
  { name: 'Rajupalem' },
  { name: 'Martur' },
  { name: 'Ballikurava' },
  { name: 'Konidena' },
  { name: 'Kopperapalem' },
  { name: 'Somavarappadu' },
  { name: 'Ramachandrapuram' },
  { name: 'Boppudi' },
  { name: 'Kotha Rajapet' },
  { name: 'Uppumaguluru' }
];

const NEARBY_SCHOOLS = [
  { name: 'Zilla Parishad High School' },
  { name: "Nakkabokkalapadu School" },
  { name: "Kothapalem Primary School" },
  { name: 'Gurukula Patasala' }
];

function Map() {
  const [activeSection, setActiveSection] = useState('cities');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Map Container */}
      <div className="w-full md:w-2/3 relative">
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        )}
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=16rVYIZc5NtRmAh4GB4YXJHRKHkACkls&ehbc=2E312F&noprof=1"
          title="vemavaram map"
          className="w-full h-96 md:h-full"
          width="100%"
          height="100%"
          onLoad={handleMapLoad}
        ></iframe>
      </div>

      {/* Locations Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-100 p-6 overflow-y-auto">
        <div className="flex mb-6">
          <button 
            onClick={() => setActiveSection('cities')}
            className={`w-1/2 p-2 ${activeSection === 'cities' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'}`}
          >
            Nearby Villages
          </button>
          <button 
            onClick={() => setActiveSection('schools')}
            className={`w-1/2 p-2 ${activeSection === 'schools' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'}`}
          >
            Nearby Schools
          </button>
        </div>

        {activeSection === 'cities' && (
          <div>
            {NEARBY_CITIES.map((city, index) => (
              <div 
                key={index} 
                className="p-4 mb-4 bg-white rounded-lg"
              >
                <h3 className="text-xl font-semibold flex items-center">
                  <MapPin size={20} className="mr-2" /> {city.name}
                </h3>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'schools' && (
          <div>
            {NEARBY_SCHOOLS.map((school, index) => (
              <div 
                key={index} 
                className="p-4 mb-4 bg-white rounded-lg"
              >
                <h3 className="text-xl font-semibold flex items-center">
                  <MapPin size={20} className="mr-2" /> {school.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;