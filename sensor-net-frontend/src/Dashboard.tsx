import { useState, useEffect } from 'react';
import { Activity, Bell, LayoutDashboard, Settings, Smartphone } from 'lucide-react';
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
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Sensor_Net</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'devices', icon: Smartphone, label: 'Devices' },
            { id: 'alerts', icon: Bell, label: 'Alerts', roles: ['ADMIN'] },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].filter(item => !item.roles || item.roles.includes(useAuth().user?.role || '')).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Welcome back, {user?.username}</h2>
            <p className="text-gray-400 mt-1">Your status is {user?.role}.</p>
          </div>
          <div className="flex gap-4">
            <button className="p-3 glass hover:bg-border transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent" />
          </div>
        </header>

        {activeTab === 'overview' && <Overview />}
        {activeTab === 'devices' && <div className="text-center p-20 glass">Devices Management (Coming Soon)</div>}
        {activeTab === 'alerts' && <div className="text-center p-20 glass">Alerts & System Logs (Coming Soon)</div>}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
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

const Overview = () => {
  const { data: telemetry } = useWebSocket('/topic/telemetry');
  const { data: alerts } = useWebSocket('/topic/alerts');
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    api.get('/devices').then((res) => setDevices(res.data));
  }, []);

  const getLatestTelemetryValue = (): string => {
    if (telemetry.length === 0) return "Waiting...";
    const last = telemetry[telemetry.length - 1] as TelemetryPoint;
    return `${last.value} ${last.key}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard label="Online Devices" value={devices.filter((d: Device) => d.status === 'ONLINE').length.toString()} icon={Smartphone} trend="+2 today" color="text-primary" />
      <StatCard label="Active Alerts" value={alerts.length.toString()} icon={Bell} trend="real-time updates" color="text-orange-500" />
      <StatCard label="Live Reading" value={getLatestTelemetryValue()} icon={Activity} trend="Live" color="text-accent" />
      
      <div className="col-span-1 lg:col-span-2 glass p-6 min-h-[400px]">
        <h3 className="text-lg font-bold mb-6">Real-Time Telemetry</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetry}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#25252b" vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121216', border: '1px solid #25252b' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-6">
        <h3 className="text-lg font-bold mb-6">Device Status</h3>
        <div className="flex flex-col gap-4">
            {devices.map((device: Device) => (
              <DeviceListItem key={device.id} name={device.name} status={device.status} type={device.type} />
            ))}
            {devices.length === 0 && <p className="text-gray-500 text-sm text-center">No devices registered</p>}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => (
  <div className="glass p-6 card-gradient">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
        <span className="text-xs text-green-500 mt-2 block font-medium">{trend}</span>
      </div>
      <div className={`p-3 rounded-lg bg-card ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const DeviceListItem = ({ name, status, type }: { name: string, status: Device['status'], type: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <Smartphone size={18} />
      </div>
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-500">{type}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs font-medium text-gray-400">{status}</span>
    </div>
  </div>
);

export default Dashboard;
