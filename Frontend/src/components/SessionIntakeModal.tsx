import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, UploadCloud, FileText, Sparkles, Loader2, Target, Calendar, Activity } from "lucide-react";
import AgentThinkingLoader from "./agentThinkingLoader";

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
  resumeText?: string;
  activityLog?: ActivityEntry[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SessionIntakeModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [resumeText, setResumeText] = useState("");
  const [goalPrompt, setGoalPrompt] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [competency, setCompetency] = useState("intermediate");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["Curator Agent", "Schedule Agent"]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

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
            onClose();
            navigate(`/dashboard/tasks/${sessionId}`);
          }, 900);
        }
      } catch {
        // Keep the loader visible and continue polling so the user can still follow the live flow.
      }
    };

    poll();
    const timer = window.setInterval(poll, 1300);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isDeploying, sessionId, navigate, onClose]);

  if (!open) return null;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployError(null);
    setSnapshot(null);
    setStartedAt(Date.now());

    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      const token = localStorage.getItem("taskSchedulerToken");

      const form = new FormData();
      if (activeTab === "upload") {
        const input = resumeInputRef.current;
        if (input?.files?.length) form.append("resume", input.files[0]);
      } else {
        form.append("resumeText", resumeText);
      }

      form.append("extraContext", goalPrompt);
      form.append("company", company);
      form.append("role", role);
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
    } catch (err: any) {
      setDeployError(err?.message || "Unable to deploy session");
      setIsDeploying(false);
      setStartedAt(null);
    }
  };

  const toggleAgent = (agent: string) => {
    setSelectedAgents((prev) => (prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]));
  };

  const handleRetryDeploy = () => {
    setDeployError(null);
    setIsDeploying(false);
    setSessionId(null);
    setSnapshot(null);
    setStartedAt(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <AgentThinkingLoader
        open={isDeploying}
        session={snapshot}
        error={deployError}
        elapsedMs={startedAt ? Date.now() - startedAt : 0}
        onRetry={handleRetryDeploy}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close intake modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Deploy New Agent Session</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Fill only the essentials. After deploy, you will see a live agent trace before tasks open.
          </p>
        </div>

        <form onSubmit={handleDeploy} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="h-4 w-4 text-indigo-600" /> Context Source
            </div>

            <div className="mb-3 flex rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${activeTab === "upload" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
              >
                Upload Resume
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${activeTab === "text" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
              >
                Paste Text
              </button>
            </div>

            {activeTab === "upload" ? (
              <div className="space-y-3">
                {resumeFileName ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 shadow-sm">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">Selected File</p>
                        <p className="truncate font-semibold">{resumeFileName}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFileName(null);
                        if (resumeInputRef.current) resumeInputRef.current.value = "";
                      }}
                      className="rounded-full p-1.5 text-emerald-700 transition-colors hover:bg-emerald-100"
                      aria-label="Clear selected file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-600 hover:border-indigo-400">
                  <UploadCloud className="h-4 w-4" /> Choose PDF
                  <input
                    ref={resumeInputRef}
                    id="modal-resume-file"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] ?? null;
                      setResumeFileName(file ? file.name : null);
                    }}
                  />
                </label>
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Paste your resume or relevant profile text"
              />
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Primary Goal</label>
              <textarea
                required
                value={goalPrompt}
                onChange={(e) => setGoalPrompt(e.target.value)}
                className="h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="What outcome do you want from this plan?"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Target Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Frontend Engineer"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <Calendar className="h-3.5 w-3.5" /> Deadline
              </label>
              <input
                required
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <Activity className="h-3.5 w-3.5" /> Competency
              </label>
              <select
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Agent Swarm</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {["Curator Agent", "Schedule Agent", "Mock Interviewer"].map((agent) => {
                const active = selectedAgents.includes(agent);
                return (
                  <button
                    key={agent}
                    type="button"
                    onClick={() => toggleAgent(agent)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${active ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                  >
                    {agent}
                  </button>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            disabled={isDeploying}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Deploying…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Deploy Agent
              </>
            )}
          </button>

          <p className="text-center text-xs font-medium text-slate-400">
            The next screen shows a live execution trace so users can verify what the agent is doing.
          </p>
        </form>
      </div>
    </div>
  );
}