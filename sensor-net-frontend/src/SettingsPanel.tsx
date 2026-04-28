import { useAuth } from './context/AuthContext';
import { User, Shield, LogOut, Cpu, Activity } from 'lucide-react';

const SettingsPanel = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your profile and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 glass-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/20">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-background border border-white/10 rounded-xl shadow-lg">
              <Shield size={16} className="text-primary" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Authenticated User</p>
              <h3 className="text-2xl font-bold">{user?.username}</h3>
              <p className="text-sm text-muted-foreground">{user?.role} Level Access</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <Cpu size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium">System Core v1.0</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <Activity size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium">Session Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="glass-card p-8 flex flex-col justify-between border-red-500/10 bg-red-500/[0.02]">
          <div>
            <h4 className="font-bold mb-2">Danger Zone</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Log out of the current session or terminate account access.</p>
          </div>
          <button
            onClick={logout}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all font-bold text-xs"
          >
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Role Simulation Section */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Permissions Debugger</h3>
            <p className="text-xs text-muted-foreground">Simulate different user roles to test system access control.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RoleButton
            active={user?.role === 'ADMIN'}
            onClick={() => login('Admin User', 'ADMIN')}
            label="Administrator"
            sub="Full system access"
          />
          <RoleButton
            active={user?.role === 'USER'}
            onClick={() => login('Standard User', 'USER')}
            label="Standard User"
            sub="Read/Write access"
          />
          <RoleButton
            active={user?.role === 'VIEWER'}
            onClick={() => login('Viewer User', 'VIEWER')}
            label="Guest Viewer"
            sub="Read-only access"
          />
        </div>
      </div>
    </div>
  );
};

const RoleButton = ({ active, onClick, label, sub }: { active: boolean, onClick: () => void, label: string, sub: string }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-2xl border text-left transition-all duration-300 group ${
      active
        ? 'border-primary bg-primary/[0.05] shadow-[0_0_20px_rgba(59,130,246,0.1)]'
        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground group-hover:text-foreground'}`}>
        <User size={16} />
      </div>
      {active && <div className="w-2 h-2 rounded-full bg-primary" />}
    </div>
    <p className={`font-bold text-sm ${active ? 'text-primary' : 'text-foreground'}`}>{label}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
  </button>
);

export default SettingsPanel;
