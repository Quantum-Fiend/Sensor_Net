import { useState, useEffect } from 'react';
import { Activity, Bell, LayoutDashboard, Settings, Smartphone, Menu, X, ChevronRight, Search, LogOut } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useWebSocket } from './hooks/useWebSocket';
import api from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import SettingsPanel from './SettingsPanel';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AuthProvider>
      <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </AuthProvider>
  );
};

const DashboardContent = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'devices', icon: Smartphone, label: 'Devices' },
    { id: 'alerts', icon: Bell, label: 'Alerts', roles: ['ADMIN'] },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ].filter(item => !item.roles || item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card/50 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Activity size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Sensor_Net</h1>
          </div>
          <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${activeTab === item.id ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-primary' : ''} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold">
              {user?.username?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{user?.role}</p>
            </div>
            <button onClick={logout} className="p-2 text-muted-foreground hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
          <div className="glass-card p-4 bg-primary/5 border-primary/10">
            <p className="text-xs font-medium text-primary mb-1">Pro Plan Active</p>
            <p className="text-[10px] text-muted-foreground">Unlimited device connections and advanced analytics.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050507]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-8 py-5 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2 w-64 focus-within:border-primary/50 transition-colors">
              <Search size={16} className="text-muted-foreground" />
              <input type="text" placeholder="Search devices..." className="bg-transparent border-none text-sm focus:ring-0 w-full placeholder:text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
              <Bell size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#050507]" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
            <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                {user?.username?.[0].toUpperCase()}
              </div>
              <span className="text-xs font-medium hidden sm:block">{user?.username}</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'devices' && (
            <div className="animate-fade-in text-center p-32 glass-card">
              <Smartphone size={48} className="mx-auto mb-4 text-primary opacity-50" />
              <h3 className="text-xl font-bold mb-2">Device Management</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Configure and monitor your IoT devices from this central hub. Feature coming in the next update.</p>
            </div>
          )}
          {activeTab === 'alerts' && (
            <div className="animate-fade-in text-center p-32 glass-card">
              <Bell size={48} className="mx-auto mb-4 text-orange-500 opacity-50" />
              <h3 className="text-xl font-bold mb-2">System Alerts</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Real-time alert history and critical notification settings will appear here.</p>
            </div>
          )}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
};

const Overview = () => {
  const { data: telemetry } = useWebSocket('/topic/telemetry');
  const { data: alerts } = useWebSocket('/topic/alerts');
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/devices')
      .then((res) => {
        setDevices(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch devices:', err);
        setError('Connection failed. Please check if the backend is running.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <Activity size={48} className="text-primary mb-4 animate-bounce" />
        <p className="text-muted-foreground font-medium">Initializing secure connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center border-red-500/20 bg-red-500/[0.02] animate-fade-in">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">System Error</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  const getLatestTelemetryValue = (): string => {
    if (telemetry.length === 0) return "Waiting...";
    const last = telemetry[telemetry.length - 1] as TelemetryPoint;
    return `${last.value.toFixed(1)} ${last.key}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Online Devices" 
          value={devices.filter((d: Device) => d.status === 'ONLINE').length.toString()} 
          icon={Smartphone} 
          trend="+2" 
          trendLabel="since yesterday"
          color="bg-blue-500" 
        />
        <StatCard 
          label="Active Alerts" 
          value={alerts.length.toString()} 
          icon={Bell} 
          trend="Live" 
          trendLabel="monitoring active"
          color="bg-orange-500" 
        />
        <StatCard 
          label="Live Telemetry" 
          value={getLatestTelemetryValue()} 
          icon={Activity} 
          trend="Real-time" 
          trendLabel="data feed"
          color="bg-purple-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 stat-card-gradient">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Telemetry History</h3>
              <p className="text-xs text-muted-foreground">Real-time sensor data stream visualization</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                LIVE
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#25252b" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="timestamp" 
                  hide={telemetry.length < 2}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #25252b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                  strokeWidth={2.5} 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Devices</h3>
              <p className="text-xs text-muted-foreground">Connected node status</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
              {devices.map((device: Device) => (
                <DeviceListItem key={device.id} name={device.name} status={device.status} type={device.type} />
              ))}
              {devices.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                  <Smartphone size={32} className="mb-2" />
                  <p className="text-xs font-medium">No devices detected</p>
                </div>
              )}
          </div>
          <button className="mt-6 w-full py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold transition-all">
            View All Devices
          </button>
        </div>
      </div>
    </div>
  );
};

interface Device {
  id: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  type: string;
}

interface TelemetryPoint {
  value: number;
  key: string;
  timestamp: string;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendLabel: string;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, trend, trendLabel, color }: StatCardProps) => (
  <div className="glass-card p-6 group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl rounded-full -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity`} />
    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{label}</p>
        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        <div className="flex items-center gap-1.5 pt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
            {trend}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">{trendLabel}</span>
        </div>
      </div>
      <div className={`p-3 rounded-2xl ${color}/10 ${color.replace('bg-', 'text-')} shadow-inner`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
    </div>
  </div>
);

const DeviceListItem = ({ name, status, type }: { name: string, status: Device['status'], type: string }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${status === 'ONLINE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        <Smartphone size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-sm truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase">{type}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <div className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ${status === 'ONLINE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {status}
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
    </div>
  </div>
);

export default Dashboard;

