import React, { useState, useEffect } from 'react';
import { ratingApi } from '../../api/ratingApi';
import RatingCard from './RatingCard';
import Loader from '../common/Loader';

const RatingList = ({ movieId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, page]);

  const loadRatings = async () => {
    try {
      const { data } = await ratingApi.getMovieRatings(movieId, page, 10);
      setRatings((prev) => (page === 0 ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 0) return <Loader />;

  return (
    <div className="space-y-4">
      <h2 className="text-white text-2xl font-bold mb-4">User Reviews</h2>

      {ratings.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          {ratings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))}

          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="w-full bg-dark text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RatingList;
