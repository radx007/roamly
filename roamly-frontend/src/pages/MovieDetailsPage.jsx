import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlay, FiPlus, FiStar, FiCalendar, FiClock, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { movieApi } from '../api/movieApi';
import { ratingApi } from '../api/ratingApi';
import { watchlistApi } from '../api/watchlistApi';
import RatingForm from '../components/rating/RatingForm';
import RatingList from '../components/rating/RatingList';
import TrailerModal from '../components/movie/TrailerModal';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
    if (user) {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadMovieDetails = async () => {
    try {
      const { data } = await movieApi.getMovieDetails(id);
      setMovie(data.data);
    } catch (error) {
      toast.error('Failed to load movie');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const watchlistsPromise = watchlistApi.getMyWatchlists()
        .then(res => res.data?.data || [])
        .catch(() => []);

      let rating = null;
      try {
        const ratingRes = await ratingApi.getMyRatingForMovie(id);
        rating = ratingRes?.data?.data || null;
      } catch (err) {
        rating = null;
      }

      const lists = await watchlistsPromise;
      
      setWatchlists(lists);
      setMyRating(rating);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleAddToWatchlist = async (watchlistId) => {
    try {
      await watchlistApi.addMovie(watchlistId, id);
      toast.success('Added to watchlist!');
      setShowAddToList(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to watchlist');
    }
  };

  const getBackdropUrl = () => {
    if (!movie || !movie.backdropPath) {
      return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920';
    }
    
    if (movie.backdropPath.startsWith('http://') || movie.backdropPath.startsWith('https://')) {
      return movie.backdropPath;
    }
    
    const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
    return `${imageBaseUrl}/original${movie.backdropPath}`;
  };

  const getPosterUrl = () => {
    if (!movie || !movie.posterPath) {
      return 'https://via.placeholder.com/300x450?text=No+Poster';
    }
    
    if (movie.posterPath.startsWith('http://') || movie.posterPath.startsWith('https://')) {
      return movie.posterPath;
    }
    
    const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
    return `${imageBaseUrl}/w500${movie.posterPath}`;
  };

  const getActorPhotoUrl = (profilePath) => {
    if (!profilePath) {
      return 'https://via.placeholder.com/200x300?text=No+Photo';
    }
    const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
    return `${imageBaseUrl}/w200${profilePath}`;
  };

  const getProviderLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
    return `${imageBaseUrl}/w92${logoPath}`;
  };

  if (loading) return <Loader />;
  if (!movie) return null;

  const streamProviders = movie.streamingProviders?.filter(p => p.type === 'stream') || [];
  const rentProviders = movie.streamingProviders?.filter(p => p.type === 'rent') || [];
  const buyProviders = movie.streamingProviders?.filter(p => p.type === 'buy') || [];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackdropUrl()})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex items-end space-x-8">
            <img
              src={getPosterUrl()}
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl hidden md:block"
            />

            <div className="flex-1 pb-4">
              <h1 className="text-white text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-6 text-gray-300 mb-6">
                <div className="flex items-center space-x-2">
                  <FiStar className="text-yellow-400" />
                  <span className="font-bold">{movie.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-400">({movie.voteCount || 0} ratings)</span>
                </div>
                {movie.releaseDate && (
                  <div className="flex items-center space-x-2">
                    <FiCalendar />
                    <span>{format(new Date(movie.releaseDate), 'yyyy')}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <FiClock />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary px-3 py-1 rounded-full text-white text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                  >
                    <FiPlay />
                    <span>Watch Trailer</span>
                  </button>
                )}
                {user && (
                  <button
                    onClick={() => setShowAddToList(true)}
                    className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center space-x-2"
                  >
                    <FiPlus />
                    <span>Add to List</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
        </div>

        {/* Streaming Providers */}
        {(streamProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0) && (
          <div className="mb-12 bg-secondary p-6 rounded-lg">
            <h2 className="text-white text-2xl font-bold mb-4">Where to Watch</h2>
            
            {streamProviders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-3">Stream</h3>
                <div className="flex flex-wrap gap-4">
                  {streamProviders.map((provider, idx) => (
                    <a
                      key={idx}
                      href={movie.watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      title={`Watch on ${provider.providerName}`}
                    >
                      <div className="relative">
                        <img
                          src={getProviderLogoUrl(provider.logoPath)}
                          alt={provider.providerName}
                          className="w-16 h-16 rounded-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FiExternalLink className="text-white" size={20} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {rentProviders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-3">Rent</h3>
                <div className="flex flex-wrap gap-4">
                  {rentProviders.map((provider, idx) => (
                    <a
                      key={idx}
                      href={movie.watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      title={`Rent on ${provider.providerName}`}
                    >
                      <div className="relative">
                        <img
                          src={getProviderLogoUrl(provider.logoPath)}
                          alt={provider.providerName}
                          className="w-16 h-16 rounded-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FiExternalLink className="text-white" size={20} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {buyProviders.length > 0 && (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">Buy</h3>
                <div className="flex flex-wrap gap-4">
                  {buyProviders.map((provider, idx) => (
                    <a
                      key={idx}
                      href={movie.watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      title={`Buy on ${provider.providerName}`}
                    >
                      <div className="relative">
                        <img
                          src={getProviderLogoUrl(provider.logoPath)}
                          alt={provider.providerName}
                          className="w-16 h-16 rounded-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FiExternalLink className="text-white" size={20} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.cast.map((actor) => (
                <div key={actor.id} className="text-center group">
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={getActorPhotoUrl(actor.profilePath)}
                      alt={actor.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x300?text=No+Photo';
                      }}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-white font-semibold">{actor.name}</h3>
                  {actor.character && (
                    <p className="text-gray-400 text-sm">{actor.character}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directors */}
        {movie.directors && movie.directors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-2xl font-bold mb-4">Directors</h2>
            <div className="flex flex-wrap gap-2">
              {movie.directors.map((director, idx) => (
                <span key={idx} className="bg-secondary px-4 py-2 rounded text-white">
                  {director}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ratings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RatingList movieId={id} />
          </div>

          <div>
            {user ? (
              <RatingForm
                movieId={id}
                existingRating={myRating}
                onSuccess={loadUserData}
              />
            ) : (
              <div className="bg-secondary p-6 rounded-lg text-center">
                <p className="text-white mb-4">Sign in to rate this movie</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTrailer && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {showAddToList && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-secondary rounded-lg max-w-md w-full p-6">
            <h2 className="text-white text-2xl font-bold mb-4">Add to Watchlist</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {watchlists.length === 0 ? (
                <p className="text-gray-400">No watchlists yet. Create one first!</p>
              ) : (
                watchlists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => handleAddToWatchlist(list.id)}
                    className="w-full bg-dark text-white p-3 rounded-lg hover:bg-gray-700 transition text-left"
                  >
                    {list.name}
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => setShowAddToList(false)}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
