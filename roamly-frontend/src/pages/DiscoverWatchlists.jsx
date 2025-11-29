import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiUsers, FiFilm, FiStar, FiClock, FiGrid, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { watchlistApi } from '../api/watchlistApi';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const DiscoverWatchlists = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadWatchlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(0);
        loadWatchlists();
      } else if (searchQuery === '') {
        setPage(0);
        loadWatchlists();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadWatchlists = async () => {
    try {
      setLoading(true);
      let response;

      if (searchQuery) {
        response = await watchlistApi.searchPublicWatchlists(searchQuery, page, 18);
      } else if (sortBy === 'popular') {
        response = await watchlistApi.getPopularWatchlists(page, 18);
      } else {
        response = await watchlistApi.getPublicWatchlists(page, 18);
      }

      const data = response.data;
      setWatchlists(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to load watchlists:', error);
      toast.error('Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadWatchlists();
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block bg-primary/10 p-6 rounded-full mb-6">
              <FiUsers size={48} className="text-primary" />
            </div>
            <h1 className="text-white text-6xl font-bold mb-4">Community Watchlists</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Discover amazing movie collections curated by fellow film enthusiasts
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="bg-secondary rounded-2xl p-6 mb-8 shadow-xl">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watchlists by name, description, or creator..."
                className="w-full bg-dark text-white px-16 py-5 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  <FiX size={24} />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm font-semibold">Sort by:</span>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === 'recent'
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:text-white'
                }`}
              >
                <FiClock className="inline mr-2" size={16} />
                Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === 'popular'
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:text-white'
                }`}
              >
                <FiStar className="inline mr-2" size={16} />
                Popular
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2 bg-dark rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : watchlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-secondary p-8 rounded-full mb-6">
              <FiFilm size={64} className="text-gray-600" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">No Watchlists Found</h2>
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'Try a different search term' : 'Be the first to create a public watchlist!'}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400 text-lg">
                Found <span className="text-white font-bold">{watchlists.length}</span> watchlists
                {totalPages > 1 && ` • Page ${page + 1} of ${totalPages}`}
              </p>
            </div>

            {/* Watchlists Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlists.map((watchlist, index) => (
                  <Link
                    key={watchlist.id}
                    to={`/watchlist/${watchlist.id}`}
                    className="group bg-secondary rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-2">
                            {watchlist.name}
                          </h3>
                          {watchlist.description && (
                            <p className="text-gray-400 text-sm line-clamp-2">{watchlist.description}</p>
                          )}
                        </div>
                        {watchlist.isPublic && (
                          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                            Public
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FiFilm size={16} />
                          <span>{watchlist.movieCount || 0} movies</span>
                        </div>
                        {watchlist.username && (
                          <div className="flex items-center space-x-1">
                            <FiUsers size={16} />
                            <span className="text-primary">{watchlist.username}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">
                            {watchlist.createdAt && new Date(watchlist.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                            View Collection →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {watchlists.map((watchlist, index) => (
                  <Link
                    key={watchlist.id}
                    to={`/watchlist/${watchlist.id}`}
                    className="group bg-secondary rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 flex items-center space-x-6 shadow-lg hover:shadow-2xl"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-shrink-0 bg-primary/10 p-4 rounded-lg">
                      <FiFilm size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white text-2xl font-bold group-hover:text-primary transition">
                          {watchlist.name}
                        </h3>
                        {watchlist.isPublic && (
                          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                            Public
                          </div>
                        )}
                      </div>
                      {watchlist.description && (
                        <p className="text-gray-400 mb-3 line-clamp-1">{watchlist.description}</p>
                      )}
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <FiFilm size={16} />
                          <span className="font-semibold">{watchlist.movieCount || 0} movies</span>
                        </div>
                        {watchlist.username && (
                          <div className="flex items-center space-x-2">
                            <FiUsers size={16} />
                            <span className="text-primary font-semibold">{watchlist.username}</span>
                          </div>
                        )}
                        {watchlist.createdAt && (
                          <div className="flex items-center space-x-2">
                            <FiClock size={16} />
                            <span>{new Date(watchlist.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-primary text-lg font-bold group-hover:translate-x-2 transition-transform">
                      →
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = page < 3 ? idx : page - 2 + idx;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-12 h-12 rounded-lg font-bold transition ${
                          page === pageNum
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-white hover:bg-gray-700'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverWatchlists;
