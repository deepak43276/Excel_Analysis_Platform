import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, BarChart2, PieChart, TrendingUp, Download, Settings, User } from 'react-feather';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import UploadHistory from '../components/UploadHistory';
import Chart2D from '../components/Chart2D';
import Chart3D from '../components/Chart3D';

export default function UserDashboard() {
  const [refreshUploads, setRefreshUploads] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalStorage: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        console.log('Fetched user stats:', data);
        setStats(data.stats || { totalUploads: 0, totalStorage: 0, completedUploads: 0, failedUploads: 0 });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [refreshUploads]);

  const handleUploadSuccess = () => {
    setRefreshUploads(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
          <p className="mt-2 text-gray-600">Upload, analyze, and visualize your data with ease.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
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
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalStorage || 0} MB</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="text-2xl font-semibold text-gray-900">Active</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                History
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'upload' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UploadHistory refresh={refreshUploads} />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Trends</h3>
                    <Chart2D
                      type="line"
                      data={stats.recentActivity}
                      xAxis="date"
                      yAxis="count"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Distribution</h3>
                    <Chart2D
                      type="pie"
                      data={stats.storageDistribution}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">3D Visualization</h3>
                  <Chart3D
                    type="column"
                    data={stats.recentActivity}
                    xAxis="date"
                    yAxis="count"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox text-blue-600" />
                          <span className="ml-2">Receive email notifications for uploads</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Default Chart Type</label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option>2D Column</option>
                        <option>3D Column</option>
                        <option>Line Chart</option>
                        <option>Pie Chart</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
