import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">ROAMLY</h3>
            <p className="text-gray-400">
              Your ultimate movie recommendation platform. Discover, rate, and share your favorite films.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/browse" className="hover:text-primary">Browse Movies</a></li>
              <li><a href="/watchlists" className="hover:text-primary">My Watchlists</a></li>
              <li><a href="/profile" className="hover:text-primary">Profile</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Roamly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
