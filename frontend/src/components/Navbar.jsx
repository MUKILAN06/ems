import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, LayoutDashboard, ListTodo, 
  CalendarCheck, AlertCircle, Bell, User 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Leaves', path: '/leave', icon: CalendarCheck },
    { name: 'Issues', path: '/issues', icon: AlertCircle },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-xl">E</span>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">EMS CLOUD</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {menuItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 transition-all no-underline hover:text-blue-600"
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all relative">
           <Bell size={22} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-all">{user?.username}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{user?.role}</p>
           </div>
           <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-all border border-transparent group-hover:border-blue-100">
              <User size={20} className="text-slate-500 group-hover:text-blue-600" />
           </div>
           <button 
             onClick={handleLogout}
             className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
             title="Logout"
           >
             <LogOut size={20} />
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
