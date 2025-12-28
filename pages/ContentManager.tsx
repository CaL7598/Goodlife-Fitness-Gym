
import React, { useState } from 'react';
import { Announcement, GalleryImage, UserRole } from '../types';
import { Plus, Trash2, Edit2, Image as ImageIcon, Bell, Save, AlertTriangle } from 'lucide-react';

interface ContentManagerProps {
  announcements: Announcement[];
  setAnnouncements: any;
  gallery: GalleryImage[];
  setGallery: any;
  role: UserRole;
}

const ContentManager: React.FC<ContentManagerProps> = ({ announcements, setAnnouncements, gallery, setGallery, role }) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'gallery'>('announcements');

  if (role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm">Website content management is reserved for Super Administrators only. Please contact IT support if you believe this is an error.</p>
      </div>
    );
  }

  const handleDeleteAnn = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleAddAnn = () => {
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: 'New Announcement',
      content: 'Announcement content goes here...',
      date: new Date().toISOString().split('T')[0],
      priority: 'low'
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const handleDeleteImg = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Website CMS</h2>
          <p className="text-slate-500 text-sm">Update content on the public-facing website.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'announcements' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Bell size={18} />
            Announcements
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'gallery' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <ImageIcon size={18} />
            Gallery
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'announcements' ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={handleAddAnn} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus size={18} /> New Notice
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{ann.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteAnn(ann.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex justify-end">
                <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus size={18} /> Upload Image
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button className="text-white hover:text-rose-400 transition-colors">
                        <Trash2 size={24} onClick={() => handleDeleteImg(img.id)} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
