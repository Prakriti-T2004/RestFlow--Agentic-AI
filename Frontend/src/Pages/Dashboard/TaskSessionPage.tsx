import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, Circle, Loader2, Sparkles, Target, ArrowLeft, BookOpen, BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Task = {
  title: string;
  description?: string;
  resources?: string[];
  dueDate?: string;
  priority?: number;
  prepStatus?: "idle" | "running" | "completed" | "failed";
  prepSummary?: string;
  prepSteps?: string[];
};

type Session = {
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  tasks?: Task[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function TaskSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      try {
        const token = localStorage.getItem("taskSchedulerToken");
        const resp = await fetch(`${API_BASE}/api/v1/sessions/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || "Unable to load tasks");
        if (mounted) {
          setSession(data.data);
          setError(null);
          setLoading(false);
        }
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || "Unable to load tasks");
          setLoading(false);
        }
      }
    };
    load();
    const timer = window.setInterval(load, 4000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [id]);

  const tasks = session?.tasks ?? [];
  const progress = session?.progress ?? 100;

  const prepareTask = async (taskIndex: number) => {
    if (!id) return;
    setBusyIndex(taskIndex);
    try {
      const token = localStorage.getItem("taskSchedulerToken");
      const resp = await fetch(`${API_BASE}/api/v1/sessions/${id}/tasks/${taskIndex}/preparation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Unable to create task preparation");
      const result = data.data;
      setSession((prev) => {
        if (!prev) return prev;
        const nextTasks = [...(prev.tasks ?? [])];
        const existing = nextTasks[taskIndex];
        if (existing) {
          nextTasks[taskIndex] = {
            ...existing,
            prepStatus: result.prepStatus,
            prepSummary: result.prepSummary,
            prepSteps: result.prepSteps,
          };
        }
        return { ...prev, tasks: nextTasks };
      });
    } catch (e: any) {
      setError(e?.message || "Unable to prepare task");
    } finally {
      setBusyIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafe] text-slate-900 font-sans">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Generated Tasks</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Full preparation workspace</p>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden p-6 lg:p-10">
        <div className="relative mx-auto max-w-7xl space-y-8">
          {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Plan ready
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Task roadmap</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
                  The agent has completed the plan. Use the full preparation action on any task to generate a deeper brief.
                </p>
              </div>
              <div className="w-full md:w-72">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Overall progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="mt-2 h-2" />
              </div>
            </div>
          </motion.section>

          <div className="grid gap-4 lg:grid-cols-3">
            <Metric label="Tasks" value={String(tasks.length)} />
            <Metric label="Prepared" value={String(tasks.filter((task) => task.prepStatus === "completed").length)} />
            <Metric label="Ready for study" value={String(tasks.filter((task) => task.prepStatus === "completed").length === tasks.length && tasks.length > 0 ? "Yes" : "In progress")} />
          </div>

          <div className="grid gap-4">
            {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading tasks…</div>}
            {!loading && tasks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">No tasks were generated.</div>}
            {tasks.map((task, index) => (
              <motion.div
                key={`${task.title}-${index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">{task.title}</h3>
                      {typeof task.priority === "number" && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">P{task.priority}</span>}
                      <StatusPill status={task.prepStatus ?? "idle"} />
                    </div>
                    {task.description && <p className="max-w-3xl text-sm leading-6 text-slate-600">{task.description}</p>}
                    {task.resources?.length ? <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{task.resources.length} starter resources attached</p> : null}
                    {task.dueDate && <p className="text-xs font-medium text-slate-400">Due {format(new Date(task.dueDate), "EEE, MMM d • h:mm a")}</p>}
                  </div>

                  <Button
                    onClick={() => prepareTask(index)}
                    disabled={busyIndex === index}
                    className="rounded-full bg-slate-900 px-5 py-2 font-bold text-white hover:bg-slate-800"
                  >
                    {busyIndex === index ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Create full preparation
                      </>
                    )}
                  </Button>
                </div>

                {task.prepSummary && (
                  <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-900">
                      <BookOpen className="h-4 w-4" /> Full preparation
                    </div>
                    <p className="text-sm leading-6 text-indigo-950/80">{task.prepSummary}</p>
                    {task.prepSteps?.length ? (
                      <ol className="mt-4 space-y-2 text-sm text-indigo-950/80">
                        {task.prepSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3 rounded-xl bg-white/80 px-3 py-2">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">{stepIndex + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: "idle" | "running" | "completed" | "failed" }) {
  const classes = {
    idle: "bg-slate-100 text-slate-600",
    running: "bg-amber-50 text-amber-700",
    completed: "bg-emerald-50 text-emerald-700",
    failed: "bg-rose-50 text-rose-700",
  }[status];

  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${classes}`}>{status}</span>;
}