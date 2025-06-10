import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Upload,
  Database,
  BarChart2,
  Trash2,
  Edit2,
  AlertCircle
} from 'react-feather';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchUploads();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUploads = async () => {
    try {
      const response = await fetch('/api/admin/uploads');
      const data = await response.json();
      setUploads(data.uploads);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteUpload = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this upload?')) return;
    
    try {
      await fetch(`/api/admin/uploads/${uploadId}`, { method: 'DELETE' });
      fetchUploads();
      fetchStats();
    } catch (error) {
      console.error('Error deleting upload:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Uploads</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalUploads || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {((stats?.totalStorage || 0) / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed Uploads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.uploadsByStatus?.find(s => s._id === 'failed')?.count || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-4 px-6 text-sm font-medium ${
                  selectedTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`py-4 px-6 text-sm font-medium ${
                  selectedTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setSelectedTab('uploads')}
                className={`py-4 px-6 text-sm font-medium ${
                  selectedTab === 'uploads'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Uploads
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Uploads</h3>
                  <div className="space-y-4">
                    {stats?.recentUploads?.map((upload) => (
                      <div key={upload._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{upload.originalName}</p>
                          <p className="text-sm text-gray-500">by {upload.user.username}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          upload.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : upload.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {upload.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'uploads' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Upload Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uploads.map((upload) => (
                        <tr key={upload._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {upload.originalName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {upload.user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : upload.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {upload.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(upload.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => deleteUpload(upload._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
