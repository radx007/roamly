import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const success = await register(registerData);
    
    if (success) {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-block bg-primary/10 p-6 rounded-full mb-4">
            <h1 className="text-primary text-6xl font-bold">🎬</h1>
          </div>
          <h1 className="text-white text-5xl font-bold mb-2">Join Roamly</h1>
          <p className="text-gray-400 text-lg">Create your account and start discovering movies</p>
        </div>

        {/* Register Card */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-semibold">Username *</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Choose username"
                    required
                    minLength={3}
                    className="w-full bg-dark text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Email *</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email"
                    required
                    className="w-full bg-dark text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-semibold">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  className="w-full bg-dark text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="w-full bg-dark text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-semibold">Password *</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create password"
                    required
                    minLength={6}
                    className="w-full bg-dark text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Confirm Password *</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                    className="w-full bg-dark text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-red-700 text-white py-4 rounded-xl hover:scale-105 transition-transform font-bold text-lg disabled:opacity-50 disabled:scale-100 shadow-lg flex items-center justify-center space-x-2 mt-6"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <FiArrowRight size={20} />}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-red-400 font-semibold transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
