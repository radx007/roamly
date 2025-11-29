import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/adminApi';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getAllUsers(page, 20);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId) => {
    const reason = prompt('Enter ban reason:');
    if (!reason) return;

    try {
      await adminApi.banUser(userId, reason);
      toast.success('User banned successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (userId) => {
    try {
      await adminApi.unbanUser(userId);
      toast.success('User unbanned successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-secondary to-purple-600/20 rounded-2xl p-8 mb-10 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-4 rounded-full">
                <FiUsers size={36} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold">User Management</h1>
                <p className="text-gray-400 text-lg mt-1">
                  {users.length} total users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-xl p-6 mb-6 border border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by username or email..."
              className="w-full bg-dark text-white pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <FiUsers size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl">No users found</p>
            </div>
          ) : (
            <>
              <UserTable
                users={filteredUsers}
                onBan={handleBan}
                onUnban={handleUnban}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 p-6 border-t border-gray-700">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="bg-dark text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 font-semibold"
                  >
                    ← Previous
                  </button>
                  <span className="text-white font-semibold">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="bg-dark text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 font-semibold"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
