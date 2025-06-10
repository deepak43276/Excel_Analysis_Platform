import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Chart2D from '../components/Chart2D';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [uploadSearch, setUploadSearch] = useState('');
  const [filteredUploads, setFilteredUploads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Log before fetching uploads
      // console.log('Attempting to fetch admin uploads...');
      try {
        const [statsRes, usersRes, uploadsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/uploads')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setUploads(uploadsRes.data); // The backend returns the array directly
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 403) {
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    );
  }, [userSearch, users]);

  useEffect(() => {
    setFilteredUploads(
      uploads.filter(upload =>
        upload.originalName.toLowerCase().includes(uploadSearch.toLowerCase()) ||
        (upload.user?.username || '').toLowerCase().includes(uploadSearch.toLowerCase())
      )
    );
  }, [uploadSearch, uploads]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      try {
        await api.delete(`/admin/uploads/${uploadId}`);
        setUploads(uploads.filter(upload => upload._id !== uploadId));
      } catch (error) {
        alert('Failed to delete upload');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/admin/users/${editingUser._id}`, editForm);
      setUsers(users.map(user => 
        user._id === editingUser._id ? response.data : user
      ));
      setEditingUser(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'files'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                File Management
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'uploads'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Uploads
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Activity Feed
              </button>
            </nav>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && stats && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Uploads</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalUploads}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Storage</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalStorage} MB</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Uploads Over Time</h2>
                <Chart2D
                  type="line"
                  data={stats.uploadsOverTime || []}
                  xAxis="date"
                  yAxis="count"
                />
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage user accounts and permissions.</p>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <li key={user._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">Role: {user.role}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Edit User</h3>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* File Management Tab */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">File Management</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>View and manage uploaded files.</p>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search files by name or user..."
                      value={uploadSearch}
                      onChange={(e) => setUploadSearch(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {filteredUploads.map((upload) => (
                      <li key={upload._id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{upload.originalName}</div>
                                <div className="text-sm text-gray-500">
                                  Uploaded by: {upload.user?.username || 'Unknown user'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Size: {formatFileSize(upload.fileSize)} | Type: {upload.fileType}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Uploaded: {formatDate(upload.createdAt)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Status: <span className={`font-medium ${upload.status === 'completed' ? 'text-green-600' : upload.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {upload.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteUpload(upload._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Uploads Tab */}
          {activeTab === 'uploads' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Uploads</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Manage uploaded files and their analysis results.</p>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {uploads && uploads.length > 0 ? (
                  uploads.map((upload) => (
                    <li key={upload._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{upload.originalName}</div>
                              <div className="text-sm text-gray-500">
                                Uploaded by {upload.user?.username || 'Unknown'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : upload.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {upload.status}
                            </span>
                            <button
                              onClick={() => handleDeleteUpload(upload._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                              </svg>
                              {(upload.fileSize / 1048576).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(upload.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 text-center text-gray-500">
                    No uploads found
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Activity Feed Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>View recent system activities and user actions.</p>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {uploads.map((upload) => (
                    <li key={upload._id} className="px-4 py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {upload.status === 'completed' ? (
                            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : upload.status === 'failed' ? (
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                              {upload.user?.username || 'Unknown user'} uploaded {upload.originalName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(upload.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            Status: <span className={`font-medium ${
                              upload.status === 'completed' ? 'text-green-600' :
                              upload.status === 'failed' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>{upload.status}</span>
                            {upload.status === 'failed' && upload.error && (
                              <span className="ml-2 text-red-500">({upload.error})</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            File size: {(upload.fileSize / 1048576).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
