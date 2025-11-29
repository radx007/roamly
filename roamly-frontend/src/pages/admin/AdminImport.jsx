import React from 'react';
import { FiDownload } from 'react-icons/fi';
import TMDBImport from '../../components/admin/TMDBImport';

const AdminImport = () => {
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 via-secondary to-pink-600/20 rounded-2xl p-8 mb-10 border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500/20 p-4 rounded-full">
              <FiDownload size={36} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-white text-4xl font-bold">Import Movies from TMDB</h1>
              <p className="text-gray-400 text-lg mt-1">Sync your database with The Movie Database</p>
            </div>
          </div>
        </div>

        {/* Import Component */}
        <div className="bg-secondary/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <TMDBImport />
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
