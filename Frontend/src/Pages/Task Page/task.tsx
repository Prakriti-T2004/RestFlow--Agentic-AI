import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, BrainCircuit, Sparkles, BookOpen, 
  MoreVertical, Zap, Calendar, FileText, LayoutGrid, 
  Settings, Plus, User, Terminal, Loader2, Cpu, 
  Network, Code, Server, ArrowUpRight, PlayCircle, 
  ChevronRight, CircleDashed, ArrowRight, ShieldCheck, 
  MessageSquare, ListChecks, ArrowLeft
} from "lucide-react";

// --- INDUSTRY-LEVEL MOCK DATA ---
const prepModules = [
  {
    id: "m1",
    title: "Core Engineering: Advanced Java",
    icon: Code,
    color: "blue",
    progress: 33,
    topics: [
      { id: "t1", title: "JVM Internals & Memory Management", priority: "High", est: "1.5h", status: "pending" },
      { id: "t2", title: "Multithreading & Concurrency", priority: "High", est: "2h", status: "pending" },
      { id: "t3", title: "Java Streams & Functional Interfaces", priority: "Medium", est: "1h", status: "completed" },
    ]
  },
  {
    id: "m2",
    title: "System Design & Architecture",
    icon: Server,
    color: "violet",
    progress: 0,
    topics: [
      { id: "t4", title: "Microservices & API Gateways", priority: "High", est: "2h", status: "pending" },
      { id: "t5", title: "Distributed Caching (Redis/Memcached)", priority: "High", est: "1.5h", status: "pending" },
      { id: "t6", title: "Database Sharding & Replication", priority: "High", est: "2h", status: "pending" },
    ]
  },
  {
    id: "m3",
    title: "Data Structures & Algorithms",
    icon: Network,
    color: "emerald",
    progress: 15,
    topics: [
      { id: "t7", title: "Graph Traversal (BFS/DFS/A*)", priority: "High", est: "2.5h", status: "in-progress" },
      { id: "t8", title: "Dynamic Programming Patterns", priority: "High", est: "3h", status: "pending" },
      { id: "t9", title: "Advanced Trees (Trie, Segment)", priority: "Medium", est: "1.5h", status: "pending" },
    ]
  }
];

