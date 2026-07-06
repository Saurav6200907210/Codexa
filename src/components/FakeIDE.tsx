"use client";

import { useEffect, useState } from "react";
import { Folder, FolderOpen, FileCode, CheckCircle, Terminal, HelpCircle, GitFork } from "lucide-react";

const STEPS = [
  {
    type: "explore",
    title: "Scanning file tree...",
    file: "root",
    desc: "AI is mapping repository layout & directories.",
  },
  {
    type: "open_dir",
    title: "Opening src/components...",
    file: "src/components",
    desc: "Found UI component logic & layout structure.",
  },
  {
    type: "open_file",
    title: "Analyzing src/db/index.ts",
    file: "db/index.ts",
    desc: "PostgreSQL Database connection & Drizzle ORM config initialized.",
    code: [
      `import { drizzle } from "drizzle-orm/node-postgres";`,
      `import { Pool } from "pg";`,
      `const databaseUrl = process.env.DATABASE_URL;`,
      `if (!databaseUrl) {`,
      `  throw new Error("DATABASE_URL is required");`,
      `}`,
      `export const db = drizzle(new Pool({ connectionString: databaseUrl }));`,
    ],
  },
  {
    type: "explain",
    title: "Generating AI explanation...",
    file: "db/index.ts",
    desc: "Insight: App relies on an external Postgres database, reading connection strings from environment variables.",
  },
  {
    type: "graph",
    title: "Building Dependency Graph...",
    file: "drizzle.config.json",
    desc: "Drizzle Kit mapped. Schema references: schema.ts",
  },
];

export default function FakeIDE() {
  const [activeStep, setActiveStep] = useState(0);
  const [typedCode, setTypedCode] = useState<string[]>([]);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentStep = STEPS[activeStep];

  // Simulate typing effect for files
  useEffect(() => {
    if (currentStep.type === "open_file" && currentStep.code) {
      setTypedCode([]);
      let line = 0;
      const typeInterval = setInterval(() => {
        if (line < currentStep.code!.length) {
          setTypedCode((prev) => [...prev, currentStep.code![line]]);
          line++;
        } else {
          clearInterval(typeInterval);
        }
      }, 300);
      return () => clearInterval(typeInterval);
    } else {
      setTypedCode([]);
    }
  }, [activeStep]);

  useEffect(() => {
    if (activeStep >= 1) {
      setIsFolderOpen(true);
    } else {
      setIsFolderOpen(false);
    }
  }, [activeStep]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gray-950/80 shadow-2xl backdrop-blur-xl overflow-hidden text-xs font-mono select-none">
      {/* OS style title bar */}
      <div className="px-4 py-3 bg-gray-900/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70 block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/70 block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/70 block"></span>
        </div>
        <div className="text-gray-400 text-[10px] flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-md border border-white/5">
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span>RepoSamjho AI IDE Mode</span>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="grid grid-cols-12 min-h-[350px]">
        {/* Sidebar */}
        <div className="col-span-4 border-r border-white/5 bg-gray-950/40 p-3 space-y-2">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Explorer</div>
          
          <div className="space-y-1 text-gray-400">
            <div className="flex items-center gap-1 text-white">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>src</span>
            </div>
            
            <div className="pl-4 space-y-1">
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer w-full text-left">
                {isFolderOpen ? (
                  <FolderOpen className="w-3.5 h-3.5 text-yellow-500" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-yellow-600" />
                )}
                <span className={activeStep === 1 ? "text-indigo-400 font-semibold" : ""}>components</span>
              </button>

              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer w-full text-left pl-4">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Navbar.tsx</span>
              </button>

              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer w-full text-left">
                <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>db</span>
              </button>

              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer w-full text-left pl-4">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span className={currentStep.file === "db/index.ts" ? "text-indigo-400 font-semibold" : ""}>index.ts</span>
              </button>

              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer w-full text-left pl-4">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>schema.ts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-8 p-4 flex flex-col justify-between bg-black/20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-gray-300">src/db/index.ts</span>
            </div>

            {currentStep.type === "open_file" && typedCode.length > 0 ? (
              <div className="space-y-1">
                {typedCode.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-gray-600 text-right w-4">{idx + 1}</span>
                    <span className="text-gray-300 break-all">{line}</span>
                  </div>
                ))}
              </div>
            ) : currentStep.type === "explain" ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">AI Code explanation complete:</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 mt-2 leading-relaxed text-[11px]">
                  💡 <b>Database Setup:</b> Yeh file database configuration setup karti hai using Node-Postgres and Drizzle ORM. Agar `.env` file mein <code className="text-pink-400">DATABASE_URL</code> missing hai, to error throw karegi.
                </div>
              </div>
            ) : currentStep.type === "graph" ? (
              <div className="space-y-2 p-2 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-1 text-pink-400 font-semibold mb-1">
                  <GitFork className="w-4 h-4" />
                  <span>Dependency Linkages</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span className="text-gray-300">drizzle-orm</span>
                    <span className="text-indigo-400">→ postgresql database</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1 rounded">
                    <span className="text-gray-300">schema.ts</span>
                    <span className="text-pink-400">→ migrations config</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-600 animate-spin"></div>
                <span className="text-[10px]">Processing dynamic repository node...</span>
              </div>
            )}
          </div>

          {/* AI Live Status Panel */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-950/50 to-pink-950/20 border border-indigo-500/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="font-semibold text-white text-[10px] uppercase tracking-wider">{currentStep.title}</span>
            </div>
            <p className="text-[10px] text-gray-400">{currentStep.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
