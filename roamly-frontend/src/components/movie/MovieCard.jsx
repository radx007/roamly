import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
  
  // Build poster URL with proper null checks
  const getPosterUrl = () => {
    if (!movie.posterPath) {
      return 'https://via.placeholder.com/500x750?text=No+Poster';
    }
    
    // If posterPath is already a full URL
    if (movie.posterPath.startsWith('http://') || movie.posterPath.startsWith('https://')) {
      return movie.posterPath;
    }
    
    // Build TMDB URL
    return `${imageBaseUrl}/w500${movie.posterPath}`;
  };

  const posterUrl = getPosterUrl();

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
        <img
          src={posterUrl}
          alt={movie.title || 'Movie poster'}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
          }}
          className="w-full h-[400px] object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 w-full">
            <h3 className="text-white text-lg font-bold mb-2">{movie.title}</h3>
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400" />
              <span className="text-white">{movie.rating?.toFixed(1) || 'N/A'}</span>
              <span className="text-gray-400">({movie.voteCount || 0})</span>
            </div>
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres.slice(0, 3).map((genre, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary px-2 py-1 rounded text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {movie.isFeatured && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold">
            FEATURED
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
