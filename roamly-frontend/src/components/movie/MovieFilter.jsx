import React from 'react';

const genres = [
  'All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const MovieFilter = ({ selectedGenre, onGenreChange, sortBy, onSortChange }) => {
  return (
    <div className="bg-secondary p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2 font-semibold">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre === 'All' ? '' : genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2 font-semibold">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="rating">Rating</option>
            <option value="voteCount">Popularity</option>
            <option value="releaseDate">Release Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MovieFilter;
