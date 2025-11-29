import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(formData);
    if (success) {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-block bg-primary/10 p-6 rounded-full mb-4">
            <h1 className="text-primary text-6xl font-bold">🎬</h1>
          </div>
          <h1 className="text-white text-5xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Sign in to continue your movie journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <label className="block text-white mb-2 font-semibold">Username or Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                <input
                  type="text"
                  value={formData.usernameOrEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, usernameOrEmail: e.target.value })
                  }
                  placeholder="Enter your username or email"
                  required
                  className="w-full bg-dark text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white mb-2 font-semibold">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full bg-dark text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-red-700 text-white py-4 rounded-xl hover:scale-105 transition-transform font-bold text-lg disabled:opacity-50 disabled:scale-100 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <FiArrowRight size={20} />}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-red-400 font-semibold transition">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-1">🎥</div>
            <p className="text-gray-400 text-sm">10K+ Movies</p>
          </div>
          <div>
            <div className="text-3xl mb-1">⭐</div>
            <p className="text-gray-400 text-sm">Rate & Review</p>
          </div>
          <div>
            <div className="text-3xl mb-1">📝</div>
            <p className="text-gray-400 text-sm">Watchlists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
