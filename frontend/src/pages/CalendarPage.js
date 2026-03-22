import React, { useState } from 'react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateCalendarCells = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const totalDays = daysInMonth(month, year);
        const startDay = firstDayOfMonth(month, year);
        const cells = [];

        // Add empty cells for previous month's padding
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="p-4 border border-gray-100 bg-gray-50/50"></div>);
        }

        // Add actual day cells
        for (let day = 1; day <= totalDays; day++) {
            const isToday = day === new Date().getDate() && 
                             month === new Date().getMonth() && 
                             year === new Date().getFullYear();

            cells.push(
                <div 
                    key={day} 
                    className={`p-4 border border-gray-100 relative group cursor-pointer transition-all hover:bg-indigo-50/50 ${isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}
                >
                    <span className={`text-sm font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {day}
                    </span>
                    {day % 5 === 0 && (
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        </div>
                    )}
                </div>
            );
        }

        return cells;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
                        Work <span className="text-indigo-600">Calendar</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Keep track of your schedule and events</p>
                </div>
                
                <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md min-w-[160px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button 
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden backdrop-blur-sm bg-white/90">
                <div className="grid grid-cols-7 bg-slate-50/80 border-b border-slate-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-collapse">
                    {generateCalendarCells()}
                </div>
            </div>

            {/* Quick Stats/Summary Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {[
                    { label: 'Upcoming Events', value: '4', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'blue' },
                    { label: 'Pending Tasks', value: '12', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'indigo' },
                    { label: 'Leave Applied', value: '2', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'purple' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;
