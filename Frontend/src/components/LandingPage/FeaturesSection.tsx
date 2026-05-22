import React from "react";
import { BrainCircuit, FileText, Briefcase, CheckCircle2, Loader2, Calendar, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative z-10 bg-[#f8fbff]" id="features">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              How the Agent Works
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-6 leading-tight">
            Stop planning. <br className="hidden md:block" /> Start executing with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
              Autonomous Agents.
            </span>
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Upload your context once. Our AI agent acts as your personal project
            manager, dynamically generating roadmaps, curating resources, and
            scheduling mock sessions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div
              className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none transform translate-x-1/3 -translate-y-1/3"
              style={{ transform: "translateZ(0)" }}
            ></div>
            <div className="relative z-10 w-full md:w-2/3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 mb-6">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0f172a] mb-3">Contextual Upload</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Drop in your resume, target job description, and your interview
                date. The agent instantly cross-references your current skills
                against the requirements to find knowledge gaps.
              </p>
            </div>
            {/* Mini Visual */}
            <div className="absolute -right-10 -bottom-10 w-[300px] bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xl transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="w-full h-12 bg-white rounded-xl border border-slate-100 flex items-center px-4 gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
                  <span className="text-xs font-bold text-slate-600">Extracting Experience</span>
                </div>
                <div className="w-full h-12 bg-white rounded-xl border border-slate-100 flex items-center px-4 gap-3 opacity-60">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />{" "}
                  <span className="text-xs font-bold text-slate-600">Mapping Competencies...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div
              className="absolute bottom-0 left-0 w-full h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.1)_0%,transparent_70%)] pointer-events-none"
              style={{ transform: "translateZ(0)" }}
            ></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100 mb-6">
                <Calendar className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0f172a] mb-3">Dynamic Roadmaps</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                The agent generates a day-by-day, prioritized study schedule. If
                you fall behind, the engine automatically recalibrates your timeline.
              </p>
              {/* Minimal graphic */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                  <span className="text-xs font-extrabold text-violet-500">68%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-[68%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-6">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0f172a] mb-3">Actionable Execution</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                Instead of just giving you a list, the agent proactively finds
                study materials, generates flashcards, and initiates mock sessions.
              </p>
            </div>
          </div>

          {/* Card 4 - Dark element intentionally kept dark as it's a stark contrast piece, but removed the global dark mode toggle classes */}
          <div className="md:col-span-2 bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden group text-white">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
            <div
              className="absolute -top-[50%] -right-[20%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none"
              style={{ transform: "translateZ(0)" }}
            ></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-1/2">
                <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Stop drowning in tabs. Let the AI manage the chaos.</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                  Focus entirely on learning and practicing. The AgentFlow AI
                  orchestrates the background noise so you show up perfectly prepared.
                </p>
                <Button variant="default" className="bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20 border-0 text-white group">
                  Build My Workflow <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="md:w-1/2 w-full flex justify-center">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">Interview Agent Active</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Curate System Design Docs</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Schedule Peer Mock Call</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-bold">Generate Behavioral Qs</span>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase border border-indigo-500/30 animate-pulse">Running</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};