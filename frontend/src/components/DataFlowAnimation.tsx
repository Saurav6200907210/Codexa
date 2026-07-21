import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Github, Scan, FolderTree, GitGraph, Cpu, FileSpreadsheet, FileText, Download, CheckCircle2, ArrowDown
} from "lucide-react";

interface DataFlowAnimationProps {
  loading: boolean;
  loadingStep: number;
  url: string;
}

interface ArchBlock {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  status: string;
  badge: string;
}

const ARCH_BLOCKS: ArchBlock[] = [
  { id: "github", title: "GitHub Repository", subtitle: "Public Code Base", icon: Github, status: "Input", badge: "Source" },
  { id: "scanner", title: "Repository Scanner", subtitle: "REST Tree Fetcher", icon: Scan, status: "Scanning", badge: "Fetcher" },
  { id: "folder", title: "Folder Analysis", subtitle: "AST & Structure Mapper", icon: FolderTree, status: "Parsing", badge: "Parser" },
  { id: "deps", title: "Dependency Graph", subtitle: "Package & Module Linker", icon: GitGraph, status: "Linking", badge: "Graph" },
  { id: "ai", title: "AI Analysis", subtitle: "Gemini Heuristic Reasoning", icon: Cpu, status: "Analyzing", badge: "LLM" },
  { id: "arch-gen", title: "Architecture Generator", subtitle: "Flowchart & Schema Builder", icon: FileSpreadsheet, status: "Generating", badge: "Builder" },
  { id: "docs", title: "Documentation", subtitle: "Hinglish Explanations", icon: FileText, status: "Ready", badge: "Docs" },
  { id: "export", title: "Export PDF / Markdown", subtitle: "Report Packaging", icon: Download, status: "Complete", badge: "Export" },
];

export default function DataFlowAnimation({ loading, loadingStep, url }: DataFlowAnimationProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      setActiveStepIndex(Math.min(loadingStep, 7));
    } else {
      const interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % ARCH_BLOCKS.length);
      }, 2200);
      return () => clearInterval(interval);
    }
  }, [loading, loadingStep]);

  const getRepoName = () => {
    if (!url) return "Saurav6200907210/Codexa";
    try {
      const cleanUrl = url.replace("https://github.com/", "").replace(".git", "");
      const parts = cleanUrl.split("/");
      return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : url;
    } catch {
      return "Saurav6200907210/Codexa";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-lg relative overflow-hidden font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-900 font-mono">
            LIVE ARCHITECTURE VISUALIZATION
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-bold font-mono text-gray-700">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{loading ? "Active Scan..." : getRepoName()}</span>
        </div>
      </div>

      {/* Real Architecture Flow Blocks */}
      <div className="space-y-1.5 relative z-10 max-h-[500px] overflow-y-auto pr-1">
        {ARCH_BLOCKS.map((block, index) => {
          const Icon = block.icon;
          const isActive = index === activeStepIndex;
          const isPassed = index < activeStepIndex;

          return (
            <div key={block.id} className="flex flex-col items-center">
              {/* Block Node */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-blue-500/20"
                    : isPassed
                    ? "bg-gray-50 border-gray-200 text-gray-800"
                    : "bg-white border-gray-200 text-gray-400 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-none ${
                        isActive ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {block.title}
                    </h4>
                    <p
                      className={`text-[11px] font-medium mt-1 font-mono ${
                        isActive ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {block.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {block.badge}
                  </span>
                  {isActive && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-2 rounded-full bg-emerald-400 block"
                    />
                  )}
                </div>
              </motion.div>

              {/* Animated Connecting Line & Moving Packet */}
              {index < ARCH_BLOCKS.length - 1 && (
                <div className="py-0.5 flex flex-col items-center relative my-0.5">
                  <div
                    className={`w-0.5 h-3 transition-colors ${
                      isPassed || isActive ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                  <ArrowDown
                    className={`w-3 h-3 transition-colors ${
                      isPassed || isActive ? "text-blue-600 animate-bounce" : "text-gray-300"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
