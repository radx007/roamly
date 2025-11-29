import React, { useState } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const RatingCard = ({ rating }) => {
  const [showFullReview, setShowFullReview] = useState(false);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-green-400';
      case 'NEGATIVE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-secondary p-4 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-gray-400" size={40} />
          <div>
            <p className="text-white font-semibold">{rating.username}</p>
            <p className="text-gray-400 text-sm">
              {format(new Date(rating.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaStar className="text-yellow-400" />
          <span className="text-white font-bold">{rating.ratingValue}/10</span>
        </div>
      </div>

      {rating.reviewText && (
        <div className="mb-3">
          {rating.spoilerTagged && (
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-2">
              SPOILER
            </span>
          )}
          <p className="text-gray-300">
            {showFullReview || rating.reviewText.length <= 200
              ? rating.reviewText
              : `${rating.reviewText.substring(0, 200)}...`}
          </p>
          {rating.reviewText.length > 200 && (
            <button
              onClick={() => setShowFullReview(!showFullReview)}
              className="text-primary text-sm mt-2 hover:underline"
            >
              {showFullReview ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      )}

      {rating.sentiment && (
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getSentimentColor(rating.sentiment)}`}>
            {rating.sentiment}
          </span>
        </div>
      )}
    </div>
  );
};

export default RatingCard;
