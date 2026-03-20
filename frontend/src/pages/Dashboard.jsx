import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create New QR
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your QR Codes</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any QR codes yet</p>
          <Link
            to="/create"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Create your first QR code →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;