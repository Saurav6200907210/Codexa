import { useEffect, useState } from "react";
import { Folder, FolderOpen, FileCode, Terminal, GitFork, Shield, FileText } from "lucide-react";

const REDESIGN_STEPS = [
  {
    phase: "tree",
    title: "1. Repository Tree Loaded",
    desc: "Workspace directory node successfully loaded.",
    sidebarState: "root",
  },
  {
    phase: "expand",
    title: "2. Folders Expanding",
    desc: "Expanding subdirectories: src, src/app, src/db...",
    sidebarState: "expanded",
  },
  {
    phase: "open",
    title: "3. Opening src/db/schema.ts",
    desc: "Reading definitions, exports, and schemas...",
    sidebarState: "open_file",
    code: [
      `import { pgTable, serial, text } from "drizzle-orm/pg-core";`,
      `export const analyses = pgTable("analyses", {`,
      `  id: serial("id").primaryKey(),`,
      `  repo: text("repo").notNull(),`,
      `});`
    ]
  },
  {
    phase: "scan",
    title: "4. AI Scanning Files",
    desc: "Analyzing table configurations and relations...",
    sidebarState: "open_file",
  },
  {
    phase: "architecture",
    title: "5. Architecture Diagram Generating",
    desc: "Drawing structural flowmaps (Server ➔ Drizzle ➔ PostgreSQL)...",
    sidebarState: "open_file",
  },
  {
    phase: "dependency",
    title: "6. Dependency Graph Map",
    desc: "Linking packages: pg, drizzle-orm, express...",
    sidebarState: "open_file",
  },
  {
    phase: "docs",
    title: "7. Documentation Generated",
    desc: "Finished! Ready to load the separate /analysis page.",
    sidebarState: "open_file",
  }
];

export default function FakeIDE() {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedCode, setTypedCode] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % REDESIGN_STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentStep = REDESIGN_STEPS[stepIndex];

  useEffect(() => {
    if (currentStep.phase === "open" && currentStep.code) {
      setTypedCode([]);
      let line = 0;
      const typeInterval = setInterval(() => {
        if (line < currentStep.code!.length) {
          setTypedCode((prev) => [...prev, currentStep.code![line]]);
          line++;
        } else {
          clearInterval(typeInterval);
        }
      }, 250);
      return () => clearInterval(typeInterval);
    } else {
      setTypedCode([]);
    }
  }, [stepIndex]);

  const isExpanded = currentStep.sidebarState === "expanded" || currentStep.sidebarState === "open_file";

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden text-xs font-mono select-none">
      {/* Title bar */}
      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 block"></span>
        </div>
        <div className="text-[10px] text-zinc-600 flex items-center gap-1.5 bg-zinc-100 px-3 py-1 rounded border border-zinc-200">
          <Terminal className="w-3.5 h-3.5 text-zinc-900" />
          <span>RepoSamjho AI IDE</span>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="grid grid-cols-12 min-h-[360px]">
        {/* Sidebar */}
        <div className="col-span-4 border-r border-zinc-200 bg-zinc-50/50 p-3 space-y-2">
          <div className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Workspace</div>
          <div className="space-y-1 text-zinc-500">
            <div className="flex items-center gap-1.5 text-zinc-800">
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-zinc-600" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>src</span>
            </div>
            {isExpanded && (
              <div className="pl-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>db</span>
                </div>
                <div className="pl-3.5 flex items-center gap-1 text-zinc-900 font-semibold">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>schema.ts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="col-span-8 p-4 flex flex-col justify-between bg-white">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-zinc-150 pb-2">
              <FileCode className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] text-zinc-500">src/db/schema.ts</span>
            </div>

            {/* Step view */}
            {currentStep.phase === "tree" && (
              <div className="py-8 text-center text-zinc-400 space-y-2">
                <Terminal className="w-8 h-8 text-zinc-300 mx-auto animate-pulse" />
                <p className="text-[10px]">Ready. Mapping structures...</p>
              </div>
            )}

            {currentStep.phase === "expand" && (
              <div className="space-y-1 text-zinc-400">
                <p className="text-[10px] text-zinc-900 animate-pulse">Expanding folder modules...</p>
                <p>➔ src/components/</p>
                <p>➔ src/db/</p>
                <p>➔ src/lib/</p>
              </div>
            )}

            {currentStep.phase === "open" && typedCode.length > 0 && (
              <div className="space-y-1 font-mono text-[11px]">
                {typedCode.map((line, i) => (
                  <div key={i} className="text-zinc-800">{line}</div>
                ))}
              </div>
            )}

            {currentStep.phase === "scan" && (
              <div className="space-y-2 py-4">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold">AI Scanning files...</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 text-zinc-600 text-[10px]">
                  💡 Target file exported analyses object. Validated Drizzle pg-core connections.
                </div>
              </div>
            )}

            {currentStep.phase === "architecture" && (
              <div className="space-y-2 p-2 bg-zinc-50 rounded border border-zinc-100 text-[10px]">
                <p className="text-zinc-900 font-bold">➔ Generated Architecture Flow</p>
                <pre className="text-zinc-600 leading-relaxed font-semibold">
                  {`[Client View] ➔ [API Endpoint]\n       └➔ [Drizzle ORM] ➔ [PostgreSQL]`}
                </pre>
              </div>
            )}

            {currentStep.phase === "dependency" && (
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center gap-1 text-zinc-900 font-bold">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Dependency Linking:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">drizzle-orm</span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">pg</span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">express</span>
                </div>
              </div>
            )}

            {currentStep.phase === "docs" && (
              <div className="space-y-2 py-2">
                <div className="flex items-center gap-1 text-zinc-900 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Hinglish Documentation Done:</span>
                </div>
                <p className="text-zinc-500 leading-relaxed text-[10px]">
                  💡 analyses table mein repositories ki complete detailed history aur folder details save ho gayi hain.
                </p>
              </div>
            )}
          </div>

          {/* AI Progress Box */}
          <div className="mt-4 p-3 rounded-xl bg-zinc-950 text-white border border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="font-bold text-white text-[10px] uppercase tracking-wider">{currentStep.title}</span>
            </div>
            <p className="text-[10px] text-zinc-300">{currentStep.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
