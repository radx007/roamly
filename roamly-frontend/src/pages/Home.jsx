import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/movie/MovieCard';
import Loader from '../components/common/Loader';
import { FiArrowRight, FiPlay, FiTrendingUp, FiStar, FiUsers, FiFilm } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    loadHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-rotate hero every 5 seconds
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % Math.min(3, featuredMovies.length));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies]);

  const loadHomeData = async () => {
    try {
      // Always load featured and popular
      const [featured, popular] = await Promise.all([
        movieApi.getFeaturedMovies(),
        movieApi.getPopularMovies(8),
      ]);

      setFeaturedMovies(featured.data.data || []);
      setPopularMovies(popular.data.data || []);

      // Load recommendations if logged in
      if (user) {
        try {
          const recommended = await movieApi.getRecommendations();
          setRecommendations(recommended.data.data || []);
        } catch (error) {
          console.error('Failed to load recommendations:', error);
        }
      }

      // Load public stats if NOT logged in (no authentication required)
      if (!user) {
        try {
          const response = await movieApi.getPublicStats();
          const statsData = response.data.data;

          setStats({
            totalMovies: statsData.totalMovies || 0,
            totalUsers: statsData.totalUsers || 0,
            totalRatings: statsData.totalRatings || 0,
          });
        } catch (error) {
          console.error('Failed to load stats:', error);
          setStats({
            totalMovies: 0,
            totalUsers: 0,
            totalRatings: 0,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeroBackdrop = () => {
    if (featuredMovies.length > 0 && featuredMovies[heroIndex]?.backdropPath) {
      const backdropPath = featuredMovies[heroIndex].backdropPath;
      if (backdropPath.startsWith('http://') || backdropPath.startsWith('https://')) {
        return backdropPath;
      }
      const imageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
      return `${imageBaseUrl}/original${backdropPath}`;
    }
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920';
  };

  const currentHeroMovie = featuredMovies[heroIndex];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-dark">
      {/* HERO SECTION - Auto-Rotating Featured Movies */}
      <div className="relative h-screen">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${getHeroBackdrop()})`,
            transform: 'scale(1.1)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-transparent to-dark/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-3xl space-y-6">
            {/* Featured Badge */}
            {currentHeroMovie && (
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-500 text-dark px-4 py-2 rounded-full font-bold flex items-center space-x-2">
                  <FiStar size={18} />
                  <span>Featured</span>
                </div>
                {currentHeroMovie.rating && (
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold">
                    ⭐ {currentHeroMovie.rating.toFixed(1)}
                  </div>
                )}
              </div>
            )}

            {/* Title with Animation */}
            <h1 className="text-white text-7xl font-bold leading-tight animate-fade-in">
              {currentHeroMovie?.title || 'Discover Movies'}
            </h1>

            {/* Description */}
            {currentHeroMovie?.description && (
              <p className="text-gray-300 text-xl leading-relaxed line-clamp-3">
                {currentHeroMovie.description}
              </p>
            )}

            {/* Genres */}
            {currentHeroMovie?.genres && (
              <div className="flex flex-wrap gap-2">
                {currentHeroMovie.genres.slice(0, 3).map((genre, idx) => (
                  <span
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {currentHeroMovie && (
                <Link
                  to={`/movie/${currentHeroMovie.id}`}
                  className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg flex items-center space-x-2 shadow-xl hover:scale-105 transform"
                >
                  <FiPlay size={24} />
                  <span>Watch Now</span>
                </Link>
              )}
              
              <Link
                to="/browse"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/30 transition font-bold text-lg shadow-xl hover:scale-105 transform"
              >
                Explore All Movies
              </Link>

              {!user && (
                <Link
                  to="/register"
                  className="bg-white text-dark px-8 py-4 rounded-lg hover:bg-gray-200 transition font-bold text-lg shadow-xl hover:scale-105 transform"
                >
                  Join Free
                </Link>
              )}
            </div>

            {/* Hero Indicators */}
            {featuredMovies.length > 1 && (
              <div className="flex space-x-2 pt-6">
                {featuredMovies.slice(0, 3).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1 rounded-full transition-all ${
                      idx === heroIndex ? 'w-12 bg-primary' : 'w-6 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* FEATURED SECTION */}
      {featuredMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-white text-4xl font-bold mb-2 flex items-center space-x-3">
                <FiStar className="text-yellow-500" size={36} />
                <span>Featured Movies</span>
              </h2>
              <p className="text-gray-400 text-lg">Handpicked selections just for you</p>
            </div>
            <Link
              to="/browse?featured=true"
              className="text-primary hover:text-red-400 flex items-center space-x-2 text-lg font-semibold group"
            >
              <span>View All</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* TRENDING SECTION */}
      {popularMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-white text-4xl font-bold mb-2 flex items-center space-x-3">
                <FiTrendingUp className="text-green-500" size={36} />
                <span>Trending Now</span>
              </h2>
              <p className="text-gray-400 text-lg">What everyone's watching right now</p>
            </div>
            <Link
              to="/browse?sort=voteCount"
              className="text-primary hover:text-red-400 flex items-center space-x-2 text-lg font-semibold group"
            >
              <span>View All</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* RECOMMENDATIONS (Only for logged-in users) */}
      {user && recommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-white text-4xl font-bold mb-2">
                🎬 Recommended For You
              </h2>
              <p className="text-gray-400 text-lg">Based on your taste</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* STATS SECTION - ONLY FOR NON-LOGGED USERS WITH 3 STATS */}
      {!user && (
        <section className="bg-gradient-to-r from-primary/20 via-secondary to-primary/20 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <FiFilm size={48} className="text-green-400" />
                </div>
                <h3 className="text-6xl font-bold text-white">
                  {stats.totalMovies.toLocaleString()}+
                </h3>
                <p className="text-gray-300 text-xl">Movies Available</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <FiUsers size={48} className="text-blue-400" />
                </div>
                <h3 className="text-6xl font-bold text-white">
                  {stats.totalUsers.toLocaleString()}+
                </h3>
                <p className="text-gray-300 text-xl">Active Users</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <FiStar size={48} className="text-yellow-400" />
                </div>
                <h3 className="text-6xl font-bold text-white">
                  {stats.totalRatings.toLocaleString()}+
                </h3>
                <p className="text-gray-300 text-xl">Movie Ratings</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION (Only for non-logged-in users) */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-primary to-red-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-white text-5xl font-bold mb-4">
                Start Your Movie Journey Today
              </h2>
              <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
                Join our community of movie lovers. Create watchlists, rate movies, and get personalized recommendations.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg hover:bg-gray-100 transition font-bold text-xl shadow-2xl hover:scale-105 transform"
              >
                Sign Up - It's Free!
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
