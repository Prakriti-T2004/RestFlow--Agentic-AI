import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Zap,
  Layers,
  Github,
  CheckCircle2,
} from "lucide-react";

// --- MOCK UI COMPONENTS ---
const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl h-12 px-6 text-sm w-full";
  const variants: Record<string, string> = {
    default:
      "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20",
    outline:
      "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm",
    ghost:
      "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Custom Google SVG Icon for SSO
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("taskSchedulerToken", data.data.token);
      localStorage.setItem("taskSchedulerUser", JSON.stringify(data.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to login at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-[#f8fbff] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500 ease-in-out">
      {/* --- LEFT PANEL: Branding & Visuals (Hidden on Mobile) --- */}
      <div className="hidden lg:flex relative w-1/2 bg-[#0f172a] overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <div
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_60%)] rounded-full animate-pulse"
          style={{ animationDuration: "6s", transform: "translateZ(0)" }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_60%)] rounded-full"
          style={{ transform: "translateZ(0)" }}
        ></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            AgentFlow
          </span>
        </div>

        {/* Center Visual: Autonomous Agent in Action */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center perspective-1000">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-sm"
          >
            {/* Main Floating Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-[2rem] p-8 shadow-2xl shadow-indigo-900/20 transform translateZ(0)">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
                <div className="relative w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <div className="absolute inset-0 rounded-full border border-indigo-400/50 animate-[ping_2s_infinite]"></div>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Agent Active
                  </h3>
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                    Optimizing Workflow
                  </p>
                </div>
              </div>

              {/* Dynamic Task List */}
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-300">
                    Extracted skills from resume
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-300">
                    Analyzed job requirements
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 bg-indigo-900/20 p-3 rounded-xl border border-indigo-500/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-[shimmer_2s_infinite]"></div>
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin flex-shrink-0 relative z-10" />
                  <span className="text-sm font-semibold text-indigo-200 relative z-10">
                    Generating prep schedule...
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Orbiting Elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-10 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-slate-200">
                  12 Tasks Created
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium">
            Join 50,000+ professionals automating their career growth.
          </p>
        </div>
      </div>

      {/* --- RIGHT PANEL: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Ambient Glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_60%)] lg:hidden rounded-full pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        ></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0f172a] dark:text-white">
              AgentFlow
            </span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Log in to access your autonomous agents.
            </p>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            <Button
              variant="outline"
              className="h-12 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0f172a] dark:text-white transition-colors duration-300 flex items-center justify-center shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="h-12 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0f172a] dark:text-white transition-colors duration-300 flex items-center justify-center shadow-sm"
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative flex items-center py-2 mb-8">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {error ? (
              <p className="text-sm text-center text-red-600 mt-2">{error}</p>
            ) : null}
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
