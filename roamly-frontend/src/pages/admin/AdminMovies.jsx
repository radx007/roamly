import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiStar, FiPlus, FiFilm, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { movieApi } from '../../api/movieApi';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const AdminMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieApi.getAllMovies(page, 20);
      const data = response.data;
      
      setMovies(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Load movies error:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (movieId, currentStatus) => {
    try {
      await adminApi.toggleFeatured(movieId);
      toast.success(currentStatus ? 'Removed from featured' : 'Added to featured');
      loadMovies();
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleDelete = async (movieId, movieTitle) => {
    if (window.confirm(`Delete "${movieTitle}"?`)) {
      try {
        await adminApi.deleteMovie(movieId);
        toast.success('Movie deleted');
        loadMovies();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/20 via-secondary to-blue-600/20 rounded-2xl p-8 mb-10 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-4 rounded-full">
                <FiFilm size={36} className="text-green-400" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold">Movie Management</h1>
                <p className="text-gray-400 text-lg mt-1">{movies.length} total movies</p>
              </div>
            </div>
            {/* <button
              onClick={() => navigate('/admin/movies/add')}
              className="bg-gradient-to-r from-primary to-red-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center space-x-2 font-semibold shadow-lg"
            >
              <FiPlus size={20} />
              <span>Add Movie</span>
            </button> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-xl p-6 mb-6 border border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title..."
              className="w-full bg-dark text-white pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Movies Table */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-secondary/80 backdrop-blur-lg rounded-xl border border-gray-700">
            <FiFilm size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No movies found</p>
          </div>
        ) : (
          <div className="bg-secondary/80 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-bold">Title</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Year</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Rating</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Featured</th>
                    <th className="px-6 py-4 text-center text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4 text-white font-semibold">{movie.title}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400 font-semibold">
                          ⭐ {movie.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(movie.id, movie.isFeatured)}
                          className={`p-2 rounded-lg transition hover:scale-110 ${
                            movie.isFeatured
                              ? 'bg-yellow-500 text-dark'
                              : 'bg-gray-600 text-gray-400'
                          }`}
                          title={movie.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <FiStar 
                            size={18} 
                            className={movie.isFeatured ? 'fill-current' : ''}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(movie.id, movie.title)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-110 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 p-6 border-t border-gray-700">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="bg-dark text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 font-semibold"
                >
                  ← Previous
                </button>
                <span className="text-white font-semibold">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="bg-dark text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 font-semibold"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovies;