export default function TaskDashboard() {
  const [modules, setModules] = useState(prepModules);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [agentState, setAgentState] = useState("idle"); // idle | thinking | complete
  const [generatedData, setGeneratedData] = useState(null);
  const [thinkingLog, setThinkingLog] = useState([]);
  const logEndRef = useRef(null);

  // Auto-scroll agent logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thinkingLog]);

  const deployAgent = (topic) => {
    setSelectedTopic(topic);
    setAgentState("thinking");
    setGeneratedData(null);
    setThinkingLog([]);

    const steps = [
      { text: "Initializing Nexus Research Agent...", delay: 500 },
      { text: `Analyzing task parameters: "${topic.title}"`, delay: 1000 },
      { text: "Querying FAANG interview databases...", delay: 1800 },
      { text: "Cross-referencing production-level best practices...", delay: 2600 },
      { text: "Synthesizing deep-dive study material...", delay: 3400 },
      { text: "Formatting actionable execution plan...", delay: 4000 }
    ];

    let currentStep = 0;
    
    const executeStep = () => {
      if (currentStep < steps.length) {
        setThinkingLog(prev => [...prev, steps[currentStep].text]);
        currentStep++;
        if (currentStep < steps.length) {
          setTimeout(executeStep, steps[currentStep].delay - steps[currentStep - 1].delay);
        } else {
          setTimeout(finalizeAgent, 800);
        }
      }
    };

    setTimeout(executeStep, steps[0].delay);
  };

  const finalizeAgent = () => {
    setAgentState("complete");
    setGeneratedData({
      title: selectedTopic.title,
      industryApproach: "In massive-scale distributed systems, mastering this concept prevents cascading failures and ensures sub-millisecond p99 latencies. Top-tier companies expect you to understand not just the 'how', but the underlying operational trade-offs.",
      keyNodes: [
        "Garbage Collection Roots & Reachability Algorithms",
        "The Generational Hypothesis (Eden, Survivor, Tenured)",
        "Tuning G1GC vs ZGC for high-throughput applications",
        "Memory leak detection and heap dump analysis"
      ],
      mockQuestions: [
        "How would you tune the JVM for an application with a 50GB heap experiencing long stop-the-world pauses?",
        "Explain the happens-before relationship in the Java Memory Model and how volatile keyword enforces it."
      ],
      resources: [
        { title: "Oracle HotSpot Architecture Guide", type: "Documentation", link: "#" },
        { title: "Deep Dive: ZGC Concurrent Collector", type: "Engineering Blog", link: "#" },
        { title: "G1GC Tuning in Production Systems", type: "Case Study", link: "#" }
      ]
    });
  };

  const getBadgeStyles = (priority) => {
    switch(priority) {
      case "High": return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
      case "Medium": return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
      case "Low": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20";
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fbff] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-500 selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
      
      {/* Global Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* --- SIDEBAR --- */}
      <aside className="w-20 bg-white dark:bg-[#0b1121] border-r border-slate-200 dark:border-slate-800/60 flex flex-col items-center py-6 gap-8 z-20 flex-shrink-0 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <nav className="flex flex-col gap-4 w-full px-3">
          <button className="w-full aspect-square rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20"><ListChecks className="w-5 h-5" /></button>
          <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-colors"><LayoutGrid className="w-5 h-5" /></button>
          <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-colors"><Calendar className="w-5 h-5" /></button>
          <button className="w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-colors"><Settings className="w-5 h-5" /></button>
        </nav>
        <button className="mt-auto w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full" />
        </button>
      </aside>

      {/* --- LEFT PANEL: Task Scheduler Roadmap --- */}
      <section className="w-full md:w-[420px] lg:w-[480px] bg-white/50 dark:bg-[#0b1121]/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/60 flex flex-col h-full z-10 flex-shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0b1121]">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3 cursor-pointer w-max hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">Active Sprint</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">SDE II Preparation</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Target: Amazon / Google</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">24%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</div>
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[24%]"></div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 no-scrollbar">
          {modules.map((module) => (
            <div key={module.id} className="relative">
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-${module.color}-100 dark:bg-${module.color}-900/20 text-${module.color}-600 dark:text-${module.color}-400 border border-${module.color}-200 dark:border-${module.color}-800/50 shadow-sm`}>
                    <module.icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-[15px] font-bold text-[#0f172a] dark:text-white tracking-tight">{module.title}</h2>
                </div>
              </div>

              {/* Topics Container */}
              <div className="space-y-3 pl-[22px] border-l-2 border-slate-100 dark:border-slate-800 ml-4 relative">
                {module.topics.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id;
                  
                  return (
                    <motion.div 
                      key={topic.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => deployAgent(topic)}
                      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                        isSelected 
                          ? 'bg-indigo-50/50 dark:bg-slate-800/80 border-indigo-300 dark:border-indigo-500/50 shadow-indigo-500/10' 
                          : 'bg-white dark:bg-[#0f172a]/80 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Timeline Node */}
                      <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 w-[20px] h-0.5 bg-slate-100 dark:bg-slate-800" />
                      <div className={`absolute -left-[28px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-[#070b14] shadow-sm flex items-center justify-center ${
                        topic.status === 'completed' ? 'bg-emerald-500' : topic.status === 'in-progress' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        {topic.status === 'completed' && <CheckCircle2 className="w-2 h-2 text-white" />}
                      </div>

                      <div className="flex flex-col gap-2">
                        {/* Tags */}
                        <div className="flex items-center justify-between">
                           <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeStyles(topic.priority)}`}>
                             {topic.priority} Priority
                           </span>
                           <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {topic.est}
                           </span>
                        </div>
                        
                        <h3 className={`font-semibold text-sm leading-snug ${isSelected ? 'text-indigo-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {topic.title}
                        </h3>
                        
                        {/* Agent Action Button */}
                        <div className="mt-2 flex items-center">
                          <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            {isSelected ? (agentState === 'thinking' ? 'Agent Processing...' : 'Guide Generated') : 'Deploy Agent Deep-Dive'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- RIGHT PANEL: Agent Workspace --- */}
      <section className="flex-1 bg-transparent relative flex flex-col h-full overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Idle */}
          {agentState === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-slate-200 dark:border-slate-800 rounded-full animate-[spin_10s_linear_infinite] border-dashed"></div>
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                  <BrainCircuit className="w-8 h-8 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">Agent Workspace Ready</h3>
              <p className="text-slate-500 font-medium text-sm max-w-sm leading-relaxed">
                Select a task from your roadmap to deploy the Nexus Research Agent. It will instantly generate an industry-standard study guide.
              </p>
            </motion.div>
          )}

          {/* STATE 2: Agent Thinking (Modern Terminal UI) */}
          {agentState === "thinking" && (
            <motion.div 
              key="thinking"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12"
            >
              <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-[#1e293b] px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Agent Execution Pipeline</span>
                  <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin ml-auto" />
                </div>
                
                {/* Log Output */}
                <div className="p-6 md:p-8 space-y-4 min-h-[320px] flex flex-col justify-end bg-slate-900 text-slate-300 font-mono text-sm relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-[shimmer_2s_infinite]"></div>
                  
                  {thinkingLog.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-emerald-400 font-mono mt-0.5">❯</span>
                      <span className="leading-relaxed">{log}</span>
                    </motion.div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2.5 h-5 bg-indigo-500 ml-5 mt-2"
                  />
                  <div ref={logEndRef} />
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 3: Completed Study Guide */}
          {agentState === "complete" && generatedData && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="absolute inset-0 overflow-y-auto no-scrollbar"
            >
              <div className="max-w-4xl mx-auto p-6 md:p-10 lg:p-12 space-y-8 pb-32">
                
                {/* Guide Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                    <Sparkles className="w-4 h-4" /> Agent Generated Guide
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-tight mb-2">
                    {generatedData.title}
                  </h2>
                  <p className="text-slate-500 font-medium">Prioritized notes and resources tailored for tier-1 interviews.</p>
                </div>

                {/* Section 1: Industry Context */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-500/30 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-white flex items-center gap-2 mb-4 relative z-10">
                    <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Industry Perspective
                  </h3>
                  <p className="text-slate-700 dark:text-indigo-100/80 leading-relaxed font-medium text-[15px] relative z-10">
                    {generatedData.industryApproach}
                  </p>
                </div>

                {/* Grid Content */}
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Knowledge Nodes */}
                  <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Network className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Core Concepts
                    </h3>
                    <ul className="space-y-4">
                      {generatedData.keyNodes.map((concept, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interview Questions */}
                  <div className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Mock Questions
                    </h3>
                    <div className="space-y-4">
                      {generatedData.mockQuestions.map((q, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-[#1e293b]/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                          <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold leading-relaxed mb-3">"{q}"</p>
                          <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
                            <PlayCircle className="w-3.5 h-3.5" /> Practice with Interview Agent
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 pl-2">
                    <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Curated Resources
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedData.resources.map((res, i) => (
                      <a key={i} href={res.link} className="bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 rounded-2xl p-5 group transition-all shadow-sm hover:shadow-md block">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm mb-1.5 line-clamp-2 leading-snug">{res.title}</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{res.type}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mark as Complete CTA */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex justify-end">
                  <button className="flex items-center gap-2 bg-[#0f172a] dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                    <CheckCircle2 className="w-4 h-4" /> Mark Topic as Complete
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Overrides */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}