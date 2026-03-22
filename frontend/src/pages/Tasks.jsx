import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, Circle, Clock, Plus, Trash2, 
  Calendar, User, ListTodo, Filter, Search
} from 'lucide-react';
import { format } from 'date-fns';

const Tasks = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('ALL'); // ALL, COMPLETED, PENDING
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Create Task Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedToId: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let res;
      if (isAdmin() || isManager()) {
        res = await api.get('/tasks/all');
      } else {
        res = await api.get(`/tasks/user/${user.id}`);
      }
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await api.put(`/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
       console.error('Error toggling completion', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks/create', newTask);
      setNewTask({ title: '', description: '', assignedToId: '', dueDate: '' });
      setShowAddForm(false);
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert('Error deleting task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = view === 'ALL' || (view === 'COMPLETED' ? task.completed : !task.completed);
    return matchesSearch && matchesView;
  });

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Tasks</h1>
          <p className="text-slate-500 font-medium">Keep track of your goals and deadlines.</p>
        </div>
        
        {(isAdmin() || isManager()) && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            {showAddForm ? <ListTodo size={20} /> : <Plus size={20} />}
            <span>{showAddForm ? 'View List' : 'Assign Task'}</span>
          </button>
        )}
      </div>

      {showAddForm ? (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-slate-800">Assign New Task</h2>
          <form onSubmit={handleCreate} className="space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Task Title</label>
               <input
                 type="text"
                 required
                 className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                 placeholder="Main project milestone..."
                 value={newTask.title}
                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
               />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Assignee ID</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                    value={newTask.assignedToId}
                    onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
               <textarea
                 rows={4}
                 className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                 placeholder="Specific requirements..."
                 value={newTask.description}
                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
               />
             </div>

             <button type="submit" className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200">
               Confirm Assignment
             </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
             <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tasks..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex p-1 bg-slate-100 rounded-2xl w-full lg:w-auto">
               {['ALL', 'PENDING', 'COMPLETED'].map(v => (
                 <button
                   key={v}
                   onClick={() => setView(v)}
                   className={`flex-1 lg:px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {v}
                 </button>
               ))}
             </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <div key={task.id} className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                   <div className={`p-4 rounded-2xl ${task.completed ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                      {task.completed ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                   </div>
                   {(isAdmin() || isManager()) && (
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 bg-slate-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                   )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-black text-xl leading-snug ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3">
                    {task.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                     <div className="flex items-center gap-2 text-slate-400">
                        <User size={14} className="text-blue-500" />
                        <span>ID: {task.assignedToId || task.assignedTo?.id}</span>
                     </div>
                     <div className="flex items-center gap-2 text-red-500">
                        <Calendar size={14} />
                        <span>{format(new Date(task.dueDate), 'MMM dd, HH:mm')}</span>
                     </div>
                  </div>

                  <button
                    onClick={() => toggleComplete(task.id, task.completed)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter transition-all ${
                      task.completed 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-95'
                    }`}
                    disabled={task.completed}
                  >
                    {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    <span>{task.completed ? 'Task Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-slate-200">
                  <ListTodo className="text-slate-300" size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-400">No tasks found</h3>
               <p className="text-slate-300 text-sm font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
