import React from 'react';
import { FiShield, FiCheck, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const UserTable = ({ users, onBan, onUnban, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-dark">
          <tr>
            <th className="px-4 py-3 text-left text-white">Username</th>
            <th className="px-4 py-3 text-left text-white">Email</th>
            <th className="px-4 py-3 text-left text-white">Role</th>
            <th className="px-4 py-3 text-left text-white">Created</th>
            <th className="px-4 py-3 text-left text-white">Status</th>
            <th className="px-4 py-3 text-left text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="px-4 py-3 text-white">{user.username}</td>
              <td className="px-4 py-3 text-gray-400">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-gray-600 text-white'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.isBanned ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {user.isBanned ? 'Banned' : 'Active'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  {user.role !== 'ADMIN' && (
                    <>
                      {user.isBanned ? (
                        <button
                          onClick={() => onUnban(user.id)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          title="Unban"
                        >
                          <FiCheck />
                        </button>
                      ) : (
                        <button
                          onClick={() => onBan(user.id)}
                          className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                          title="Ban User"
                        >
                          <FiShield />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
