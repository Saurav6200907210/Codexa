import { useEffect, useState, useRef } from "react";
import { 
  Terminal, Database, Cpu, Globe, GitFork, Github, Maximize2, Minimize2, RefreshCw, ZoomIn, ZoomOut, Info, Settings, ShieldAlert, Sparkles, FolderOpen, Layers, CheckCircle
} from "lucide-react";

interface DataFlowAnimationProps {
  loading: boolean;
  loadingStep: number;
  url: string;
}

export default function DataFlowAnimation({ loading, loadingStep, url }: DataFlowAnimationProps) {
  // Auto scale state
  const [scale, setScale] = useState(0.95);

  // Interactive states
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    db: false,
    api: false
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);

  // Extract repo name from URL or use a default one
  const getRepoName = () => {
    if (!url) return "Saurav6200907210/Codexa";
    try {
      const cleanUrl = url.replace("https://github.com/", "").replace(".git", "");
      const parts = cleanUrl.split("/");
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return url;
    } catch {
      return "Saurav6200907210/Codexa";
    }
  };

  const repoName = getRepoName();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 350) setScale(0.7);
      else if (window.innerWidth < 420) setScale(0.78);
      else if (window.innerWidth < 500) setScale(0.88);
      else setScale(0.95);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden text-xs select-none relative flex flex-col h-[560px]">
      
      {/* Title Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-150 bg-white/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full block ${loading ? "bg-amber-500 animate-ping" : "bg-cyan-500 animate-pulse"}`} />
          <span className="font-extrabold text-zinc-950 font-sans tracking-tight">
            {loading ? "Repository Analysis Pipeline" : "Interactive Architecture Explorer"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
            loading 
              ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" 
              : "bg-cyan-50 border-cyan-100 text-cyan-700"
          }`}>
            {loading ? `Step ${loadingStep + 1} of 5` : "Active Pipeline"}
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        className="flex-1 overflow-hidden bg-zinc-50/40 flex items-center justify-center p-4"
      >
        {/* Dynamic Zoomed Viewport Wrapper */}
        <div 
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center"
          }}
          className="flex flex-col items-center justify-center w-[400px] shrink-0"
        >
          {loading ? (
            /* ========================================================
               LOADING / ANALYSIS STATE SEQUENCE
               ======================================================== */
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
              {/* GitHub Source URL Node (Always appears) */}
              <div className="z-10 w-72 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-md border-amber-400 ring-4 ring-amber-50 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-zinc-900 text-xs">Target Repo</div>
                  <div className="text-[9px] text-zinc-400 font-mono truncate">{repoName}</div>
                </div>
              </div>

              {/* Step 1: Scanner */}
              {loadingStep >= 1 && (
                <>
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-300 animate-pulse" />
                  <div className="z-10 w-72 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-md border-cyan-500 ring-4 ring-cyan-50 transform scale-105 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white shrink-0 animate-spin">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-zinc-900 text-xs">Repository Scanner</div>
                      <div className="text-[9px] text-zinc-550 font-medium">Fetching folder contents...</div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Parser */}
              {loadingStep >= 2 && (
                <>
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-300" />
                  <div className="z-10 w-72 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-md border-cyan-500 ring-4 ring-cyan-50 transform scale-105 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shrink-0">
                      <FolderOpen className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <div className="font-extrabold text-zinc-900 text-xs font-sans">Repository Parser</div>
                      <div className="text-[9px] text-zinc-550 font-medium">Inspecting dependency configurations...</div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Stack Analyzer */}
              {loadingStep >= 3 && (
                <>
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-300" />
                  <div className="z-10 w-72 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-md border-cyan-500 ring-4 ring-cyan-50 transform scale-105 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white shrink-0">
                      <Cpu className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="font-extrabold text-zinc-900 text-xs">AI System Stack Analyzer</div>
                      <div className="text-[9px] text-zinc-550 font-medium">Detecting components & libraries...</div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Generating Architecture */}
              {loadingStep >= 4 && (
                <>
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-300 animate-pulse" />
                  <div className="flex gap-4 w-full justify-center">
                    <div className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center gap-2 shadow-sm animate-bounce">
                      <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-800">React Node</span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center gap-2 shadow-sm animate-bounce delay-100">
                      <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white shrink-0">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-800">Express Server</span>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center gap-2 shadow-sm animate-bounce delay-200">
                      <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-800">Database</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ========================================================
               ACTIVE INTERACTIVE ARCHITECTURE GRAPH VIEWPORT
               ======================================================== */
            <div className="relative flex flex-col items-center w-[400px] mx-auto min-h-[440px] z-10 py-6">
              
              {/* Dynamic Connecting Curved Lines (Bezier SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "440px" }}>
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Path 1: GitHub URL -> Vite React Frontend (Vertical line) */}
                <path 
                  d="M 200 44 L 200 96" 
                  stroke={hoveredNode === "github" || hoveredNode === "vite" ? "#06b6d4" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "github" || hoveredNode === "vite" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4" 
                  className="transition-all duration-300"
                />
                <circle r="3.5" fill="url(#edgeGrad)" filter="url(#activeGlow)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 44 L 200 96" />
                </circle>

                {/* Path 2: Vite React Frontend -> Express API Gateway (Vertical line) */}
                <path 
                  d="M 200 144 L 200 196" 
                  stroke={hoveredNode === "vite" || hoveredNode === "api" ? "#06b6d4" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "vite" || hoveredNode === "api" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
                <circle r="3.5" fill="url(#edgeGrad)" filter="url(#activeGlow)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 144 L 200 196" />
                </circle>

                {/* Path 3: Express API -> Split to GitHub API & Gemini AI */}
                {/* Left Branch to GitHub API */}
                <path 
                  d="M 200 244 C 200 270, 90 270, 90 296" 
                  stroke={hoveredNode === "api" || hoveredNode === "gitapi" ? "#06b6d4" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "api" || hoveredNode === "gitapi" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
                <circle r="3.5" fill="url(#edgeGrad)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200 244 C 200 270, 90 270, 90 296" />
                </circle>

                {/* Right Branch to Gemini AI */}
                <path 
                  d="M 200 244 C 200 270, 310 270, 310 296" 
                  stroke={hoveredNode === "api" || hoveredNode === "gemini" ? "#06b6d4" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "api" || hoveredNode === "gemini" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
                <circle r="3.5" fill="url(#edgeGrad)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200 244 C 200 270, 310 270, 310 296" />
                </circle>

                {/* Path 4: GitHub API & Gemini AI -> Merge to PostgreSQL Database */}
                <path 
                  d="M 90 342 C 90 368, 200 368, 200 396" 
                  stroke={hoveredNode === "db" || hoveredNode === "gitapi" ? "#10b981" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "db" || hoveredNode === "gitapi" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
                <circle r="3" fill="#10b981">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 90 342 C 90 368, 200 368, 200 396" />
                </circle>

                <path 
                  d="M 310 342 C 310 368, 200 368, 200 396" 
                  stroke={hoveredNode === "db" || hoveredNode === "gemini" ? "#10b981" : "#e4e4e7"} 
                  strokeWidth={hoveredNode === "db" || hoveredNode === "gemini" ? "2.5" : "1.5"}
                  fill="none" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
                <circle r="3" fill="#10b981">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 310 342 C 310 368, 200 368, 200 396" />
                </circle>
              </svg>

              {/* Node 1: GitHub URL */}
              <div 
                onMouseEnter={() => setHoveredNode("github")}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setClickedNode(clickedNode === "github" ? null : "github")}
                className={`interactive-node z-10 w-64 bg-white/90 backdrop-blur-md border rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  hoveredNode === "github" ? "border-zinc-400 ring-4 ring-zinc-50 scale-105" : "border-zinc-200"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Github className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-zinc-950 text-xs">GitHub Repository</div>
                  <div className="text-[9px] text-zinc-505 font-mono mt-0.5 truncate">{repoName}</div>
                </div>
              </div>

              <div className="h-10" />

              {/* Node 2: Vite React Frontend */}
              <div 
                onMouseEnter={() => setHoveredNode("vite")}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setClickedNode(clickedNode === "vite" ? null : "vite")}
                className={`interactive-node z-10 w-64 bg-white/95 backdrop-blur-md border-2 rounded-xl p-3 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  hoveredNode === "vite" ? "border-cyan-400 ring-4 ring-cyan-50 scale-105" : "border-indigo-400"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-zinc-955 text-xs">Vite React Frontend</div>
                  <div className="text-[9px] text-zinc-500 font-semibold mt-0.5">Port: 5173 | Client App</div>
                </div>
                <span className="text-[8px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Vite</span>
              </div>

              <div className="h-10" />

              {/* Node 3: Express API Gateway */}
              <div 
                onMouseEnter={() => setHoveredNode("api")}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => toggleNodeExpand("api")}
                className={`interactive-node z-10 w-64 bg-white/90 backdrop-blur-md border rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  hoveredNode === "api" ? "border-zinc-400 ring-4 ring-zinc-50 scale-105" : "border-zinc-200"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-zinc-955 text-xs">Express API Gateway</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5 font-semibold">Port: 3006 | Express</div>
                </div>
                <span className="text-[8px] text-zinc-400 font-bold shrink-0">{expandedNodes.api ? "Collapse" : "Expand"}</span>
              </div>

              {/* Sub-node endpoints list (Expanded) */}
              {expandedNodes.api && (
                <div className="z-10 mt-1.5 w-60 bg-zinc-900 text-zinc-300 font-mono text-[9px] rounded-lg p-2.5 border border-zinc-800 shadow-inner flex flex-col space-y-1 transform scale-95 origin-top transition-transform duration-200">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-1 mb-1 font-bold">API Routes Exposed</div>
                  <div className="flex justify-between hover:text-emerald-400 cursor-pointer">
                    <span>POST /api/analyze</span>
                    <span className="text-zinc-650 font-bold">Controller</span>
                  </div>
                  <div className="flex justify-between hover:text-emerald-400 cursor-pointer">
                    <span>GET /api/recent</span>
                    <span className="text-zinc-650 font-bold">Controller</span>
                  </div>
                </div>
              )}

              <div className="h-10" />

              {/* Split container (GitHub API & Gemini AI) */}
              <div className="z-10 flex justify-between w-full max-w-sm gap-4">
                {/* Node 4a: GitHub API */}
                <div 
                  onMouseEnter={() => setHoveredNode("gitapi")}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setClickedNode(clickedNode === "gitapi" ? null : "gitapi")}
                  className={`interactive-node w-[160px] bg-white/90 backdrop-blur-md border rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                    hoveredNode === "gitapi" ? "border-zinc-400 ring-4 ring-zinc-50 scale-105" : "border-zinc-200"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-zinc-955 text-[10px] leading-tight">GitHub API</div>
                    <div className="text-[8px] text-zinc-400 font-medium truncate mt-0.5">Fetch repo files</div>
                  </div>
                </div>

                {/* Node 4b: Gemini AI */}
                <div 
                  onMouseEnter={() => setHoveredNode("gemini")}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setClickedNode(clickedNode === "gemini" ? null : "gemini")}
                  className={`interactive-node w-[160px] bg-white/90 backdrop-blur-md border rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                    hoveredNode === "gemini" ? "border-zinc-400 ring-4 ring-zinc-50 scale-105" : "border-zinc-200"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-zinc-955 text-[10px] leading-tight font-sans">Gemini AI</div>
                    <div className="text-[8px] text-zinc-400 font-medium truncate mt-0.5">Explain codebase</div>
                  </div>
                </div>
              </div>

              <div className="h-10" />

              {/* Node 5: PostgreSQL Database */}
              <div 
                onMouseEnter={() => setHoveredNode("db")}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => toggleNodeExpand("db")}
                className={`interactive-node z-10 w-64 bg-white/90 backdrop-blur-md border rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  hoveredNode === "db" ? "border-zinc-400 ring-4 ring-zinc-50 scale-105" : "border-zinc-200"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Database className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-zinc-955 text-xs">PostgreSQL (Drizzle)</div>
                  <div className="text-[9px] text-zinc-500 font-semibold mt-0.5">Drizzle ORM | Cache</div>
                </div>
                <span className="text-[8px] text-zinc-400 font-bold shrink-0">{expandedNodes.db ? "Collapse" : "Expand"}</span>
              </div>

              {/* Sub-node schema list (Expanded) */}
              {expandedNodes.db && (
                <div className="z-10 mt-1.5 w-60 bg-zinc-900 text-zinc-300 font-mono text-[9px] rounded-lg p-2.5 border border-zinc-800 shadow-inner flex flex-col space-y-1 transform scale-95 origin-top transition-transform duration-200">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-1 mb-1 font-bold">Table Schemas Cache</div>
                  <div className="flex justify-between">
                    <span>id</span>
                    <span className="text-zinc-500 font-bold">serial primaryKey</span>
                  </div>
                  <div className="flex justify-between">
                    <span>full_name</span>
                    <span className="text-zinc-505 font-bold">text notNull</span>
                  </div>
                  <div className="flex justify-between">
                    <span>result</span>
                    <span className="text-zinc-505 font-bold">jsonb cachePayload</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover Info Tooltip overlay */}
        {hoveredNode && !loading && (
          <div className="absolute top-4 left-4 z-20 max-w-xs bg-zinc-950/90 text-white rounded-xl p-3 border border-zinc-800 shadow-lg backdrop-blur-sm pointer-events-none transition-opacity duration-200">
            <div className="flex items-center gap-1.5 mb-1 text-cyan-400 font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>
                {hoveredNode === "github" && "Source Node"}
                {hoveredNode === "vite" && "Presentation Node"}
                {hoveredNode === "api" && "Routing Endpoint"}
                {hoveredNode === "gitapi" && "API Integration"}
                {hoveredNode === "gemini" && "AI Analysis engine"}
                {hoveredNode === "db" && "Caching Layer"}
              </span>
            </div>
            <p className="text-[10px] text-zinc-300 font-medium leading-normal">
              {hoveredNode === "github" && "Displays repository parameters extracted from the user inputted GitHub URL."}
              {hoveredNode === "vite" && "Vite frontend client rendering responsive interactive trees, components and tabs."}
              {hoveredNode === "api" && "Express web service processing URL parses, database insertions, and fetching API data."}
              {hoveredNode === "gitapi" && "Official GitHub API integration querying repository branches, file counts, and metadata."}
              {hoveredNode === "gemini" && "Gemini API prompting models to construct localized Hinglish descriptions & code flows."}
              {hoveredNode === "db" && "PostgreSQL database saving payload items using type-safe drizzle schema insertions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
