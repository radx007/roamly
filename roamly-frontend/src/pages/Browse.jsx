import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiStar, FiGrid, FiList } from 'react-icons/fi';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/movie/MovieCard';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ];

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedGenre, sortBy, showFeaturedOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(0);
        loadMovies();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      let response;

      if (searchQuery) {
        response = await movieApi.searchMovies(searchQuery, page, 20);
      } else if (showFeaturedOnly) {
        response = await movieApi.getFeaturedMovies();
        setMovies(response.data.data || []);
        setTotalPages(1);
        setLoading(false);
        return;
      } else {
        response = await movieApi.browseMovies(page, 20, selectedGenre, sortBy);
      }

      const data = response.data;
      setMovies(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to load movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setShowFeaturedOnly(false);
    loadMovies();
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre === selectedGenre ? '' : genre);
    setPage(0);
    setShowFeaturedOnly(false);
    setSearchParams({ genre: genre === selectedGenre ? '' : genre });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(0);
    setSearchParams({ sort });
  };

  const handleFeaturedToggle = () => {
    const newValue = !showFeaturedOnly;
    setShowFeaturedOnly(newValue);
    setPage(0);
    setSelectedGenre('');
    setSearchQuery('');
    setSearchParams({ featured: newValue ? 'true' : 'false' });
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSortBy('rating');
    setShowFeaturedOnly(false);
    setSearchQuery('');
    setPage(0);
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedGenre && 1,
    sortBy !== 'rating' && 1,
    showFeaturedOnly && 1,
    searchQuery && 1
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary to-primary/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-white text-5xl font-bold mb-4">Discover Movies</h1>
          <p className="text-gray-300 text-lg">Explore our collection of amazing films</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, actors, directors..."
              className="w-full bg-secondary text-white px-14 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
            )}
          </div>
        </form>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                showFilters
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-white hover:bg-gray-700'
              }`}
            >
              <FiFilter size={20} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Featured Toggle */}
            <button
              onClick={handleFeaturedToggle}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                showFeaturedOnly
                  ? 'bg-yellow-500 text-dark'
                  : 'bg-secondary text-white hover:bg-gray-700'
              }`}
            >
              <FiStar size={20} />
              <span>Featured</span>
            </button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                <FiX size={20} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-secondary rounded-lg p-1">
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

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="bg-secondary p-6 rounded-xl mb-8 animate-fade-in">
            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 text-lg">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'title', label: 'Title (A-Z)' },
                  { value: 'releaseDate', label: 'Release Date' },
                  { value: 'voteCount', label: 'Most Popular' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      sortBy === option.value
                        ? 'bg-primary text-white'
                        : 'bg-dark text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-lg">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedGenre === genre
                        ? 'bg-primary text-white'
                        : 'bg-dark text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {!showFilters && activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedGenre && (
              <span className="bg-primary text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span>Genre: {selectedGenre}</span>
                <button onClick={() => handleGenreChange(selectedGenre)}>
                  <FiX size={16} />
                </button>
              </span>
            )}
            {sortBy !== 'rating' && (
              <span className="bg-primary text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <span>Sort: {sortBy}</span>
                <button onClick={() => handleSortChange('rating')}>
                  <FiX size={16} />
                </button>
              </span>
            )}
            {showFeaturedOnly && (
              <span className="bg-yellow-500 text-dark px-4 py-2 rounded-full flex items-center space-x-2 font-semibold">
                <FiStar size={16} />
                <span>Featured Only</span>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-400">
              {movies.length > 0 ? (
                <>
                  Showing <span className="text-white font-semibold">{movies.length}</span> movies
                  {totalPages > 1 && ` (Page ${page + 1} of ${totalPages})`}
                </>
              ) : (
                'No movies found'
              )}
            </p>
          </div>
        )}

        {/* Movies Grid/List */}
        {loading ? (
          <Loader />
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-white text-2xl font-bold mb-2">No Movies Found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !showFeaturedOnly && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  ← Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-2">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = page < 3 ? idx : page - 2 + idx;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
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

export default Browse;
