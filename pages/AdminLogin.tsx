
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Lock, Shield, User, Dumbbell, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@goodlife.com' && password === 'admin123') {
      onLogin(UserRole.SUPER_ADMIN);
    } else if (email === 'staff@goodlife.com' && password === 'staff123') {
      onLogin(UserRole.STAFF);
    } else {
      setError('Invalid credentials. Use admin@goodlife.com (admin123) or staff@goodlife.com (staff123).');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-600 text-white mb-6 shadow-xl transform -rotate-6">
            <Dumbbell size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Portal</h2>
          <p className="text-slate-500 mt-2">Enter your credentials to manage the gym.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-600 text-xs leading-relaxed animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="shrink-0" size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  placeholder="name@goodlife.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><Shield size={12} /> Encrypted Access</span>
            <span className="hover:text-rose-600 cursor-pointer">Help Center</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
