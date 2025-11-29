import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiFilm, FiGrid, FiList, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${searchQuery}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-secondary via-secondary to-dark shadow-2xl sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Icon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition">
              <FiFilm size={28} className="text-primary" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
              ROAMLY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                location.pathname === '/'
                  ? 'bg-primary text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center space-x-2 ${
                location.pathname === '/browse'
                  ? 'bg-primary text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <FiGrid size={18} />
              <span>Browse</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/discover/watchlists"
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    location.pathname === '/discover/watchlists'
                      ? 'bg-primary text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Discover
                </Link>
                <Link
                  to="/watchlists"
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center space-x-2 ${
                    location.pathname === '/watchlists'
                      ? 'bg-primary text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FiList size={18} />
                  <span>My Lists</span>
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center space-x-2 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-yellow-500 text-dark'
                    : 'text-yellow-400 hover:bg-yellow-500/10'
                }`}
              >
                <FiSettings size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Search Bar - Only show if NOT on home page */}
          <div className="hidden md:flex items-center space-x-4">
            {isHomePage && (
              <>
                {showSearch ? (
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="bg-dark text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-2.5">
                      <FiSearch className="text-gray-400 hover:text-primary transition" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="absolute -right-8 top-2.5"
                    >
                      <FiX className="text-gray-400 hover:text-white transition" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 rounded-lg bg-dark hover:bg-gray-700 transition text-white"
                  >
                    <FiSearch size={20} />
                  </button>
                )}
              </>
            )}

            {/* User Menu */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-semibold"
                >
                  <div className="bg-primary/20 p-1.5 rounded-full">
                    <FiUser size={16} className="text-primary" />
                  </div>
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-red-600/20 transition font-semibold"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary to-red-700 text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform font-bold shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-2 animate-fade-in">
            {/* Mobile Search - Only if NOT on home page */}
            {!isHomePage && (
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark text-white px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="submit" className="absolute right-3 top-3.5">
                    <FiSearch className="text-gray-400" size={20} />
                  </button>
                </div>
              </form>
            )}

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-semibold transition ${
                location.pathname === '/'
                  ? 'bg-primary text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-semibold transition ${
                location.pathname === '/browse'
                  ? 'bg-primary text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Browse
            </Link>
            {user && (
              <>
                <Link
                  to="/discover/watchlists"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition ${
                    location.pathname === '/discover/watchlists'
                      ? 'bg-primary text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Discover
                </Link>
                <Link
                  to="/watchlists"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition ${
                    location.pathname === '/watchlists'
                      ? 'bg-primary text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  My Lists
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold transition ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-yellow-500 text-dark'
                    : 'text-yellow-400 hover:bg-yellow-500/10'
                }`}
              >
                Admin Panel
              </Link>
            )}
            
            <div className="pt-4 border-t border-gray-700">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition font-semibold"
                  >
                    <FiUser size={18} />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-white hover:bg-red-600/20 transition font-semibold w-full text-left"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-red-700 text-white text-center font-bold mt-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
