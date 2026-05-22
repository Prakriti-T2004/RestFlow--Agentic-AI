import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  Loader2,
  Mic,
  Search,
  Settings2,
  Sparkles,
  Target,
  Terminal,
  UploadCloud,
  XCircle,
  Zap,
} from "lucide-react";
import AgentDeploymentOverlay from "../../components/AgentDeploymentOverlay";

type ActivityEntry = {
  stage: string;
  message: string;
  details?: string;
  createdAt?: string;
};

type SessionSnapshot = {
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  currentStep?: string;
  activityLog?: ActivityEntry[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";



export default function NewSession() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"upload" | "text" | "audio">("upload");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeFileKey, setResumeFileKey] = useState(0);
  const [goalPrompt, setGoalPrompt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [competency, setCompetency] = useState("intermediate");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["Curator Agent", "Schedule Agent"]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const elapsedMs = startedAt ? Date.now() - startedAt : 0;

  useEffect(() => {
    if (!isDeploying || !sessionId) return;

    let cancelled = false;
    const token = localStorage.getItem("taskSchedulerToken");

    const poll = async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/v1/sessions/${sessionId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || "Unable to fetch session status");
        if (cancelled) return;

        setSnapshot(data.data as SessionSnapshot);

        if (data.data?.status === "completed") {
          window.setTimeout(() => {
            navigate(`/dashboard/tasks/${sessionId}`);
          }, 900);
        }
      } catch (err: any) {
        if (!cancelled) setDeployError(err?.message || "Failed while tracking deployment progress");
      }
    };

    poll();
    const timer = window.setInterval(poll, 1300);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isDeploying, sessionId, navigate]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    setDeployError(null);
    setSnapshot(null);

    try {
      const token = localStorage.getItem("taskSchedulerToken");

      const form = new FormData();
      if (activeTab === "upload") {
        const input = resumeInputRef.current;
        if (!input?.files?.length) {
          throw new Error("Please choose a resume file before deploying.");
        }
        form.append("resume", input.files[0]);
      } else if (activeTab === "text") {
        if (!resumeText.trim()) {
          throw new Error("Please paste your resume or switch to file upload before deploying.");
        }
        form.append("resumeText", resumeText);
      }

      form.append("extraContext", goalPrompt);
      form.append("company", "");
      form.append("role", "");
      form.append("deadline", deadline);
      form.append("competency", competency);
      form.append("agents", JSON.stringify(selectedAgents));

      const resp = await fetch(`${API_BASE}/api/v1/sessions`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Failed to create session");

      setSessionId(data.data.id);
      setIsDeploying(true);
      setStartedAt(Date.now());
    } catch (err: any) {
      setDeployError(err?.message || "Unable to deploy session");
      setIsDeploying(false);
      setStartedAt(null);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#f8fafe] text-slate-900 font-sans selection:bg-indigo-100">
      <AgentDeploymentOverlay open={isDeploying} session={snapshot} error={deployError} elapsedMs={elapsedMs} />

      <header className="h-20 sticky top-0 z-40 flex items-center border-b border-slate-200/80 bg-white/80 px-6 shadow-sm backdrop-blur-xl lg:px-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-6 rounded-full border border-transparent p-2.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/50 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-[#0f172a]">New Agent Session</h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Configure Multi-Agent Parameters</p>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="pointer-events-none absolute top-0 right-0 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_60%)]" style={{ width: 600, height: 600 }} />
        <div className="pointer-events-none absolute bottom-0 left-0 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.08)_0%,transparent_60%)]" style={{ width: 500, height: 500 }} />

        <div className="relative z-10 mx-auto max-w-4xl">
          <form onSubmit={handleDeploy} className="space-y-6 sm:space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="group relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-xl sm:p-8">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-indigo-500 transition-all group-hover:w-2" />

                <h2 className="mb-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#0f172a]">
                  <FileText className="h-6 w-6 text-indigo-500" /> Source Context
                </h2>
                <p className="mb-8 text-sm font-medium text-slate-500">Provide your current resume, profile, or background data for the agent analysis.</p>

                <div className="mb-6 flex w-full rounded-2xl border border-slate-200/50 bg-slate-100/80 p-1.5 sm:w-max">
                  {["upload", "text", "audio"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab as "upload" | "text" | "audio")}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                        activeTab === tab
                          ? "border border-slate-200/50 bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                      }`}
                    >
                      {tab === "upload" && <UploadCloud className="h-4 w-4" />}
                      {tab === "text" && <FileText className="h-4 w-4" />}
                      {tab === "audio" && <Mic className="h-4 w-4" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === "upload" && (
                  <div className="space-y-4">
                    {resumeFileName ? (
                      <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm shadow-sm">
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">Selected Resume</p>
                            <p className="truncate font-semibold text-emerald-950">{resumeFileName}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeFileName(null);
                            setResumeFileKey((value) => value + 1);
                            if (resumeInputRef.current) resumeInputRef.current.value = "";
                          }}
                          className="ml-3 rounded-full p-2 text-emerald-700 transition-colors hover:bg-emerald-100"
                          aria-label="Clear selected resume"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ) : null}

                    <div className="group/upload relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-indigo-200/60 bg-indigo-50/20 p-10 text-center transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/50 sm:p-12">
                      <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-sm transition-transform group-hover/upload:scale-110 group-hover/upload:shadow-lg">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <p className="relative z-10 text-base font-extrabold text-[#0f172a]">Drag and drop your resume PDF</p>
                      <p className="relative z-10 mt-2 text-sm font-medium text-slate-500">or click to browse files</p>
                      <p className="relative z-10 mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {resumeFileName ? "Click again to replace the current file" : "No file selected yet"}
                      </p>
                      <input
                        key={resumeFileKey}
                        ref={resumeInputRef}
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] ?? null;
                          setResumeFileName(file ? file.name : null);
                        }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "text" && (
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume, LinkedIn profile, or current skill set here..."
                    className="h-48 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-sm font-medium text-slate-700 shadow-inner outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                )}

                {activeTab === "audio" && (
                  <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50/80 p-10 text-center shadow-inner">
                    <button type="button" className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-500 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50">
                      <Mic className="relative z-10 h-7 w-7" />
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-rose-400 opacity-20" />
                    </button>
                    <p className="text-sm font-extrabold text-[#0f172a]">Audio capture is coming soon</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">Use upload or text mode for realtime deployment.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="group relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-xl sm:p-8">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-violet-500 transition-all group-hover:w-2" />

                <h2 className="mb-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#0f172a]">
                  <Target className="h-6 w-6 text-violet-500" /> Objective and Timeline
                </h2>
                <p className="mb-8 text-sm font-medium text-slate-500">Define what the agents should optimize for.</p>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Primary Goal Prompt</label>
                    <textarea
                      required
                      value={goalPrompt}
                      onChange={(e) => setGoalPrompt(e.target.value)}
                      placeholder="I want to prepare for a Senior React Developer interview focusing on system design and performance."
                      className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm font-medium shadow-inner outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Target Deadline</label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          required
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-12 text-sm font-bold text-slate-700 shadow-inner outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Current Competency Level</label>
                      <div className="relative">
                        <Activity className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <select
                          value={competency}
                          onChange={(e) => setCompetency(e.target.value)}
                          className="w-full appearance-none cursor-pointer rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-12 text-sm font-bold text-slate-700 shadow-inner outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                        >
                          <option value="beginner">Beginner (0-2 years)</option>
                          <option value="intermediate">Intermediate (2-4 years)</option>
                          <option value="advanced">Advanced (4-7 years)</option>
                          <option value="expert">Expert (7+ years)</option>
                        </select>
                        <ChevronRight className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="group relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-xl sm:p-8">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-amber-500 transition-all group-hover:w-2" />

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="mb-1 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#0f172a]">
                      <BrainCircuit className="h-6 w-6 text-amber-500" /> Agent Swarm Options
                    </h2>
                    <p className="text-sm font-medium text-slate-500">Choose specialized agents for your execution graph.</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                    <Settings2 className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                  {[
                    { title: "Curator Agent", desc: "Finds precise resources and references", activeClasses: "border-amber-400 bg-amber-50/50", iconWrap: "bg-amber-500 text-white" },
                    { title: "Schedule Agent", desc: "Optimizes timeline and daily sequencing", activeClasses: "border-emerald-400 bg-emerald-50/50", iconWrap: "bg-emerald-500 text-white" },
                    { title: "Mock Interviewer", desc: "Builds drill loops and interview simulation", activeClasses: "border-cyan-400 bg-cyan-50/50", iconWrap: "bg-cyan-500 text-white" },
                  ].map((agent, i) => {
                    const active = selectedAgents.includes(agent.title);
                    const icon = i === 0 ? <Search className="h-5 w-5" /> : i === 1 ? <Calendar className="h-5 w-5" /> : <Mic className="h-5 w-5" />;

                    return (
                      <button
                        key={agent.title}
                        type="button"
                        onClick={() => {
                          setSelectedAgents((prev) => (prev.includes(agent.title) ? prev.filter((a) => a !== agent.title) : [...prev, agent.title]));
                        }}
                        className={`relative overflow-hidden rounded-3xl border-2 p-5 text-left transition-all duration-300 sm:p-6 ${active ? agent.activeClasses : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"}`}
                      >
                        <div className="relative z-10 mb-4 flex items-start justify-between">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? agent.iconWrap : "bg-slate-100 text-slate-500"}`}>
                            {icon}
                          </div>
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${active ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 bg-transparent"}`}>
                            {active ? <CheckCircle2 className="h-4 w-4" /> : null}
                          </div>
                        </div>
                        <p className="relative z-10 text-[15px] font-extrabold text-[#0f172a]">{agent.title}</p>
                        <p className="relative z-10 mt-1.5 text-xs font-medium leading-relaxed text-slate-500">{agent.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="pt-4 pb-12">
              <button
                type="submit"
                disabled={isDeploying}
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-3xl bg-indigo-600 text-lg font-extrabold text-white shadow-2xl shadow-indigo-500/30 transition-all hover:-translate-y-1 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 sm:h-20 sm:text-xl"
              >
                <Sparkles className="h-6 w-6 text-indigo-300 transition-colors group-hover:text-white" />
                Deploy Agents and Generate Plan
                {isDeploying ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5 -rotate-90 opacity-60 transition-all group-hover:opacity-100" />}
              </button>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Globe className="h-4 w-4" /> Secure 256-bit encryption
              </div>
            </motion.div>
          </form>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}


