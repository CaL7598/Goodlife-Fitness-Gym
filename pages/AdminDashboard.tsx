
import React, { useMemo, useState } from 'react';
import { Member, PaymentRecord, UserRole, StaffMember, AttendanceRecord, ActivityLog } from '../types';
import { 
  Users, 
  CreditCard, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2,
  Brain,
  Activity,
  MapPin,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { generateSummary } from '../geminiService';

interface DashboardProps {
  members: Member[];
  payments: PaymentRecord[];
  role: UserRole;
  staff: StaffMember[];
  attendanceRecords: AttendanceRecord[];
  activityLogs: ActivityLog[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ members, payments, role, staff, attendanceRecords, activityLogs }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const activeCount = members.filter(m => m.status === 'active').length;
    const expiringCount = members.filter(m => m.status === 'expiring').length;
    const expiredCount = members.filter(m => m.status === 'expired').length;
    const totalRevenue = payments
      .filter(p => p.status === 'Confirmed')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      active: activeCount,
      expiring: expiringCount,
      expired: expiredCount,
      revenue: totalRevenue,
      total: members.length
    };
  }, [members, payments]);

  const chartData = useMemo(() => [
    { name: 'Active', value: stats.active },
    { name: 'Expiring', value: stats.expiring },
    { name: 'Expired', value: stats.expired },
  ], [stats]);

  const handleAiInsights = async () => {
    setIsGenerating(true);
    const summary = await generateSummary(stats);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  // Helper to determine staff status
  const getStaffStatus = (email: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isCurrentlyOnShift = attendanceRecords.some(r => r.staffEmail === email && r.date === today && !r.signOutTime);
    
    // Find last activity
    const lastActivity = activityLogs.find(log => log.userEmail === email);
    
    return {
      isActive: isCurrentlyOnShift,
      lastAction: lastActivity?.action || 'No recent activity',
      lastSeen: lastActivity ? new Date(lastActivity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
          <p className="text-slate-500 text-sm">Real-time metrics for Goodlife Fitness management.</p>
        </div>
        <button 
          onClick={handleAiInsights}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
        >
          <Brain size={18} />
          {isGenerating ? 'Analyzing...' : 'AI Insights'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Members" 
          value={stats.active} 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          trend="+12% this month"
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₵${stats.revenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-blue-500" />} 
          trend="Steady growth"
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats.expiring} 
          icon={<AlertCircle className="text-amber-500" />} 
          trend="Needs attention"
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Total Registered" 
          value={stats.total} 
          icon={<Users className="text-rose-500" />} 
          trend="Total base"
          bgColor="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              Member Distribution
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Super Admin Feature: Team Presence Monitoring */}
          {role === UserRole.SUPER_ADMIN && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-rose-500" />
                  Team Presence & Monitoring
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  Live Status
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map((employee) => {
                  const status = getStaffStatus(employee.email);
                  return (
                    <div key={employee.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-center justify-between group hover:border-rose-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${status.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                            {employee.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          {status.isActive && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{employee.fullName}</p>
                          <p className="text-[10px] text-slate-500">{employee.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${status.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {status.isActive ? 'On Shift' : 'Inactive'}
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <Clock size={10} />
                          {status.isActive ? 'Active since ' + status.lastSeen : 'Last seen ' + status.lastSeen}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden h-fit">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-rose-400">
              <Brain size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Management Assistant</h3>
            </div>
            <div className="flex-1">
              {aiSummary ? (
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-rose-500 animate-spin" />
                  <p className="text-slate-500 text-sm">Click 'AI Insights' to generate a health report.</p>
                </div>
              )}
            </div>
            {aiSummary && (
              <button 
                onClick={() => setAiSummary('')}
                className="mt-6 text-xs text-slate-500 hover:text-white transition-colors"
              >
                Clear Summary
              </button>
            )}
          </div>
          {/* Background decoration */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; bgColor: string }> = ({ title, value, icon, trend, bgColor }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-slate-400 text-[10px] mt-1 font-medium italic">{trend}</p>
    </div>
    <div className={`p-3 rounded-xl ${bgColor}`}>
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
