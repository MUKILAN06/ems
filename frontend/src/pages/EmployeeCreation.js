import React, { useState } from 'react';
import api from '../services/api';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const EmployeeCreation = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        fullName: '', // Added for UI consistency
        department: '', // Added for UI consistency
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        
        try {
            // Mapping UI fields to API expectations if necessary
            // Here we send the expected fields: username, email, password, role
            await api.post('/admin/create-user', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            setStatus({ type: 'success', message: 'Employee account created successfully!' });
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'EMPLOYEE',
                fullName: '',
                department: ''
            });
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || 'Error creating account. Please check your connection.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in slide-in-from-bottom duration-700">
            {/* Page Title Section */}
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 shadow-sm">
                    <UserPlus size={32} />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-800">
                    Create <span className="text-indigo-600">Employee Account</span>
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Add a new authenticated member to the system</p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white relative overflow-hidden">
                {/* Visual Accent Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
                
                <form onSubmit={handleSubmit} className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Status Messages */}
                    {status.message && (
                        <div className={`md:col-span-2 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
                            status.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm'
                        }`}>
                            {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                            <span className="font-bold text-sm tracking-wide uppercase">{status.message}</span>
                        </div>
                    )}

                    {/* Username & Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Username (Login ID)</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="johndoe123"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-700"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-700"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="johndoe@company.com"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-700"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Temporary Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-700"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">System Role</label>
                        <select
                            name="role"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 font-medium text-slate-700 cursor-pointer appearance-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="HR">HR Manager</option>
                            <option value="MANAGER">Manager</option>
                        </select>
                    </div>

                    {/* Department (UI only for now) */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                        <select
                            name="department"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 font-medium text-slate-700 cursor-pointer appearance-none"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Product">Product</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl text-white font-black text-lg tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 ${
                                loading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-100'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    CREATING ACCOUNT...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={24} />
                                    CREATE EMPLOYEE PROFILE
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            <p className="text-center text-slate-400 mt-8 text-sm font-medium">
                Note: Created accounts will require HR validation before activation.
            </p>
        </div>
    );
};

export default EmployeeCreation;
