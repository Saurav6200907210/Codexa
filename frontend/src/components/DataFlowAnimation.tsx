import { useEffect, useState } from "react";
import { Terminal, Database, Cpu, Globe, GitFork, ArrowRight, Layout } from "lucide-react";

export default function DataFlowAnimation() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden p-6 text-xs select-none">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-150 mb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse block"></span>
          <span className="font-bold text-zinc-800 font-sans">RepoSamjho Live Data Flow</span>
        </div>
        <span className="text-[10px] bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded border border-cyan-100">
          Active Pipeline
        </span>
      </div>

      {/* SVG Canvas for Connections & Animated Flow */}
      <div className="relative flex flex-col items-center min-h-[480px] w-full bg-zinc-50/30 rounded-xl p-4 border border-zinc-100">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "480px" }}>
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Paths connecting nodes */}
          {/* Path 1: GitHub URL -> Vite Frontend (y: 50 -> y: 120) */}
          <path d="M 180 48 L 180 102" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4.5" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 180 48 L 180 102" />
          </circle>

          {/* Path 2: Vite Frontend -> Express API (y: 148 -> y: 202) */}
          <path d="M 180 148 L 180 202" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4.5" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 180 148 L 180 202" />
          </circle>

          {/* Paths from Express API to GitHub API and Gemini AI (split) */}
          {/* Left Branch: Express API (180, 248) -> GitHub REST API (80, 310) */}
          <path d="M 180 248 C 180 280, 80 280, 80 302" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 180 248 C 180 280, 80 280, 80 302" />
          </circle>

          {/* Right Branch: Express API (180, 248) -> Gemini AI (280, 302) */}
          <path d="M 180 248 C 180 280, 280 280, 280 302" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 180 248 C 180 280, 280 280, 280 302" />
          </circle>

          {/* Merge back from branches to Drizzle DB (200, 402) */}
          {/* Left Branch: GitHub REST (80, 348) -> Drizzle DB (180, 402) */}
          <path d="M 80 348 C 80 375, 180 375, 180 402" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 80 348 C 80 375, 180 375, 180 402" />
          </circle>

          {/* Right Branch: Gemini AI (280, 348) -> Drizzle DB (180, 402) */}
          <path d="M 280 348 C 280 375, 180 375, 180 402" stroke="#e4e4e7" strokeWidth="2.5" fill="none" strokeDasharray="5 5" />
          <circle r="4" fill="url(#cyanGrad)" filter="url(#glow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 280 348 C 280 375, 180 375, 180 402" />
          </circle>
        </svg>

        {/* Node 1: GitHub URL input */}
        <div 
          className={`z-10 w-64 bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all duration-300 ${
            activeNode === 0 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
          }`}
          style={{ transformOrigin: "center" }}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shrink-0">
            <GitFork className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="font-bold text-zinc-900">GitHub Repo URL</div>
            <div className="text-[9px] text-zinc-400 font-mono">https://github.com/user/repo</div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-10"></div>

        {/* Node 2: Vite Frontend */}
        <div 
          className={`z-10 w-64 bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all duration-300 ${
            activeNode === 1 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900">Vite React Frontend</div>
            <div className="text-[9px] text-zinc-400 font-mono">Port: 3000 | Client Request</div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-10"></div>

        {/* Node 3: Express API */}
        <div 
          className={`z-10 w-64 bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all duration-300 ${
            activeNode === 2 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900">Express API Gateway</div>
            <div className="text-[9px] text-zinc-400 font-mono">Port: 3001 | Proxies & Auth</div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-12"></div>

        {/* Split Nodes Container */}
        <div className="z-10 flex justify-between w-full max-w-sm">
          {/* Node 4a: GitHub API fetcher */}
          <div 
            className={`w-[140px] bg-white border rounded-xl p-2.5 flex items-center gap-2 shadow-sm transition-all duration-300 ${
              activeNode === 3 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0">
              <GitFork className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="font-bold text-zinc-900 text-[10px] leading-tight">GitHub API</div>
              <div className="text-[8px] text-zinc-400 truncate">Fetch files content</div>
            </div>
          </div>

          {/* Node 4b: Gemini AI summary */}
          <div 
            className={`w-[140px] bg-white border rounded-xl p-2.5 flex items-center gap-2 shadow-sm transition-all duration-300 ${
              activeNode === 4 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-white shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="font-bold text-zinc-900 text-[10px] leading-tight">Gemini AI</div>
              <div className="text-[8px] text-zinc-400 truncate">Explain in Hinglish</div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-14"></div>

        {/* Node 5: Drizzle DB Database storage */}
        <div 
          className={`z-10 w-64 bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all duration-300 ${
            activeNode === 5 ? "border-cyan-500 ring-2 ring-cyan-100 scale-105" : "border-zinc-200"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-zinc-900">PostgreSQL (Drizzle)</div>
            <div className="text-[9px] text-zinc-400 font-mono">Schema: analyses | Save logs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
