
import React, { useState } from 'react';
import { PaymentRecord, UserRole, Member, PaymentMethod, PaymentStatus } from '../types';
import { CreditCard, Smartphone, CheckCircle, Search, Filter, History, X } from 'lucide-react';

interface PaymentProcessorProps {
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  members: Member[];
  role: UserRole;
  logActivity: (action: string, details: string, category: 'access' | 'admin' | 'financial') => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ payments, setPayments, members, role, logActivity }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'momo'>('history');
  const [showPayModal, setShowPayModal] = useState(false);
  const [newPay, setNewPay] = useState<Partial<PaymentRecord>>({
    memberId: '',
    amount: 0,
    method: PaymentMethod.CASH,
    status: PaymentStatus.CONFIRMED
  });

  const handleConfirmPayment = (id: string) => {
    const pay = payments.find(p => p.id === id);
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: PaymentStatus.CONFIRMED, confirmedBy: 'Staff' } : p));
    logActivity('Confirm Payment', `Verified ${pay?.method} payment of ₵${pay?.amount} for ${pay?.memberName}`, 'financial');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === newPay.memberId);
    if (!member) return;

    const payment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      amount: newPay.amount || 0,
      date: new Date().toISOString().split('T')[0],
      method: newPay.method as PaymentMethod,
      status: newPay.method === PaymentMethod.CASH ? PaymentStatus.CONFIRMED : PaymentStatus.PENDING,
      confirmedBy: newPay.method === PaymentMethod.CASH ? 'Staff' : undefined,
      ...newPay
    } as any;

    setPayments(prev => [payment, ...prev]);
    logActivity('Record Payment', `Logged ₵${payment.amount} ${payment.method} entry for ${member.fullName}`, 'financial');
    setShowPayModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Payment Center</h2>
        <button 
          onClick={() => setShowPayModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 shadow-sm"
        >
          <CreditCard size={20} />
          Record New Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Payment History
          </button>
          <button 
            onClick={() => setActiveTab('momo')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'momo' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone size={18} />
            Mobile Money Verification
          </button>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments
                  .filter(p => activeTab === 'history' || p.status === PaymentStatus.PENDING)
                  .map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${payment.method === PaymentMethod.CASH ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                            {payment.method === PaymentMethod.CASH ? <CreditCard size={18} /> : <Smartphone size={18} />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{payment.method}</div>
                            <div className="text-[10px] text-slate-400">{payment.date} • {payment.transactionId || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">{payment.memberName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">₵{payment.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          payment.status === PaymentStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payment.status === PaymentStatus.PENDING ? (
                          <button 
                            onClick={() => handleConfirmPayment(payment.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                          >
                            Verify & Confirm
                          </button>
                        ) : (
                          <div className="text-[10px] text-slate-400">By {payment.confirmedBy}</div>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="flex items-center justify-between p-6 border-b bg-slate-900 text-white">
              <h3 className="text-lg font-bold">Record Payment</h3>
              <button onClick={() => setShowPayModal(false)} className="hover:text-rose-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Member</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    onChange={e => setNewPay({...newPay, memberId: e.target.value})}
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.fullName} ({m.plan})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₵)</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      onChange={e => setNewPay({...newPay, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                    <select 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      onChange={e => setNewPay({...newPay, method: e.target.value as PaymentMethod})}
                    >
                      <option value={PaymentMethod.CASH}>Cash</option>
                      <option value={PaymentMethod.MOMO}>Mobile Money</option>
                    </select>
                  </div>
                </div>

                {newPay.method === PaymentMethod.MOMO && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">MOMO Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Tx ID" className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm" />
                      <input placeholder="Sender Phone" className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm" />
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-shadow shadow-md">
                    Confirm & Update Subscription
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;
