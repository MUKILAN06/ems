import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, CheckCircle, XCircle, Clock, Plus, 
  Filter, Search, Send, User, MessageSquare, AlertTriangle, 
  ChevronRight, CalendarDays
} from 'lucide-react';

const Leave = () => {
  const { user, isAdmin, isHR, isManager } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    employeeId: user?.id || ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, employeeId: user.id }));
      fetchLeaves();
    }
  }, [user]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let res;
      if (isAdmin() || isHR()) {
        res = await api.get('/leaves/all');
      } else {
        res = await api.get(`/leaves/employee/${user.id}`);
      }
      setLeaves(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves/apply', formData);
      setFormData({ 
        startDate: '', 
        endDate: '', 
        reason: '', 
        employeeId: user.id 
      });
      setShowApplyForm(false);
      fetchLeaves();
    } catch (err) {
      alert('Error applying for leave. Please ensure dates are valid.');
    }
  };

  const updateStatus = async (id, status) => {
    let rejection = '';
    if (status === 'REJECTED') {
      rejection = prompt('Enter rejection reason:');
      if (rejection === null) return;
    }

    try {
      await api.put(`/leaves/${id}/status`, null, {
        params: { status, rejectionReason: rejection }
      });
      fetchLeaves();
    } catch (err) {
      alert('Error updating leave status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'PENDING_MANAGER': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PENDING_HR': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredLeaves = leaves.filter(l => 
    filter === 'ALL' || l.status === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20 animate-pulse">
      <div className="text-xl font-bold text-slate-400">Loading leave requests...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4">
      {/* Dynamic HeaderSection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Time Off</h1>
          <p className="text-slate-500 text-lg font-medium mt-1">Manage your absences and track approvals.</p>
        </div>
        
        {!isAdmin() && (
          <button 
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="group px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-black shadow-xl shadow-slate-200 active:scale-95 transition-all"
          >
            {showApplyForm ? <XCircle size={20} /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
            <span>{showApplyForm ? 'Close Form' : 'Request Leave'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form or Summary */}
        <div className={`lg:col-span-4 space-y-8 ${showApplyForm ? 'block' : 'hidden md:block'}`}>
          {showApplyForm ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 sticky top-10">
               <h3 className="text-2xl font-black mb-8 text-slate-900 flex items-center gap-2">
                  <Send className="text-blue-500" size={24} />
                  <span>Leave Details</span>
               </h3>
               <form onSubmit={handleApply} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date Range</label>
                    <div className="grid grid-cols-2 gap-4">
                       <input
                         type="date"
                         required
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                         value={formData.startDate}
                         onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                       />
                       <input
                         type="date"
                         required
                         className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                         value={formData.endDate}
                         onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Purpose/Reason</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="e.g., Family vacation, Sick leave..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                     <AlertTriangle className="text-blue-500 shrink-0" size={20} />
                     <p className="text-xs text-blue-600 font-medium leading-relaxed">
                        Requests are subject to manager approval. Please submit at least 2 days in advance.
                     </p>
                  </div>

                  <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                    Submit Request
                  </button>
               </form>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <CalendarDays size={20} className="text-blue-400" />
                  <span>My Balance</span>
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Annual Leave</span>
                     <span className="text-2xl font-black tracking-tighter">12/15 Days</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Sick Days</span>
                     <span className="text-2xl font-black tracking-tighter">04/07 Days</span>
                  </div>
                  <div className="flex items-center justify-center pt-4">
                     <div className="h-24 w-24 rounded-full border-8 border-blue-500 flex items-center justify-center">
                         <span className="text-2xl font-black">80%</span>
                     </div>
                  </div>
                  <p className="text-xs text-center text-slate-400 font-medium px-4">
                     You have used 80% of your current allocated leisure budget.
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
               {['ALL', 'PENDING_MANAGER', 'PENDING_HR', 'APPROVED', 'REJECTED'].map(s => (
                 <button
                   key={s}
                   onClick={() => setFilter(s)}
                   className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {s.replace('_', ' ')}
                 </button>
               ))}
             </div>
           </div>

           <div className="space-y-4">
             {filteredLeaves.map((leave, idx) => (
               <div key={leave.id || idx} className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-2xl ${getStatusStyle(leave.status)}`}>
                          {leave.status === 'APPROVED' ? <CheckCircle size={24} /> : 
                           leave.status === 'REJECTED' ? <XCircle size={24} /> : <Clock size={24} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <h4 className="font-black text-slate-900 text-lg">Leave Request #{leave.id || 'N/A'}</h4>
                             <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusStyle(leave.status)}`}>
                                {leave.status.replace('_', ' ')}
                             </span>
                          </div>
                          <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                             <Calendar size={14} className="text-blue-500" />
                             {formatDate(leave.startDate)} <ChevronRight size={12} /> {formatDate(leave.endDate)}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                       {(leave.status.startsWith('PENDING')) && (isAdmin() || isHR() || isManager()) && (
                         <>
                            <button 
                              onClick={() => updateStatus(leave.id, 'APPROVED')}
                              className="px-5 py-3 bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(leave.id, 'REJECTED')}
                              className="px-5 py-3 bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                              Reject
                            </button>
                         </>
                       )}
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <MessageSquare size={12} />
                           Employee Reason
                        </label>
                        <p className="text-slate-600 text-sm italic font-medium">"{leave.reason}"</p>
                     </div>

                     {(leave.rejectionReason || (isAdmin() || isHR())) && (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                             <User size={12} />
                             {isAdmin() || isHR() ? 'System Log' : 'Admin Feedback'}
                          </label>
                          <p className="text-slate-600 text-sm font-bold">
                             {leave.rejectionReason || (leave.status === 'APPROVED' ? 'No feedback required.' : 'Awaiting feedback.')}
                          </p>
                       </div>
                     )}
                  </div>
               </div>
             ))}

             {filteredLeaves.length === 0 && (
               <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-slate-200">
                     <Calendar className="text-slate-200" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-300">No leave records found</h3>
                  <p className="text-slate-400 text-sm font-medium">Any requests will appear here after submission.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
