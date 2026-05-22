"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Play,
  Sparkles,
  Calendar,
  Layers3,
  Star,
  Target,
  Zap,
} from "lucide-react";

export default function PremiumHeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#f8f9ff] min-h-screen">
      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute top-[-10%] left-[25%] w-[900px] h-[900px] bg-violet-500/10 blur-[120px] rounded-full" />

      <div className="absolute right-[-10%] top-[10%] w-[900px] h-[900px] border border-indigo-200/50 rounded-full" />

      <div className="absolute right-[5%] top-[20%] w-[700px] h-[700px] border border-indigo-100/60 rounded-full" />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="fixed top-0 z-50 w-full border-b border-slate-200/60 backdrop-blur-xl bg-white/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>

            <span className="font-black text-2xl tracking-tight text-slate-900">
              AgentFlow
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-12 font-semibold text-slate-600">
            <a href="#">Features</a>
            <a href="#">Testimonials</a>
            <a href="#">FAQ</a>
            <a href="#">Pricing</a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hidden md:flex text-slate-700 font-semibold"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-xl shadow-indigo-500/20 hover:scale-[1.03] transition-all duration-300 flex items-center"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* ================================================= */}
          {/* LEFT CONTENT */}
          {/* ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-200 bg-white shadow-sm mb-8">
              <Sparkles className="w-4 h-4 text-indigo-500" />

              <span className="text-xs tracking-[0.2em] uppercase font-bold text-indigo-600">
                Task Management 2.0
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[3.5rem] md:text-[5rem] leading-[0.95] font-black tracking-[-0.05em] text-slate-950">
              Your Agentic AI for
              <span className="block mt-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Goal Execution.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-xl leading-relaxed text-slate-500 max-w-2xl">
              Upload your resume, role, and timeline. Watch our autonomous AI
              generate, prioritize, and automate your entire preparation
              workflow instantly.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-5">
              <button
              type="button"
              onClick={() => navigate("/signup")}
              className="h-16 px-10 rounded-2xl text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
            >
                Build My Workflow
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button className="h-16 px-10 rounded-2xl text-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center justify-center">
                <Play className="w-5 h-5 mr-3" />
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatars */}
              <div className="flex -space-x-3">
                {[
                  "https://i.pravatar.cc/100?img=1",
                  "https://i.pravatar.cc/100?img=2",
                  "https://i.pravatar.cc/100?img=3",
                  "https://i.pravatar.cc/100?img=4",
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                  />
                ))}
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-slate-600 mt-2 font-medium">
                  12,000+ professionals trust AgentFlow
                </p>
              </div>
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <div className="relative flex items-center justify-center min-h-[750px]">
            {/* Glow */}
            <div className="absolute w-[650px] h-[650px] bg-gradient-to-br from-indigo-500/20 to-violet-500/10 blur-[120px] rounded-full" />

            {/* ================================================= */}
            {/* MAIN RESUME CARD */}
            {/* ================================================= */}

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 1 }}
              className="relative z-20 w-[360px] md:w-[420px] bg-white rounded-[40px] border border-slate-200 shadow-[0_40px_120px_rgba(99,102,241,0.15)] overflow-hidden"
            >
              {/* Top */}
              <div className="p-8 border-b border-slate-100">
                <h3 className="text-3xl font-black text-slate-900">
                  Rohan Mehta
                </h3>

                <p className="text-slate-500 mt-2">
                  Senior Software Engineer
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {[
                    "React",
                    "TypeScript",
                    "Node.js",
                    "Tailwind",
                    "AWS",
                    "MongoDB",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 rounded-full bg-slate-100 text-sm font-semibold text-slate-700"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Layers3 className="w-5 h-5 text-indigo-500" />

                    <h4 className="font-bold text-slate-900">
                      Experience
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item}>
                        <div className="h-3 bg-slate-200 rounded-full w-[70%]" />

                        <div className="h-3 bg-slate-100 rounded-full w-full mt-3" />

                        <div className="h-3 bg-slate-100 rounded-full w-[90%] mt-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match Score */}
                <div className="flex items-center justify-between bg-indigo-50 rounded-2xl p-5">
                  <div>
                    <p className="text-sm font-semibold text-indigo-500">
                      AI Match Score
                    </p>

                    <h3 className="text-3xl font-black text-indigo-600 mt-1">
                      92%
                    </h3>
                  </div>

                  <div className="w-20 h-20 rounded-full border-[8px] border-indigo-500 flex items-center justify-center text-xl font-black text-indigo-600">
                    92
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* FLOATING CARDS */}
            {/* ================================================= */}

            {/* AI Analysis */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute top-10 left-0 z-30 bg-white/90 backdrop-blur-2xl border border-white rounded-[28px] shadow-2xl p-6 w-[250px]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    AI Analysis
                  </h3>

                  <p className="text-sm text-slate-500">
                    Strong Match
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["Skills Match", "92%"],
                  ["Experience", "88%"],
                  ["Role Alignment", "95%"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">{label}</span>

                      <span className="font-bold text-indigo-600">
                        {value}
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tasks */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute top-12 right-0 z-30 bg-white/90 backdrop-blur-2xl border border-white rounded-[28px] shadow-2xl p-6 w-[280px]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Priority Tasks
                  </h3>

                  <p className="text-sm text-slate-500">
                    AI Generated Plan
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "System Design Deep Dive",
                  "Behavioral Mock Interview",
                  "DSA Practice Session",
                ].map((task, i) => (
                  <div
                    key={task}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>

                      <span className="font-medium text-slate-700">
                        {task}
                      </span>
                    </div>

                    <span className="text-sm text-slate-400">
                      Day {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 7 }}
              className="absolute bottom-16 left-0 z-30 bg-white/90 backdrop-blur-2xl border border-white rounded-[28px] shadow-2xl p-6 w-[250px]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Skills Detected
                  </h3>

                  <p className="text-sm text-slate-500">
                    AI Resume Parsing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["React", "Expert"],
                  ["TypeScript", "Advanced"],
                  ["Node.js", "Advanced"],
                  ["AWS", "Intermediate"],
                ].map(([skill, level]) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-700">
                      {skill}
                    </span>

                    <span className="text-sm font-semibold text-indigo-500">
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Session */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute bottom-10 right-6 z-30 bg-white/90 backdrop-blur-2xl border border-white rounded-[28px] shadow-2xl p-6 w-[250px]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Next Session
                  </h3>

                  <p className="text-sm text-slate-500">
                    Scheduled Automatically
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <h4 className="font-bold text-slate-900">
                  Mock Interview
                </h4>

                <p className="text-sm text-slate-500 mt-2">
                  Tomorrow, 10:00 AM
                </p>

                <button className="w-full mt-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 h-11 text-white font-semibold transition-all">
                  View Schedule
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================================================= */}
        {/* BRANDS */}
        {/* ================================================= */}

        <div className="mt-28 bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-lg p-12">
          <div className="flex flex-wrap justify-center items-center gap-16 text-slate-400 font-bold text-3xl">
            <span>Amazon</span>
            <span>Microsoft</span>
            <span>Google</span>
            <span>TCS</span>
            <span>Infosys</span>
            <span>IBM</span>
          </div>
        </div>
      </div>
    </section>
  );
}