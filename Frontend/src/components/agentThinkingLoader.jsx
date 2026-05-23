import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BrainCircuit, FileText, Loader2, Sparkles, XCircle } from "lucide-react";

export default function AgentThinkingLoader({ open, session, error, elapsedMs, onRetry }) {
  const endRef = useRef(null);
  const timeline = session?.activityLog ?? [];
  const status = session?.status ?? "pending";
  const latestEntry = timeline[timeline.length - 1] ?? null;
  const previousEntry = timeline.length > 1 ? timeline[timeline.length - 2] : null;
  const resumePreview = useMemo(() => summarizeResume(session?.resumeText), [session?.resumeText]);

  const currentThought = useMemo(() => {
    if (latestEntry?.message) return latestEntry.message;
    if (status === "completed") return "The roadmap is finished and ready to open the task page.";
    if (status === "failed") return "The agent stopped while assembling the roadmap.";
    return "The agent is reading the uploaded context, extracting interview signals, and deciding the first topic to focus on.";
  }, [latestEntry, status]);

  const buildState = useMemo(() => {
    const progress = Math.min(100, session?.progress ?? (timeline.length > 0 ? timeline.length * 14 : 10));
    const lastStep = latestEntry?.stage || session?.currentStep || "initializing";
    const summary = latestEntry?.details || "The live log is showing the exact step the agent is currently building.";
    return {
      progress,
      step: lastStep,
      summary,
      title: status === "completed" ? "Roadmap finalized" : "Roadmap in progress",
      message: latestEntry?.message || "The agent is organizing topics, ordering them by interview impact, and assigning time blocks.",
    };
  }, [latestEntry, session, status, timeline.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [timeline.length]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020617]/94 p-4 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_30%)]" />
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="no-scrollbar relative grid w-full max-w-6xl gap-4 overflow-y-auto rounded-4xl border border-slate-700/70 bg-slate-950/80 p-4 shadow-2xl shadow-black/40 lg:max-h-[84vh] lg:grid-cols-12"
          >
            <section className="flex min-h-0 flex-col rounded-3xl border border-slate-800/90 bg-slate-950/70 p-4 lg:col-span-4">
              <ZoneHeader title="What the agent is thinking" subtitle="Live session state only" icon={<Activity className="h-4 w-4 text-cyan-300" />} />

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 no-scrollbar">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100/80">
                    <Sparkles className="h-3.5 w-3.5" /> Current thought
                  </div>
                  <TypewriterText text={currentThought} />
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    <span>{status}</span>
                    <span>{timeline.length} live updates</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400"
                      animate={{ width: `${buildState.progress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    <FileText className="h-3.5 w-3.5 text-slate-400" /> Resume extract
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{resumePreview}</p>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1 no-scrollbar">
                  {timeline.length === 0 ? (
                    <EmptyThought label="Waiting for agent output" />
                  ) : (
                    timeline.slice(-6).map((entry, index) => (
                      <ThoughtCard
                        key={`${entry.stage}-${entry.createdAt ?? index}`}
                        entry={entry}
                        active={index === timeline.slice(-6).length - 1}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="flex min-h-0 flex-col rounded-3xl border border-slate-800/90 bg-slate-950/70 p-4 lg:col-span-5">
              <ZoneHeader title="What the agent is building" subtitle="The exact roadmap being assembled" icon={<BrainCircuit className="h-4 w-4 text-violet-300" />} />

              <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-4 pr-1 no-scrollbar">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  <span>{buildState.title}</span>
                  <span>{Math.max(1, Math.round(elapsedMs / 1000))}s</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">building now</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{buildState.message}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-400">{buildState.summary}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoTile label="progress" value={`${buildState.progress}%`} />
                  <InfoTile label="agent step" value={buildState.step} />
                  <InfoTile label="duration" value={`${Math.max(1, Math.round(elapsedMs / 1000))}s`} />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">latest output</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    {latestEntry ? (
                      <>
                        <p className="font-semibold text-slate-50">{latestEntry.message}</p>
                        {latestEntry.details ? <p className="leading-6 text-slate-400">{latestEntry.details}</p> : null}
                      </>
                    ) : (
                      <p className="leading-6 text-slate-400">Waiting for the agent to publish its first decision.</p>
                    )}
                    {previousEntry ? <p className="text-xs text-slate-500">Previous: {previousEntry.message}</p> : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex min-h-0 flex-col rounded-3xl border border-slate-800/90 bg-slate-950/70 p-4 lg:col-span-3">
              <ZoneHeader title="Live trace" subtitle="Session activity feed" icon={<FileText className="h-4 w-4 text-emerald-300" />} />

              <div className="mt-4 flex-1 space-y-3 overflow-visible">
                {error ? (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                    <div className="mb-1 flex items-center gap-2 font-bold uppercase tracking-[0.24em] text-rose-200">
                      <XCircle className="h-4 w-4" /> error
                    </div>
                    {error}
                    {status === "failed" ? (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 inline-flex items-center rounded-full border border-rose-300/40 bg-rose-50/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-50 transition hover:bg-rose-50/20"
                      >
                        Try again
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {timeline.length === 0 ? (
                  <EmptyThought label="No trace yet" />
                ) : (
                  timeline.slice(-8).map((entry, index) => (
                    <div key={`${entry.stage}-${entry.createdAt ?? index}`} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{entry.stage.replace(/-/g, " ")}</p>
                        <span className="text-[10px] text-slate-600">{entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString() : "live"}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-100">{entry.message}</p>
                      {entry.details ? <p className="mt-1 text-xs leading-5 text-slate-400">{entry.details}</p> : null}
                    </div>
                  ))
                )}
                <div ref={endRef} className="hidden" />
              </div>
            </section>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ZoneHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-slate-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80">{icon}</span>
          {title}
        </div>
        <p className="mt-1 text-[11px] font-medium text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" /> live
      </div>
    </div>
  );
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 16);

    return () => window.clearInterval(timer);
  }, [text]);

  return <p className="mt-3 text-sm leading-6 text-slate-100">{displayedText}</p>;
}

function ThoughtCard({ entry, active }) {
  return (
    <div className={`rounded-2xl border p-3 ${active ? "border-cyan-400/40 bg-cyan-500/10" : "border-slate-800 bg-slate-900/50"}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{entry.stage.replace(/-/g, " ")}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{entry.message}</p>
      {entry.details ? <p className="mt-1 text-xs leading-5 text-slate-400">{entry.details}</p> : null}
    </div>
  );
}

function EmptyThought({ label }) {
  return <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">{label}</div>;
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-2 text-sm font-bold text-slate-100">{value}</div>
    </div>
  );
}

function summarizeResume(resumeText) {
  if (!resumeText || !resumeText.trim()) return "The extracted resume text will appear here once the upload is processed.";

  const cleaned = resumeText.replace(/\s+/g, " ").trim();
  return cleaned.length > 320 ? `${cleaned.slice(0, 320)}...` : cleaned;
}
