import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Activity,
  BrainCircuit,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Sparkles,
  Target,
  FileText,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ActivityEntry = {
  stage: string;
  message: string;
  details?: string;
  createdAt?: string;
};

type SessionTask = {
  title: string;
  description?: string;
  resources?: string[];
  dueDate?: string;
  priority?: number;
};

type SessionData = {
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  currentStep?: string;
  activityLog?: ActivityEntry[];
  tasks?: SessionTask[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    let timer: number | undefined;

    const loadSession = async () => {
      try {
        const token = localStorage.getItem("taskSchedulerToken");
        const resp = await fetch(`${API_BASE}/api/v1/sessions/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || "Unable to load session");

        if (cancelled) return;
        setSession(data.data);
        setError(null);
        setLoading(false);

        if (data.data?.status === "completed" || data.data?.status === "failed") {
          if (timer) window.clearInterval(timer);
        }
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Unable to load session");
        setLoading(false);
      }
    };

    loadSession();
    timer = window.setInterval(loadSession, 2000);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [id]);

  const activityLog = session?.activityLog ?? [];
  const progress = session?.progress ?? (session?.status === "completed" ? 100 : session?.status === "failed" ? 100 : 0);
  const latestMessage = activityLog[activityLog.length - 1];

  useEffect(() => {
    if (session?.status === "completed" && id) {
      navigate(`/dashboard/tasks/${id}`, { replace: true });
    }
  }, [session?.status, id, navigate]);

  const statusTone = session?.status === "completed"
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : session?.status === "failed"
    ? "text-rose-700 bg-rose-50 border-rose-200"
    : "text-indigo-700 bg-indigo-50 border-indigo-200";

  return (
    <div className="min-h-screen bg-[#f8fafe] text-slate-900 font-sans">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Agent Execution Trace</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Live transparent workflow stream</p>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden p-6 lg:p-10">
        <div className="absolute top-0 right-0 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.07)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl space-y-8">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          )}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] ${statusTone}`}>
                  {session?.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : session?.status === "failed" ? <AlertTriangle className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
                  {session?.status ?? "loading"}
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Your agent is building the plan</h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                    This page streams each planning step in real time so users can see what the agent is evaluating, what it is doing now, and what comes next.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard label="Progress" value={`${Math.min(100, Math.max(0, Math.round(progress)))}%`} icon={Activity} accent="indigo" />
                  <StatCard label="Tasks generated" value={String(session?.tasks?.length ?? 0)} icon={Target} accent="emerald" />
                  <StatCard label="Current step" value={session?.currentStep?.replace(/-/g, " ") ?? "Waiting"} icon={Clock} accent="amber" />
                </div>
              </div>

              <div className="min-w-70 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Current agent summary
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {latestMessage?.message || "The session is starting up and waiting for the next orchestration update."}
                </p>
                {latestMessage?.details && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-500">
                    {latestMessage.details}
                  </div>
                )}
                <div className="mt-5">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Execution timeline</h3>
                  <p className="text-sm font-medium text-slate-500">Readable steps from session intake to roadmap generation</p>
                </div>
                {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
              </div>

              <div className="space-y-4">
                {(loading && activityLog.length === 0 ? starterSteps : activityLog).map((entry, index) => (
                  <TimelineRow
                    key={`${entry.stage}-${entry.createdAt ?? index}`}
                    title={entry.stage.replace(/-/g, " ")}
                    message={entry.message}
                    details={entry.details}
                    time={entry.createdAt}
                    active={index === activityLog.length - 1 && session?.status !== "completed" && session?.status !== "failed"}
                    done={index < activityLog.length - 1 || session?.status === "completed"}
                  />
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Generated roadmap</h3>
                  <p className="text-sm font-medium text-slate-500">The final task plan appears here once orchestration completes</p>
                </div>
                <FileText className="h-5 w-5 text-slate-300" />
              </div>

              {session?.tasks?.length ? (
                <div className="space-y-3">
                  {session.tasks.map((task, index) => (
                    <div key={`${task.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-indigo-100 p-2 text-indigo-600">
                          <Search className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900">{task.title}</h4>
                            {typeof task.priority === "number" && (
                              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                                P{task.priority}
                              </span>
                            )}
                          </div>
                          {task.description && <p className="mt-1 text-sm text-slate-500">{task.description}</p>}
                          {task.resources?.length ? (
                            <p className="mt-2 text-xs font-medium text-slate-400">
                              {task.resources.length} resources attached
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  {session?.status === "failed"
                    ? "The agent stopped before it could generate a roadmap. Check the execution timeline for the failure step."
                    : "Tasks will appear here as soon as the agent completes planning."}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Target className="h-4 w-4 text-emerald-600" />
                  What the user sees
                </div>
                <p className="mt-2 leading-6">
                  The page intentionally exposes progress updates and decision summaries, not hidden model reasoning. That keeps the workflow transparent without leaking internal chain-of-thought.
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

function TimelineRow({
  title,
  message,
  details,
  time,
  active,
  done,
}: {
  title: string;
  message: string;
  details?: string;
  time?: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : active ? (
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-slate-900 capitalize">{title}</h4>
          {time && <span className="text-xs font-medium text-slate-400">{formatTimestamp(time)}</span>}
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
        {details && <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{details}</p>}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "indigo" | "emerald" | "amber";
}) {
  const accentClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{value}</div>
        </div>
        <div className={`rounded-xl p-2 ${accentClasses}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(value?: string) {
  if (!value) return "just now";
  try {
    return format(new Date(value), "h:mm a");
  } catch {
    return "just now";
  }
}

const starterSteps: ActivityEntry[] = [
  { stage: "session-created", message: "Session created. The agent is preparing to inspect your resume and build a plan." },
  { stage: "queued-for-processing", message: "The session has entered the processing pipeline and is waiting for resume analysis." },
  { stage: "extracting-text", message: "Reading the document and converting it into text that the planner can reason over." },
  { stage: "plan-building", message: "Converting the extracted signals into a prioritized task roadmap." },
];