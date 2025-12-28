
import React, { useState } from 'react';
import { Member } from '../types';
import { Send, Sparkles, MessageSquare, Mail, History } from 'lucide-react';
import { generateCommunication } from '../geminiService';

const CommunicationCenter: React.FC<{ members: Member[] }> = ({ members }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [msgType, setMsgType] = useState<'welcome' | 'reminder' | 'expiry'>('reminder');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  const handleAiDraft = async () => {
    if (!selectedMember) {
      alert("Please select a member first.");
      return;
    }
    setIsGenerating(true);
    const draft = await generateCommunication(msgType, selectedMember.fullName, selectedMember.plan, selectedMember.expiryDate);
    setMessage(draft);
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!message || !selectedMember) return;
    const newEntry = {
      id: Date.now(),
      to: selectedMember.fullName,
      type: msgType,
      date: new Date().toLocaleString(),
      preview: message.substring(0, 60) + '...'
    };
    setHistory([newEntry, ...history]);
    setMessage('');
    alert(`Message sent to ${selectedMember.fullName}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Communication Center</h2>
          <p className="text-slate-500 text-sm">Draft and send personalized messages to gym members.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Recipient</label>
              <select 
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
              >
                <option value="">Select Member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Context</label>
              <select 
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                value={msgType}
                onChange={e => setMsgType(e.target.value as any)}
              >
                <option value="welcome">Welcome Onboard</option>
                <option value="reminder">Subscription Reminder</option>
                <option value="expiry">Notification of Expiry</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <textarea 
              className="w-full h-64 p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
              placeholder="Start typing your message or use AI to draft one..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button 
              onClick={handleAiDraft}
              disabled={isGenerating}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <Sparkles size={14} className="text-rose-400" />
              {isGenerating ? 'Drafting...' : 'AI Auto-Draft'}
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSend}
              disabled={!message || !selectedMemberId}
              className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-700 shadow-md transition-colors disabled:opacity-50"
            >
              <Send size={18} />
              Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History size={20} className="text-slate-400" />
          Recent Comms
        </h3>
        <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100 min-h-[400px]">
          {history.length > 0 ? (
            history.map(entry => (
              <div key={entry.id} className="p-4 flex items-start justify-between group hover:bg-white transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{entry.to}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 rounded-full font-bold text-slate-500 uppercase">{entry.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{entry.preview}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{entry.date}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-12">
              <MessageSquare size={48} className="opacity-10" />
              <p className="text-sm">No recent messages found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
