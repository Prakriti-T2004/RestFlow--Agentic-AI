import React from "react";
import { BrainCircuit } from "lucide-react";

export const Footer = () => (
  <footer className="bg-slate-50 py-12 border-t border-slate-200/60 transition-colors duration-500">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-[#0f172a]">
          AgentFlow AI
        </span>
      </div>
      <div className="flex gap-6 text-sm font-bold text-slate-500">
        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
      </div>
      <p className="text-xs font-medium text-slate-400">
        © 2026 AgentFlow AI. All rights reserved.
      </p>
    </div>
  </footer>
);