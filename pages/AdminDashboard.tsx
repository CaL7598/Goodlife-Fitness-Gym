
import React, { useMemo, useState } from 'react';
import { Member, PaymentRecord, UserRole } from '../types';
import { 
  Users, 
  CreditCard, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2,
  Brain
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { generateSummary } from '../geminiService';

interface DashboardProps {
  members: Member[];
  payments: PaymentRecord[];
  role: UserRole;
}

const AdminDashboard: React.FC<DashboardProps> = ({ members, payments, role }) => {
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
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-400" />
            Member Distribution
          </h3>
          <div className="h-[300px]">
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

        {/* AI Insight Sidebar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
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
