import React from 'react';
import { FiStar, FiCalendar } from 'react-icons/fi';

const MovieCard = ({ movie, viewMode = 'grid', onClick }) => {
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const handleClick = (e) => {
    e.preventDefault();  // ← PREVENT DEFAULT LINK BEHAVIOR
    if (onClick) {
      onClick();
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className="bg-secondary rounded-xl overflow-hidden flex cursor-pointer hover:scale-102 transition-transform"
      >
        <img
          src={getImageUrl(movie.posterPath)}
          alt={movie.title}
          className="w-32 h-48 object-cover"
        />
        <div className="flex-1 p-4">
          <h3 className="text-white text-xl font-bold mb-2 hover:text-primary transition">
            {movie.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
            {movie.releaseDate && (
              <div className="flex items-center space-x-1">
                <FiCalendar size={14} />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
            )}
            {movie.rating && (
              <div className="flex items-center space-x-1">
                <FiStar className="text-yellow-400" size={14} />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">
            {movie.description || 'No description available'}
          </p>
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.slice(0, 3).map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-secondary rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(movie.posterPath)}
          alt={movie.title}
          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {movie.rating && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <FiStar className="text-yellow-400" size={14} />
            <span className="font-bold">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition">
          {movie.title}
        </h3>
        {movie.releaseDate && (
          <div className="flex items-center space-x-1 text-gray-400 text-sm mb-2">
            <FiCalendar size={14} />
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        )}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
