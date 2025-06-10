import { Home, Users, FileText, Activity } from 'react-feather';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="h-full w-64 bg-white shadow-md flex flex-col py-6 px-4">
    <div className="mb-8 text-2xl font-bold text-blue-700 flex items-center gap-2">
      <Home className="inline-block mr-2" /> Admin Dashboard
    </div>
    <nav className="flex flex-col gap-2">
      <button
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <Home size={20} /> Dashboard
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => setActiveTab('users')}
      >
        <Users size={20} /> Users
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'uploads' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => setActiveTab('uploads')}
      >
        <FileText size={20} /> Uploads
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'activity' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => setActiveTab('activity')}
      >
        <Activity size={20} /> Activity Feed
      </button>
    </nav>
  </aside>
);

export default Sidebar;
