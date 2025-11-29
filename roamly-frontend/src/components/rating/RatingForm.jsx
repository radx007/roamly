import React, { useState, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';
import { ratingApi } from '../../api/ratingApi';

const RatingForm = ({ movieId, existingRating, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [spoilerTagged, setSpoilerTagged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.ratingValue);
      setReviewText(existingRating.reviewText || '');
      setSpoilerTagged(existingRating.spoilerTagged || false);
    }
  }, [existingRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const data = {
        movieId,
        ratingValue: rating,
        reviewText: reviewText.trim() || null,
        spoilerTagged,
      };

      if (existingRating) {
        await ratingApi.updateRating(existingRating.id, data);
        toast.success('Rating updated!');
      } else {
        await ratingApi.createRating(data);
        toast.success('Rating submitted!');
      }

      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg">
      <h3 className="text-white text-xl font-bold mb-4">
        {existingRating ? 'Update Your Rating' : 'Rate This Movie'}
      </h3>

      <div className="mb-4">
        <label className="block text-white mb-2">Your Rating (1-10)</label>
        <ReactStars
          count={10}
          value={rating}
          onChange={setRating}
          size={32}
          activeColor="#ffd700"
          color="#4a5568"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Review (Optional)</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          maxLength={2000}
          className="w-full bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-gray-400 text-sm mt-1">{reviewText.length}/2000</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-white">
          <input
            type="checkbox"
            checked={spoilerTagged}
            onChange={(e) => setSpoilerTagged(e.target.checked)}
            className="mr-2"
          />
          This review contains spoilers
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
      </button>
    </form>
  );
};

export default RatingForm;
