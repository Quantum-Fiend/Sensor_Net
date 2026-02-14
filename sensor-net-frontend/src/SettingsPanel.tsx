import { useAuth } from './context/AuthContext';

const SettingsPanel = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-8">
        <h3 className="text-xl font-bold mb-6">User Profile</h3>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold">
            {user?.username?.[0] || 'U'}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium">{user?.username}</p>
            <p className="text-white/40">{user?.role} Access</p>
          </div>
        </div>
      </div>

      <div className="glass p-8">
        <h3 className="text-xl font-bold mb-6">Role Simulation (Demo Mode)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => login('Admin User', 'ADMIN')}
            className={`p-4 rounded-xl border transition-all ${user?.role === 'ADMIN' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
          >
            Switch to ADMIN
          </button>
          <button 
            onClick={() => login('Standard User', 'USER')}
            className={`p-4 rounded-xl border transition-all ${user?.role === 'USER' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
          >
            Switch to USER
          </button>
          <button 
            onClick={() => login('Viewer User', 'VIEWER')}
            className={`p-4 rounded-xl border transition-all ${user?.role === 'VIEWER' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
          >
            Switch to VIEWER
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={logout}
          className="px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 transition-all font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
