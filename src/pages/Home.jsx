import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import slideImage1 from '../assets/slide1.png';
import slideImage2 from '../assets/slide2.png';
import slideImage3 from '../assets/slide3.png';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  
  // Replace with placeholder images since we can't import external images
  const slides = [slideImage1, slideImage2, slideImage3];

  useEffect(() => {
    const loadImages = () => {
      const imagePromises = slides.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setLoadedImages(prev => prev + 1);
            resolve();
          };
          img.onerror = reject;
        });
      });

      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch(err => console.error('Error loading images:', err));
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [imagesLoaded]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  if (!imagesLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <p className="text-white text-lg">Loading..</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fullscreen Slideshow */}
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Overlay Content */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl font-bold mb-4">UCSD Project Rishi</h1>
          <button 
            onClick={scrollToContent} 
            className="animate-bounce mt-8 focus:outline-none"
          >
            <ChevronDown size={48} className="text-white" />
          </button>
        </div>
      </div>

      {/* Fullscreen About Us Section */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="max-w-4xl bg-white shadow-lg rounded-lg p-12">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">About Us</h2>
          
          <div className="space-y-6 text-lg text-gray-700">
            <p className="leading-relaxed">
              Project RISHI is a non-profit with the goal to promote sustainable development and growth of rural Indian communities.
            </p>
            
            <p className="leading-relaxed">
              In partnership with local community members and NGOs in India, we identify issues central to our target community and provide resources to implement solutions through extensive field research and on-campus initiatives.
            </p>
            
            <p className="leading-relaxed">
              UCSD Project RISHI was founded in 2009. Our partner village is currently Vemavaram, Andhra Pradesh. With over 60 members and 7 different committees, we strive to develop focused initiatives with the goal of sustainable growth in Vemavaram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;