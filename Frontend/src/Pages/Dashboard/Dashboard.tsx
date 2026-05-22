import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SessionIntakeModal from "@/components/SessionIntakeModal";
import { 
  LayoutDashboard, CheckSquare, CalendarDays, BarChart3, 
  Settings, Bell, Search, Menu, X, Plus, 
  BrainCircuit, TrendingUp, Clock, Target, 
  ChevronRight, PlayCircle, MoreHorizontal
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

// --- MOCK DATA ---
const performanceData = [
  { name: "Mon", score: 40, expected: 45 },
  { name: "Tue", score: 55, expected: 50 },
  { name: "Wed", score: 45, expected: 55 },
  { name: "Thu", score: 70, expected: 60 },
  { name: "Fri", score: 65, expected: 65 },
  { name: "Sat", score: 85, expected: 70 },
  { name: "Sun", score: 92, expected: 75 },
];

const upcomingTasks = [
  { id: 1, title: "System Design: Load Balancing", time: "45 mins", type: "Deep Dive", priority: "High", completed: false },
  { id: 2, title: "Behavioral: Conflict Resolution", time: "30 mins", type: "Mock Interview", priority: "Medium", completed: false },
  { id: 3, title: "DSA: Dynamic Programming", time: "60 mins", type: "Practice", priority: "High", completed: true },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
    <div className="min-h-screen bg-[#f8fafe] text-slate-900 font-sans flex overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#0f172a]">AgentFlow</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Menu</p>
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: CheckSquare, label: "Tasks & Roadmap" },
            { icon: CalendarDays, label: "Calendar" },
            { icon: BarChart3, label: "Analytics" },
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-indigo-600" : "text-slate-400"}`} />
              {item.label}
            </button>
          ))}

          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Settings</p>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold">
            <Settings className="w-5 h-5 text-slate-400" />
            Preferences
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
            <img src="https://i.pravatar.cc/150?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">Alex Developer</h4>
              <p className="text-xs font-medium text-slate-500 truncate">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Abstract Background Elements inside Main */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_60%)] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_60%)] rounded-full pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 hidden sm:block">Overview</h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks, docs..." 
                className="pl-9 pr-4 py-2 bg-slate-100/70 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-full text-sm font-medium w-64 transition-all outline-none"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-full border border-slate-200 shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setSessionModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Session
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Hero / Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-500/20"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black mb-3">Keep it up, Alex! 🚀</h1>
                  <p className="text-indigo-100 font-medium text-lg max-w-xl">
                    Your AI agent has scheduled <span className="font-bold text-white">3 high-priority tasks</span> for today. You're tracking 15% ahead of your Google SWE interview timeline.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-extrabold text-sm hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" /> Start Next Task
                    </button>
                    <button className="bg-indigo-700/50 hover:bg-indigo-700/80 backdrop-blur-sm border border-indigo-400/30 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                      View Roadmap
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl min-w-[200px]">
                  <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Interview In</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">14</span>
                    <span className="text-indigo-200 font-bold">Days</span>
                  </div>
                  <div className="w-full h-1.5 bg-indigo-900/40 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[65%]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Prep Completion", value: "65%", sub: "+5% this week", icon: Target, color: "text-emerald-600", bg: "bg-emerald-100", trend: "up" },
                { title: "Study Hours", value: "24.5", sub: "3.2 hrs today", icon: Clock, color: "text-blue-600", bg: "bg-blue-100", trend: "up" },
                { title: "AI Readiness Score", value: "88/100", sub: "Strong match", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100", trend: "up" },
                { title: "Tasks Pending", value: "12", sub: "3 overdue", icon: CheckSquare, color: "text-amber-600", bg: "bg-amber-100", trend: "down" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{stat.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                    </div>
                    <p className={`text-xs font-bold mt-2 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {stat.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Layout Grid: Chart + Upcoming */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Chart Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Performance Trajectory</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Mock interview scores over the last 7 days</p>
                  </div>
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                        labelStyle={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="expected" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2}} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Upcoming Tasks Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-extrabold text-slate-900">Today's Focus</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className={`p-4 rounded-2xl border transition-all ${task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}>
                      <div className="flex items-start gap-3">
                        <button className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-500 text-transparent'}`}>
                          <CheckSquare className="w-3 h-3" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold truncate ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.time}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{task.type}</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insight Mini-Banner */}
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100/50">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm mt-0.5">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-indigo-900 mb-1">Agent Insight</h4>
                      <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                        You're struggling with Dynamic Programming. I've adjusted your roadmap to include 2 extra LeetCode medium DP questions tomorrow.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>

            </div>

          </div>
        </div>

      </main>
    </div>
    <SessionIntakeModal open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} />
    </>
  );
}
