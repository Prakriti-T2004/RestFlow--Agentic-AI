import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, BrainCircuit, DatabaseZap, Sparkles, Workflow } from "lucide-react";

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

type CognitiveStep = {
  id: string;
  type: "intent" | "planning" | "memory" | "tool" | "reasoning" | "validation" | "response";
  title: string;
  message: string;
  confidence: number;
  status: "thinking" | "completed" | "failed";
  agent: string;
};

export default function AgentDeploymentOverlay({
  open,
  session,
  error,
  elapsedMs,
}: {
  open: boolean;
  session: SessionSnapshot | null;
  error: string | null;
  elapsedMs: number;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  const timeline = session?.activityLog ?? [];
  const progress = session?.progress ?? 0;
  const status = session?.status ?? "pending";
  const confidence = useMemo(() => computeConfidence(progress, timeline.length, status), [progress, timeline.length, status]);
  const steps = useMemo(() => buildCognitiveSteps(timeline, progress, status), [timeline, progress, status]);
  const activeStep = steps.find((step) => step.status === "thinking") ?? steps[steps.length - 1] ?? null;
  const inspectorFacts = useMemo(() => buildInspectorFacts(timeline, progress, confidence), [timeline, progress, confidence]);
  const signalDepth = Math.min(8, Math.max(3, timeline.length + 2));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [timeline.length]);

  const helperMessage = useMemo(() => {
    if (status === "completed") return "Plan finalized. Redirecting to your task goal page...";
    if (status === "failed") return "Processing stopped due to an error. Please retry deployment.";
    if (timeline.length === 0) return "Session created. Cognitive core is synchronizing context.";
    return `Live cognition active: ${Math.round(elapsedMs / 1000)}s elapsed`;
  }, [status, timeline.length, elapsedMs]);

  const streamText = activeStep?.message || helperMessage;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-[#020617]/92 p-4 backdrop-blur-xl"
          style={{ zIndex: 120 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08] mix-blend-screen" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative grid w-full max-w-7xl gap-5 overflow-hidden rounded-4xl border border-slate-700/70 bg-slate-950/78 p-4 shadow-2xl shadow-black/40 lg:grid-cols-12"
            style={{ zIndex: 121, height: "84vh" }}
          >
            <section className="flex h-full flex-col rounded-3xl border border-slate-800/90 bg-slate-950/60 p-4 backdrop-blur-xl lg:col-span-4">
              <ZoneHeader title="Neural Activity" subtitle="Summarized cognition, not raw logs" icon={<Activity className="h-4 w-4 text-cyan-300" />} />

              <div className="mt-4 flex-1 space-y-3 overflow-hidden">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <ThinkingLine text={streamText} />
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    <span>Intent → Plan → Validate</span>
                    <span>{steps.length} cognitive states</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <motion.div className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400" animate={{ width: `${Math.max(12, Math.min(100, confidence))}%` }} />
                  </div>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1 no-scrollbar">
                  {steps.map((step, index) => (
                    <CognitiveCard key={step.id} step={step} isActive={step.id === activeStep?.id} index={index} />
                  ))}
                </div>
              </div>
            </section>

            <section className="flex h-full flex-col rounded-3xl border border-slate-800/90 bg-slate-950/60 p-4 backdrop-blur-xl lg:col-span-5">
              <ZoneHeader title="Cognitive Core" subtitle="Live delegation, flow, and confidence" icon={<BrainCircuit className="h-4 w-4 text-violet-300" />} />

              <div className="relative mt-3 flex min-h-92 flex-1 items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_46%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.95))]" />
                <NoiseOverlay />
                <NeuralRings confidence={confidence} />
                <AgentOrbit activeStep={activeStep} confidence={confidence} signalDepth={signalDepth} />
                <CenterCore status={status} confidence={confidence} activeStep={activeStep} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "confidence", value: `${confidence}%`, tone: "from-emerald-400 to-cyan-400" },
                  { label: "depth", value: `${signalDepth}`, tone: "from-violet-400 to-fuchsia-400" },
                  { label: "latency", value: `${Math.max(1, Math.round(elapsedMs / 1000))}s`, tone: "from-amber-400 to-orange-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                    <div className={`mt-2 bg-linear-to-r ${item.tone} bg-clip-text text-xl font-black text-transparent`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex h-full flex-col rounded-3xl border border-slate-800/90 bg-slate-950/60 p-4 backdrop-blur-xl lg:col-span-3">
              <ZoneHeader title="Reasoning Inspector" subtitle="Active agents and memory context" icon={<Workflow className="h-4 w-4 text-emerald-300" />} />

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 no-scrollbar">
                <MetricCard label="status" value={status} detail={helperMessage} />
                <MetricCard label="active agent" value={activeStep?.agent || "Orchestrator"} detail={activeStep ? activeStep.title : "Awaiting first cognition state"} />
                <MetricCard label="memory recall" value={`${Math.min(100, 25 + timeline.length * 11)}%`} detail={inspectorFacts.memory} />
                <MetricCard label="tool depth" value={`${Math.max(1, Math.min(7, timeline.length + 1))}`} detail={inspectorFacts.tools} />
                <MetricCard label="context tokens" value={inspectorFacts.context} detail={inspectorFacts.tokens} />

                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">confidence evolution</p>
                  <ConfidenceGraph points={buildConfidenceSeries(progress, timeline.length, status)} />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">agent activation</p>
                  <div className="mt-3 space-y-2">
                    {buildAgentStates(steps).map((agent) => (
                      <AgentActivationRow key={agent.name} {...agent} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div ref={endRef} className="hidden" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function buildCognitiveSteps(timeline: ActivityEntry[], progress: number, status: SessionSnapshot["status"]): CognitiveStep[] {
  const latest = timeline[timeline.length - 1];
  const stepIndex = Math.min(5, Math.floor(progress / 18));

  const steps: CognitiveStep[] = [
    {
      id: "intent",
      type: "intent",
      title: "Intent Understanding",
      message: latest?.stage === "session-created" ? "Mapping the user's objective into a structured task graph." : "Interpreting the request and extracting the core intent.",
      confidence: 62,
      status: "thinking",
      agent: "Orchestrator",
    },
    {
      id: "planning",
      type: "planning",
      title: "Multi-Agent Planning",
      message: "Decomposing the goal into execution paths and specialized agent responsibilities.",
      confidence: 71,
      status: "thinking",
      agent: "Planner",
    },
    {
      id: "memory",
      type: "memory",
      title: "Memory Recall",
      message: "Retrieving prior context, task history, and matching workflow patterns.",
      confidence: 76,
      status: "thinking",
      agent: "Retrieval",
    },
    {
      id: "tool",
      type: "tool",
      title: "Tool Reasoning",
      message: "Selecting tools, evaluating execution cost, and preserving reliability.",
      confidence: 81,
      status: "thinking",
      agent: "Tool Router",
    },
    {
      id: "validation",
      type: "validation",
      title: "Validation Loop",
      message: "Checking consistency, grounding signals, and rejecting weak inferences before output.",
      confidence: progress > 80 ? 91 : 84,
      status: "thinking",
      agent: "Validator",
    },
    {
      id: "response",
      type: "response",
      title: "Response Synthesis",
      message: status === "completed" ? "Synthesizing the final roadmap and handoff details." : "Assembling the final response architecture.",
      confidence: Math.max(88, Math.min(99, Math.round(progress) + 8)),
      status: status === "failed" ? "failed" : status === "completed" ? "completed" : "thinking",
      agent: "Synthesizer",
    },
  ];

  return steps.map((step, index) => {
    if (status === "failed" && index === steps.length - 1) return { ...step, status: "failed" };
    if (index < stepIndex) return { ...step, status: "completed" };
    if (index === stepIndex) return { ...step, status: status === "completed" ? "completed" : "thinking" };
    return step;
  });
}

function computeConfidence(progress: number, timelineLength: number, status: SessionSnapshot["status"]) {
  const base = Math.min(96, Math.round(progress * 0.82 + timelineLength * 2.5 + 28));
  if (status === "completed") return Math.min(99, base + 3);
  if (status === "failed") return Math.max(18, base - 24);
  return Math.max(34, Math.min(97, base));
}

function buildConfidenceSeries(progress: number, timelineLength: number, status: SessionSnapshot["status"]) {
  const anchor = Math.max(28, Math.round(progress * 0.8));
  const wobble = status === "failed" ? -8 : 4;
  return [anchor - 14, anchor - 5, anchor + 7, anchor + 12 + timelineLength * 2 + wobble].map((value, index) => ({
    x: index,
    y: Math.max(12, Math.min(100, value)),
  }));
}

function buildInspectorFacts(timeline: ActivityEntry[], progress: number, confidence: number) {
  const lastMessage = timeline[timeline.length - 1]?.message || "Awaiting first context packet";
  return {
    memory: timeline.length === 0 ? "No memory recall yet" : `${Math.min(3, timeline.length)} contextual flash${timeline.length > 1 ? "es" : ""} synchronized`,
    tools: timeline.length === 0 ? "Tool routing on standby" : `Tool depth aligned with ${Math.min(4, timeline.length + 1)} active reasoning layers`,
    context: `${Math.max(1, Math.round(progress / 3 + timeline.length * 9))}`,
    tokens: `Latest cognitive token: ${lastMessage.slice(0, 58)}${lastMessage.length > 58 ? "…" : ""}`,
    confidence: `${confidence}%`,
  };
}

function buildAgentStates(steps: CognitiveStep[]) {
  return [
    { name: "Planner", state: steps.find((step) => step.id === "planning")?.status === "thinking" ? "PROCESSING" : "ACTIVE" },
    { name: "Retrieval", state: steps.find((step) => step.id === "memory")?.status === "completed" ? "ACTIVE" : "PROCESSING" },
    { name: "Validator", state: steps.find((step) => step.id === "validation")?.status === "thinking" ? "WAITING" : "ACTIVE" },
  ];
}

function ZoneHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
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
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> live cognition
      </div>
    </div>
  );
}

function ThinkingLine({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium leading-6 text-slate-100">
        <TypewriterText text={text} />
      </div>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" /> streaming thought
      </div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [text]);

  return <span className="bg-linear-to-r from-cyan-300 via-sky-300 to-white bg-clip-text text-transparent">{displayedText}</span>;
}

function CognitiveCard({ step, isActive, index }: { step: CognitiveStep; isActive: boolean; index: number }) {
  const tone =
    step.type === "memory"
      ? "from-cyan-500/20 to-blue-500/10"
      : step.type === "validation"
        ? "from-emerald-500/20 to-cyan-500/10"
        : step.type === "response"
          ? "from-violet-500/20 to-fuchsia-500/10"
          : "from-slate-500/15 to-slate-500/5";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={`rounded-2xl border p-3 ${isActive ? "border-cyan-400/40 bg-cyan-500/10" : "border-slate-800 bg-slate-900/50"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{step.type}</p>
          <h4 className="mt-1 text-sm font-semibold text-slate-100">{step.title}</h4>
        </div>
        <div className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${step.status === "completed" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : step.status === "failed" ? "border-rose-400/30 bg-rose-500/10 text-rose-200" : "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"}`}>
          {step.status}
        </div>
      </div>
      <div className={`mt-3 rounded-2xl border border-slate-800 bg-linear-to-br ${tone} p-3 text-sm leading-6 text-slate-200`}>
        <TypewriterText text={step.message} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span>{step.agent}</span>
        <span>{step.confidence}% confidence</span>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-2 text-sm font-bold text-slate-100">{value}</div>
      <p className="mt-1 text-[11px] leading-5 text-slate-400">{detail}</p>
    </div>
  );
}

function ConfidenceGraph({ points }: { points: Array<{ x: number; y: number }> }) {
  const width = 260;
  const height = 92;
  const path = points
    .map((point, index) => {
      const x = (point.x / Math.max(1, points.length - 1)) * (width - 20) + 10;
      const y = height - (point.y / 100) * (height - 18) - 8;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-24 w-full overflow-visible">
      <defs>
        <linearGradient id="confidenceLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#confidenceLine)" strokeWidth="3" strokeLinecap="round" />
      {points.map((point, index) => {
        const cx = (point.x / Math.max(1, points.length - 1)) * (width - 20) + 10;
        const cy = height - (point.y / 100) * (height - 18) - 8;
        return <circle key={index} cx={cx} cy={cy} r="3.5" fill="#e0f2fe" />;
      })}
    </svg>
  );
}

function AgentActivationRow({ name, state }: { name: string; state: string }) {
  const active = state === "ACTIVE";
  const processing = state === "PROCESSING";

  return (
    <div className={`flex items-center justify-between rounded-2xl border p-3 ${active ? "border-emerald-400/30 bg-emerald-500/10" : processing ? "border-cyan-400/30 bg-cyan-500/10" : "border-slate-800 bg-slate-900/55"}`}>
      <div>
        <p className="text-sm font-semibold text-slate-100">{name}</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{processing ? "processing" : active ? "active" : "waiting"}</p>
      </div>
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-emerald-400/20 text-emerald-200" : processing ? "bg-cyan-400/20 text-cyan-100" : "bg-slate-800 text-slate-400"}`}>
        <ArrowRight className={`h-4 w-4 ${processing ? "animate-pulse" : ""}`} />
      </div>
    </div>
  );
}

function NeuralRings({ confidence }: { confidence: number }) {
  return (
    <>
      <motion.div
        className="absolute h-56 w-56 rounded-full border border-cyan-400/20"
        animate={{ rotate: 360, scale: 1 + confidence / 1000 }}
        transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 2.8, repeat: Infinity, repeatType: "mirror" } }}
      />
      <motion.div
        className="absolute h-80 w-80 rounded-full border border-violet-400/20"
        animate={{ rotate: -360, scale: 1 + confidence / 850 }}
        transition={{ rotate: { duration: 26, repeat: Infinity, ease: "linear" }, scale: { duration: 3.4, repeat: Infinity, repeatType: "mirror" } }}
      />
      <motion.div
        className="absolute h-104 w-104 rounded-full border border-sky-400/10"
        animate={{ rotate: 360 }}
        transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
      />
      <motion.div
        className="absolute h-32 w-32 rounded-full blur-xl"
        style={{ background: "radial-gradient(circle,rgba(125,211,252,0.35),rgba(59,130,246,0.12),transparent_70%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function AgentOrbit({ activeStep, confidence, signalDepth }: { activeStep: CognitiveStep | null; confidence: number; signalDepth: number }) {
  const nodes = [
    { label: "intent", angle: 0 },
    { label: "memory", angle: 72 },
    { label: "planning", angle: 144 },
    { label: "tool", angle: 216 },
    { label: "validation", angle: 288 },
  ];

  return (
    <>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="orbitLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.0)" />
          </linearGradient>
        </defs>
        {nodes.map((node) => (
          <motion.line
            key={node.label}
            x1="50%"
            y1="50%"
            x2={`${50 + 30 * Math.cos((node.angle * Math.PI) / 180)}%`}
            y2={`${50 + 22 * Math.sin((node.angle * Math.PI) / 180)}%`}
            stroke="url(#orbitLine)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: "mirror" }}
          />
        ))}
      </svg>

      {nodes.map((node, index) => {
        const radius = 33;
        const x = 50 + radius * Math.cos(((node.angle + confidence / 3) * Math.PI) / 180);
        const y = 50 + radius * Math.sin(((node.angle + confidence / 3) * Math.PI) / 180);
        const active = activeStep?.type === node.label;

        return (
          <motion.div
            key={node.label}
            className={`absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-2xl border backdrop-blur-md ${active ? "border-cyan-300/60 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.28)]" : "border-slate-700 bg-slate-900/50"}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ scale: active ? [1, 1.08, 1] : [1, 1.04, 1], y: active ? [0, -5, 0] : [0, -2, 0] }}
            transition={{ duration: 2.4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">{node.label}</span>
              <span className="mt-1 text-[10px] text-slate-500">{active ? "live" : `${signalDepth}d`}</span>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

function CenterCore({ status, confidence, activeStep }: { status: SessionSnapshot["status"]; confidence: number; activeStep: CognitiveStep | null }) {
  return (
    <div className="absolute z-10 flex flex-col items-center justify-center text-center">
      <motion.div
        className="relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-400/25 shadow-[0_0_60px_rgba(34,211,238,0.18)]"
        style={{ background: "radial-gradient(circle,rgba(34,211,238,0.20),rgba(15,23,42,0.55),rgba(15,23,42,0.15))" }}
        animate={{ scale: [1, 1.03, 1], boxShadow: ["0 0 50px rgba(34,211,238,0.15)", "0 0 80px rgba(168,85,247,0.22)", "0 0 50px rgba(34,211,238,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-5 rounded-full border border-slate-700/60 bg-slate-950/70 backdrop-blur-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 flex flex-col items-center px-4">
          <Sparkles className="h-6 w-6 text-cyan-200" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">cognitive core</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">{confidence}%</p>
          <p className="mt-1 max-w-44 text-[11px] leading-5 text-slate-400">{status === "completed" ? "Response synthesized" : activeStep ? activeStep.title : "Initializing cognition"}</p>
        </div>
      </motion.div>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
        <DatabaseZap className="h-3.5 w-3.5 text-emerald-300" /> memory synchronizing
      </div>
    </div>
  );
}

function NoiseOverlay() {
  return <div className="absolute inset-0 opacity-[0.07] mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 0, transparent 1.5px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.8) 0, transparent 1.5px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.8) 0, transparent 1.5px)", backgroundSize: "24px 24px" }} />;
}

