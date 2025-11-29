import React, { useState } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/adminApi';

const TMDBImport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await adminApi.searchTMDB(searchQuery);
      setSearchResults(data.data.results || []);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (tmdbId) => {
    setImporting((prev) => ({ ...prev, [tmdbId]: true }));
    try {
      await adminApi.importMovie(tmdbId);
      toast.success('Movie imported successfully!');
      setSearchResults((prev) => prev.filter((m) => m.id !== tmdbId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setImporting((prev) => ({ ...prev, [tmdbId]: false }));
    }
  };

  const handleBulkImport = async () => {
    if (!window.confirm('Import 5 pages of popular movies? This may take a while.')) return;

    setLoading(true);
    try {
      await adminApi.bulkImport(5);
      toast.success('Bulk import started!');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Bulk import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TMDB for movies..."
              className="flex-1 bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              <FiSearch />
            </button>
          </div>
        </form>

        <button
          onClick={handleBulkImport}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center space-x-2"
        >
          <FiDownload />
          <span>Bulk Import</span>
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((movie) => (
            <div key={movie.id} className="bg-secondary p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">{movie.title}</h3>
              <p className="text-gray-400 text-sm mb-2">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </p>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{movie.overview}</p>
              <button
                onClick={() => handleImport(movie.id)}
                disabled={importing[movie.id]}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {importing[movie.id] ? 'Importing...' : 'Import'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TMDBImport;
