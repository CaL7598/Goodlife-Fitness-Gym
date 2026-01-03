
import React from 'react';
import { AttendanceRecord, UserRole } from '../types';
import { Download, Clock, User, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

interface AttendanceManagerProps {
  records: AttendanceRecord[];
  currentUserEmail: string;
  role: UserRole;
}

const AttendanceManager: React.FC<AttendanceManagerProps> = ({ records, currentUserEmail, role }) => {
  const filteredRecords = role === UserRole.SUPER_ADMIN 
    ? records 
    : records.filter(r => r.staffEmail === currentUserEmail);

  const formatDateTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const calculateDuration = (start: string, end?: string) => {
    if (!end) return 'Still on shift';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const downloadExcel = () => {
    const headers = ['Date', 'Staff Email', 'Role', 'Sign In', 'Sign Out', 'Duration'];
    const rows = filteredRecords.map(r => [
      r.date,
      r.staffEmail,
      r.staffRole,
      formatDateTime(r.signInTime),
      r.signOutTime ? formatDateTime(r.signOutTime) : 'N/A',
      calculateDuration(r.signInTime, r.signOutTime)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => row.join(','))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Goodlife_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Shift Attendance</h2>
          <p className="text-slate-500 text-sm">
            {role === UserRole.SUPER_ADMIN 
              ? 'Master records of all staff working hours.' 
              : 'Your personal attendance and shift history.'}
          </p>
        </div>
        <button 
          onClick={downloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-bold"
        >
          <Download size={18} />
          Export to Excel (CSV)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Sign In</th>
                <th className="px-6 py-4">Sign Out</th>
                <th className="px-6 py-4">Work Duration</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Calendar size={14} className="text-slate-400" />
                        {record.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${record.staffRole === UserRole.SUPER_ADMIN ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {record.staffRole === UserRole.SUPER_ADMIN ? 'SA' : 'ST'}
                        </div>
                        <span className="text-xs font-medium text-slate-600">{record.staffEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDateTime(record.signInTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                        <Clock size={12} />
                        {record.signOutTime ? formatDateTime(record.signOutTime) : '--:--'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-900">{calculateDuration(record.signInTime, record.signOutTime)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.signOutTime ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                          <CheckCircle size={10} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase animate-pulse">
                          <AlertTriangle size={10} /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <Clock size={48} className="opacity-10" />
                      <p className="text-sm">No attendance records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;
