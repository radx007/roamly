import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiShare2, FiLock, FiUnlock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { watchlistApi } from '../../api/watchlistApi';
import MovieGrid from '../movie/MovieGrid';
import WatchlistQRCode from './WatchlistQRCode';
import Loader from '../common/Loader';
import { useAuth } from '../../hooks/useAuth';

const WatchlistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadWatchlist = async () => {
  try {
    const { data } = await watchlistApi.getWatchlistById(id);
    const watchlistData = data.data;
    
    console.log('=== WATCHLIST DATA ===');
    console.log('Full data:', watchlistData);
    console.log('userId:', watchlistData.userId);
    console.log('Current user:', user);
    console.log('Current user ID:', user?.id);
    console.log('======================');
    
    setWatchlist(watchlistData);
    
    // Check if current user is the owner
    if (user && watchlistData.userId) {
      const ownerCheck = user.id === watchlistData.userId;
      console.log('Is owner?', ownerCheck);
      setIsOwner(ownerCheck);
    } else {
      console.log('No user or no userId - setting isOwner to false');
      setIsOwner(false);
    }
  } catch (error) {
    toast.error('Failed to load watchlist');
    navigate('/watchlists');
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this watchlist?')) {
      try {
        await watchlistApi.deleteWatchlist(id);
        toast.success('Watchlist deleted!');
        navigate('/watchlists');
      } catch (error) {
        toast.error('Failed to delete watchlist');
      }
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!isOwner) {
      toast.error('You can only modify your own watchlists');
      return;
    }

    try {
      await watchlistApi.removeMovie(id, movieId);
      toast.success('Movie removed from watchlist');
      loadWatchlist();
    } catch (error) {
      toast.error('Failed to remove movie');
    }
  };

  if (loading) return <Loader />;
  if (!watchlist) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-secondary p-6 rounded-lg mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-white text-3xl font-bold">{watchlist.name}</h1>
              {watchlist.isPublic ? (
                <span className="flex items-center space-x-1 text-green-400 text-sm">
                  <FiUnlock size={16} />
                  <span>Public</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-gray-400 text-sm">
                  <FiLock size={16} />
                  <span>Private</span>
                </span>
              )}
            </div>

            {watchlist.description && (
              <p className="text-gray-300 mb-4">{watchlist.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{watchlist.movies?.length || 0} movies</span>
              <span>•</span>
              <span>Created {format(new Date(watchlist.createdAt), 'MMM dd, yyyy')}</span>
              {watchlist.username && !isOwner && (
                <>
                  <span>•</span>
                  <span>By {watchlist.username}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons - ALWAYS show if owner (even if public) */}
          {isOwner && (
            <div className="flex space-x-2">
              {/* <button
                onClick={() => navigate(`/watchlist/${id}/edit`)}
                className="p-2 bg-dark text-white rounded-lg hover:bg-gray-700 transition"
                title="Edit Watchlist"
              >
                <FiEdit2 />
              </button> */}

              {/* Show QR code button if public */}
              {watchlist.isPublic && (
                <button
                  onClick={() => setShowQR(true)}
                  className="p-2 bg-dark text-white rounded-lg hover:bg-gray-700 transition"
                  title="Share QR Code"
                >
                  <FiShare2 />
                </button>
              )}

              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          {/* Show view-only message ONLY if NOT owner */}
          {!isOwner && watchlist.isPublic && (
            <div className="text-gray-400 text-sm">
              <p>👁️ Viewing public watchlist</p>
            </div>
          )}
        </div>
      </div>

      {!watchlist.movies || watchlist.movies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-xl mb-4">This watchlist is empty</p>
          {isOwner && (
            <button
              onClick={() => navigate('/browse')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Browse Movies
            </button>
          )}
        </div>
      ) : (
        <MovieGrid 
          movies={watchlist.movies} 
          onRemoveMovie={isOwner ? handleRemoveMovie : null}
          showRemoveButton={isOwner}
        />
      )}

      {showQR && (
        <WatchlistQRCode watchlistId={id} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
};

export default WatchlistDetails;
