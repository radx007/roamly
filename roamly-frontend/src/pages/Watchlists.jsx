import React, { useState, useEffect } from 'react';
import { FiPlus, FiList } from 'react-icons/fi';
import { watchlistApi } from '../api/watchlistApi';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import CreateWatchlistModal from '../components/watchlist/CreateWatchlistModal';
import Loader from '../components/common/Loader';

const Watchlists = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadWatchlists();
  }, []);

  const loadWatchlists = async () => {
    try {
      const { data } = await watchlistApi.getMyWatchlists();
      setWatchlists(data.data || []);
    } catch (error) {
      console.error('Failed to load watchlists:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary to-blue-600/20 rounded-2xl p-8 mb-10 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <FiList size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold">My Watchlists</h1>
                <p className="text-gray-400 text-lg mt-1">
                  {watchlists.length} {watchlists.length === 1 ? 'collection' : 'collections'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-red-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center space-x-2 font-semibold shadow-lg"
            >
              <FiPlus size={20} />
              <span>Create Watchlist</span>
            </button>
          </div>
        </div>

        {/* Watchlists Grid */}
        {watchlists.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-secondary p-8 rounded-full mb-6">
              <FiList size={64} className="text-gray-600" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">No Watchlists Yet</h2>
            <p className="text-gray-400 text-lg mb-6">
              Create your first watchlist to organize your favorite movies
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-red-700 text-white px-8 py-4 rounded-xl hover:scale-105 transition-transform font-bold text-lg shadow-lg"
            >
              Create Your First Watchlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlists.map((watchlist) => (
              <WatchlistCard key={watchlist.id} watchlist={watchlist} />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateWatchlistModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={loadWatchlists}
          />
        )}
      </div>
    </div>
  );
};

export default Watchlists;
