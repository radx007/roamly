import React, { useState } from 'react';
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profilePicture: user?.profilePicture || '',
    favoriteGenres: user?.favoriteGenres || [],
  });

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setEditing(false);
    }
  };

  const toggleGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary to-blue-600/20 rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-primary/20 p-6 rounded-full">
                <FiUser size={48} className="text-primary" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold">{user?.username}</h1>
                <p className="text-gray-400 text-lg">{user?.email}</p>
                <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                  user?.role === 'ADMIN' ? 'bg-yellow-500 text-dark' : 'bg-blue-500 text-white'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center space-x-2 font-semibold shadow-lg"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Info */}
            <div>
              <h2 className="text-white text-2xl font-bold mb-6">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2 font-semibold">Username</label>
                  <div className="bg-dark text-gray-400 px-4 py-3 rounded-xl flex items-center space-x-3">
                    <FiUser className="text-primary" />
                    <span>{user?.username}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Email</label>
                  <div className="bg-dark text-gray-400 px-4 py-3 rounded-xl flex items-center space-x-3">
                    <FiMail className="text-primary" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-dark text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-dark text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Favorite Genres */}
            <div>
              <h2 className="text-white text-2xl font-bold mb-4">Favorite Genres</h2>
              <p className="text-gray-400 mb-4">Select your favorite movie genres for personalized recommendations</p>
              <div className="flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => editing && toggleGenre(genre)}
                    disabled={!editing}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                      formData.favoriteGenres.includes(genre)
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-dark text-gray-400 hover:bg-gray-700'
                    } ${editing ? 'cursor-pointer' : 'cursor-default opacity-75'}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-semibold flex items-center justify-center space-x-2"
                >
                  <FiX size={20} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-red-700 text-white py-3 rounded-xl hover:scale-105 transition-transform font-semibold flex items-center justify-center space-x-2 shadow-lg"
                >
                  <FiSave size={20} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
