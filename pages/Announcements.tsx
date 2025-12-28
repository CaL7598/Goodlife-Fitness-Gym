
import React from 'react';
import { Announcement } from '../types';
import { Calendar, Bell } from 'lucide-react';

const Announcements: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gym News</h2>
            <p className="text-slate-500">Stay updated with the latest happenings at Goodlife.</p>
          </div>
        </div>

        <div className="space-y-6">
          {announcements.map((ann) => (
            <article key={ann.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Calendar size={12} className="text-rose-500" />
                <span className="text-slate-400">{ann.date}</span>
                {ann.priority === 'high' && (
                  <span className="ml-2 px-2 py-0.5 bg-rose-600 text-white rounded">Important</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{ann.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{ann.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
