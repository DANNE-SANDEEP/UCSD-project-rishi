import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-700 text-white p-4 flex flex-col items-center">
      <div className="flex space-x-4 mb-2">
        <a 
          href="https://www.facebook.com/UCSDProjectRISHI" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <Facebook size={24} />
        </a>
        <a 
          href="https://www.instagram.com/ucsd_projectrishi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition-colors"
        >
          <Instagram size={24} />
        </a>
      </div>
      <p>&copy; 2024 UCSD Project Rishi. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;