import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFilm, FiDownload, FiBarChart2, FiList, FiStar } from 'react-icons/fi';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import { adminApi } from '../../api/adminApi';
import { movieApi } from '../../api/movieApi';
import { watchlistApi } from '../../api/watchlistApi';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    featuredMovies: 0,
    totalWatchlists: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load users
      const usersResponse = await adminApi.getAllUsers(0, 1);
      const totalUsers = usersResponse.data.totalElements || 0;

      // Load all movies
      const moviesResponse = await movieApi.getAllMovies(0, 1);
      const totalMovies = moviesResponse.data.totalElements || 0;

      // Load featured movies
      const featuredResponse = await movieApi.getFeaturedMovies();
      const featuredMovies = featuredResponse.data.data?.length || 0;

      // Load total watchlists
      const watchlistsResponse = await watchlistApi.getPublicWatchlists(0, 1);
      const totalWatchlists = watchlistsResponse.data.totalElements || 0;

      setStats({
        totalUsers,
        totalMovies,
        featuredMovies,
        totalWatchlists,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const quickLinks = [
    {
      icon: FiUsers,
      title: 'Manage Users',
      description: 'View, ban, or delete users',
      link: '/admin/users',
      gradient: 'from-blue-500 to-blue-700',
      count: stats.totalUsers,
    },
    {
      icon: FiFilm,
      title: 'Manage Movies',
      description: 'Add, edit, or remove movies',
      link: '/admin/movies',
      gradient: 'from-green-500 to-green-700',
      count: stats.totalMovies,
    },
    {
      icon: FiDownload,
      title: 'Import from TMDB',
      description: 'Import movies from TMDB database',
      link: '/admin/import',
      gradient: 'from-purple-500 to-purple-700',
      count: 'Sync',
    },
  ];

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: FiUsers, 
      color: 'text-blue-400',
      loading: stats.loading 
    },
    { 
      label: 'Total Movies', 
      value: stats.totalMovies, 
      icon: FiFilm, 
      color: 'text-green-400',
      loading: stats.loading 
    },
    { 
      label: 'Featured Movies', 
      value: stats.featuredMovies, 
      icon: FiStar, 
      color: 'text-yellow-400',
      loading: stats.loading 
    },
    { 
      label: 'Total Watchlists', 
      value: stats.totalWatchlists, 
      icon: FiList, 
      color: 'text-purple-400',
      loading: stats.loading 
    },
  ];

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary to-blue-600/20 rounded-2xl p-8 mb-10 border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-4 rounded-full">
              <FiBarChart2 size={36} className="text-primary" />
            </div>
            <div>
              <h1 className="text-white text-5xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-lg mt-1">Manage your movie platform</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-secondary/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={stat.color} size={24} />
                {stat.loading ? (
                  <div className="h-8 w-16 bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <span className={`${stat.color} text-3xl font-bold`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </span>
                )}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-white text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.link}
              className="group bg-secondary/80 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className={`bg-gradient-to-br ${link.gradient} p-6`}>
                <div className="flex items-center justify-between">
                  <link.icon className="text-white" size={32} />
                  <span className="text-white text-2xl font-bold">
                    {typeof link.count === 'number' ? link.count.toLocaleString() : link.count}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition">
                  {link.title}
                </h3>
                <p className="text-gray-400">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Analytics */}
        {/* <div id="analytics">
          <h2 className="text-white text-2xl font-bold mb-6">Platform Analytics</h2>
          <AnalyticsDashboard />
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
