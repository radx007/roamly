import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { watchlistApi } from '../../api/watchlistApi';

const CreateWatchlistModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: name.trim(),
        description: description.trim() || null,
        isPublic: isPublic,  // Make sure this is sent
      };

      console.log('Creating watchlist with data:', requestData); // Debug log

      await watchlistApi.createWatchlist(requestData);
      toast.success('Watchlist created!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating watchlist:', error);
      toast.error(error.response?.data?.message || 'Failed to create watchlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">Create Watchlist</h2>
          <button onClick={onClose} className="text-white hover:text-primary transition">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Favorite Movies"
              maxLength={100}
              className="w-full bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-white mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your watchlist..."
              rows={3}
              maxLength={500}
              className="w-full bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-dark p-4 rounded-lg">
            <label className="flex items-start text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => {
                  console.log('Checkbox changed:', e.target.checked); // Debug log
                  setIsPublic(e.target.checked);
                }}
                className="mt-1 mr-3 w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <span className="font-semibold">Make this watchlist public</span>
                <p className="text-gray-400 text-sm mt-1">
                  Public watchlists can be viewed by anyone with the link and can generate QR codes
                </p>
              </div>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWatchlistModal;
