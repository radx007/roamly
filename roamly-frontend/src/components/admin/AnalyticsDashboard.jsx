import React, { useEffect, useState } from 'react';
import { FiUsers, FiFilm, FiStar, FiList } from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';
import Loader from '../common/Loader';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data } = await adminApi.getAnalytics();
      setAnalytics(data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!analytics) return null;

  const stats = [
    { icon: FiUsers, label: 'Total Users', value: analytics.totalUsers, color: 'bg-blue-600' },
    { icon: FiFilm, label: 'Total Movies', value: analytics.totalMovies, color: 'bg-green-600' },
    { icon: FiStar, label: 'Total Ratings', value: analytics.totalRatings, color: 'bg-yellow-600' },
    { icon: FiList, label: 'Total Watchlists', value: analytics.totalWatchlists, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-white text-2xl font-bold">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-secondary p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.color} rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-white text-3xl font-bold">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-secondary p-6 rounded-lg">
        <h3 className="text-white text-xl font-bold mb-4">Average Rating</h3>
        <div className="flex items-center space-x-4">
          <div className="text-5xl font-bold text-primary">{analytics.averageRating.toFixed(1)}</div>
          <div className="text-gray-400">/ 10.0</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
