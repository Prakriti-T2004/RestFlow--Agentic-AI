"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  ArrowRight,
  Github,
  Chrome,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please accept the terms of service to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Prefer detailed validation messages from server when available
        const details = data.errors ? data.errors.map((e: any) => e.msg).join('; ') : undefined;
        throw new Error(details ? `${data.message}: ${details}` : data.message || "Signup failed. Please try again.");
      }

      localStorage.setItem("taskSchedulerToken", data.data.token);
      localStorage.setItem("taskSchedulerUser", JSON.stringify(data.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to register at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white overflow-hidden relative">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative border-r border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="font-extrabold text-xl tracking-tight">
                AgentFlow AI
              </h1>
              <p className="text-sm text-slate-400">
                Autonomous Workflow Intelligence
              </p>
            </div>
          </div>

          {/* HERO CONTENT */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 mb-6 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">
                  AI Powered Preparation
                </span>
              </div>

              <h2 className="text-6xl font-black leading-[1.05] tracking-tight mb-6">
                Your Autonomous
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  Workflow{" "}
                </span>
                Starts Here.
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed">
                Upload your resume, define your goals, and let the AI
                orchestrate your preparation, execution, and progress tracking
                automatically.
              </p>
            </motion.div>

            {/* Floating AI Cards */}
            <div className="mt-14 space-y-5">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Resume Analysis Completed
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      14 skill gaps identified and prioritized.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      AI Execution Pipeline Active
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Dynamic interview roadmap generated instantly.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-10">
            <div>
              <h3 className="text-3xl font-black">12k+</h3>
              <p className="text-slate-400 text-sm">
                Active Professionals
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black">95%</h3>
              <p className="text-slate-400 text-sm">
                Workflow Completion
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black">24/7</h3>
              <p className="text-slate-400 text-sm">
                Autonomous AI Support
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>

              <span className="font-black text-2xl">
                AgentFlow
              </span>
            </div>

            {/* Signup Card */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(99,102,241,0.15)]">
              <div className="mb-8">
                <h2 className="text-4xl font-black tracking-tight">
                  Create Account
                </h2>

                <p className="text-slate-400 mt-3 leading-relaxed">
                  Join thousands of professionals using AI to automate workflow
                  execution and interview preparation.
                </p>
              </div>

              {/* Social Buttons */}
              <div className="space-y-4">
                <Button className="w-full h-14 rounded-2xl bg-white hover:bg-slate-100 text-black font-bold text-base">
                  <Chrome className="w-5 h-5 mr-3" />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <Github className="w-5 h-5 mr-3" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  OR
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* FORM */}
              <form onSubmit={handleSignup} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Full Name
                  </label>

                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    placeholder="John Doe"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="h-14 rounded-2xl bg-white/5 border-white/10 pr-12 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  <div className="flex gap-2 mt-3">
                    <div className="h-1 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1 flex-1 rounded-full bg-emerald-500" />
                    <div className="h-1 flex-1 rounded-full bg-white/10" />
                  </div>

                  <p className="text-xs text-emerald-400 font-medium">
                    Strong Password
                  </p>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
                    className="border-white/20 mt-1"
                  />

                  <p className="text-sm text-slate-400 leading-relaxed">
                    I agree to the{" "}
                    <span className="text-indigo-400 font-medium cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-indigo-400 font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-indigo-500/20 font-bold text-base mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create My Workspace"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {error ? (
                  <p className="text-sm text-center text-red-400 mt-3">{error}</p>
                ) : null}
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-indigo-400 font-semibold hover:text-indigo-300"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Enterprise-grade encryption & secure authentication
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}