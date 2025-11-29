import React from 'react';
import { Link } from 'react-router-dom';
import { FiList, FiLock, FiUnlock } from 'react-icons/fi';
import { format } from 'date-fns';

const WatchlistCard = ({ watchlist }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Link
      to={`/watchlist/${watchlist.id}`}
      className="bg-secondary p-6 rounded-lg hover:bg-gray-800 transition group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FiList className="text-primary" size={24} />
          <div>
            <h3 className="text-white text-xl font-bold group-hover:text-primary transition">
              {watchlist.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {watchlist.movieCount || 0} movies
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {watchlist.isPublic ? (
            <>
              <FiUnlock className="text-green-400" size={20} />
              <span className="text-green-400 text-sm font-semibold">Public</span>
            </>
          ) : (
            <>
              <FiLock className="text-gray-400" size={20} />
              <span className="text-gray-400 text-sm font-semibold">Private</span>
            </>
          )}
        </div>
      </div>

      {watchlist.description && (
        <p className="text-gray-300 mb-4 line-clamp-2">{watchlist.description}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Created {formatDate(watchlist.createdAt)}</span>
        <span className="text-primary group-hover:underline">View →</span>
      </div>
    </Link>
  );
};

export default WatchlistCard;
