
import React from 'react';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS } from '../constants';
import { 
  LogOut, 
  Menu, 
  X, 
  Dumbbell,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
  role: UserRole;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, setCurrentPage, currentPage, role, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const filteredNav = NAVIGATION_ITEMS.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <Dumbbell className="text-rose-500 h-8 w-8 shrink-0" />
          {isSidebarOpen && (
            <span className="ml-3 font-bold tracking-tight text-lg">
              GOOD<span className="text-rose-500">LIFE</span>
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {filteredNav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors group ${
                    currentPage === item.id 
                      ? 'bg-rose-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`${currentPage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-3 rounded-lg text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-600 hover:text-slate-900 p-1 rounded-md hover:bg-gray-100"
            >
              {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="ml-4 text-lg font-semibold text-slate-800 capitalize">
              {currentPage.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-900">
                {role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Staff Member'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                {role}
              </span>
            </div>
            <div className={`p-2 rounded-full ${role === UserRole.SUPER_ADMIN ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {role === UserRole.SUPER_ADMIN ? <ShieldCheck size={24} /> : <UserCircle size={24} />}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
