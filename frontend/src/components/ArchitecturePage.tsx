import { useState } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, BookOpen, Terminal, Cpu, Database, Eye, Globe, ChevronRight, Github, Settings } from "lucide-react";
import { AnalysisResult } from "../types";

interface ArchitecturePageProps {
  onNavigate: (page: "landing" | "analysis" | "architecture") => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  data: AnalysisResult | null;
}

export default function ArchitecturePage({ onNavigate, lang, setLang, data }: ArchitecturePageProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Dynamic extraction based on data prop
  const repoName = data?.repo?.fullName || "Saurav6200907210/Codexa";
  const stars = data?.repo?.stars ?? 0;
  const forks = data?.repo?.forks ?? 0;
  const defaultBranch = data?.repo?.defaultBranch || "main";

  const stackNames = data?.techStack?.map(t => t.name.toLowerCase()) || [];

  const isNext = stackNames.some(s => s.includes("next.js") || s.includes("nextjs"));
  const isReact = stackNames.some(s => s.includes("react"));
  const isVue = stackNames.some(s => s.includes("vue"));
  const frontendTitle = isNext ? "Next.js Frontend & API" : isVue ? "Vue.js SPA" : isReact ? "React Frontend Client" : "Client Frontend";
  const frontendDesc = data?.techStack?.find(t => t.name.toLowerCase().includes("react") || t.name.toLowerCase().includes("vue") || t.name.toLowerCase().includes("next"))?.name || "HTML / JS Client";

  const hasExpress = stackNames.some(s => s.includes("express"));
  const hasDjango = stackNames.some(s => s.includes("django"));
  const hasFastAPI = stackNames.some(s => s.includes("fastapi"));
  const hasNode = stackNames.some(s => s.includes("node"));
  const backendTitle = hasExpress ? "Express API Server" : hasDjango ? "Django Backend Server" : hasFastAPI ? "FastAPI Server" : hasNode ? "Node.js Backend" : "Application Logic Server";
  const backendDesc = data?.techStack?.find(t => t.name.toLowerCase().includes("express") || t.name.toLowerCase().includes("django") || t.name.toLowerCase().includes("fastapi") || t.name.toLowerCase().includes("node"))?.name || "JavaScript Engine";

  const hasDB = stackNames.some(s => s.includes("postgres") || s.includes("mongo") || s.includes("sql") || s.includes("drizzle") || s.includes("prisma") || s.includes("db") || s.includes("redis"));
  const dbItem = data?.techStack?.find(t => t.name.toLowerCase().includes("postgres") || t.name.toLowerCase().includes("mongo") || t.name.toLowerCase().includes("sql") || t.name.toLowerCase().includes("drizzle") || t.name.toLowerCase().includes("prisma") || t.name.toLowerCase().includes("db"));
  const dbTitle = dbItem ? dbItem.name : hasDB ? "Database Layer" : "In-Memory State Cache";

  const hasDocker = stackNames.some(s => s.includes("docker"));
  const hasActions = stackNames.some(s => s.includes("action") || s.includes("ci/cd") || s.includes("workflow"));

  const srcFolder = data?.folders?.find(f => f.path.startsWith("src") || f.path.startsWith("frontend/src") || f.path.startsWith("components"));
  const serverFolder = data?.folders?.find(f => f.path.startsWith("server") || f.path.startsWith("backend") || f.path.startsWith("api"));
  const configFiles = data?.files?.filter(f => f.path.includes("package.json") || f.path.includes("docker") || f.path.includes("config") || f.path.includes("drizzle") || f.path.includes("prisma")).map(f => f.path.split("/").pop()) || [];

  const steps = [
    {
      id: 1,
      title: "1. UI Request (URL Input)",
      icon: <Globe className="w-5 h-5" />,
      file: "frontend/src/components/LandingPage.tsx",
      details: lang === "hi"
        ? "User input box mein GitHub repo URL type karta hai. Button click par `handleSubmit` trigger hota hai aur `fetch('/api/analyze')` call execute ki jaati hai."
        : "The user types the GitHub repo URL in the input box. Clicking the button triggers `handleSubmit` and executes the `fetch('/api/analyze')` API call.",
      code: `// LandingPage.tsx - handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ... check validation
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  onSetAnalysis(data.result);
  onNavigate("analysis");
};`
    },
    {
      id: 2,
      title: "2. Backend Route Handler",
      icon: <Terminal className="w-5 h-5" />,
      file: "backend/server.ts",
      details: lang === "hi"
        ? "POST /api/analyze request ko accept karta hai. URL extract karke github helper functions ke through check kiya jaata hai aur metadata load hota hai."
        : "Accepts the POST /api/analyze request. Extracts the URL, validates it using GitHub helper functions, and loads the repository metadata.",
      code: `// server.ts - POST handler
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  const parsed = parseRepoUrl(url); // github.ts
  if (!parsed) return res.status(400).json({ error: "Invalid URL" });
  
  const meta = await fetchRepoMeta(parsed.owner, parsed.repo);
  const tree = await fetchRepoTree(meta.owner, meta.name, meta.defaultBranch);
  const result = await analyzeRepo(meta, tree); // analyzer.ts
  
  // Save to Database
  await db.insert(analyses).values({ ... });
  res.json({ result });
});`
    },
    {
      id: 3,
      title: "3. GitHub API Fetching",
      icon: <Cpu className="w-5 h-5" />,
      file: "backend/github.ts",
      details: lang === "hi"
        ? "GitHub REST/GraphQL API ka use karke repository information, description, stars aur complete file tree (recursive list) collect ki jaati hai."
        : "Uses the GitHub REST/GraphQL API to fetch repository details, description, stars, and the complete file tree structure recursively.",
      code: `// github.ts - API integrations
export async function fetchRepoMeta(owner: string, repo: string) {
  const res = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}\`);
  // Returns owner, name, stars, defaultBranch, language, description, etc.
}

export async function fetchRepoTree(owner: string, repo: string, branch: string) {
  // Fetches full tree structure recursively
  const url = \`https://api.github.com/repos/\${owner}/\${repo}/git/trees/\${branch}?recursive=1\`;
  const res = await fetch(url);
  const data = await res.json();
  return data.tree; // Array of GitTreeItems
}`
    },
    {
      id: 4,
      title: "4. Static Analysis Engine",
      icon: <BookOpen className="w-5 h-5" />,
      file: "backend/analyzer.ts & knowledge.ts",
      details: lang === "hi"
        ? "Bina database download kiye, file paths aur configurations ko inspect kiya jaata hai. File tree ko build karke language share, stack classification, folder classification aur logical workflow timelines taiyaar hote hain."
        : "Inspects file paths and configurations without cloning the entire codebase. Builds the file tree to extract language share, stack classification, folder classification, and logical workflow timelines.",
      code: `// analyzer.ts - Core analyzer execution
export async function analyzeRepo(meta: RepoMeta, items: GitTreeItem[]) {
  const pathSet = new Set(items.map((i) => i.path.toLowerCase()));
  const pkg = await fetchRawFile(meta.owner, meta.name, meta.defaultBranch, "package.json");
  // Parses contents and performs rule-based static layout extraction...
}`
    },
    {
      id: 5,
      title: "5. Database Caching",
      icon: <Database className="w-5 h-5" />,
      file: "backend/db.ts & schema.ts",
      details: lang === "hi"
        ? "Drizzle ORM ke through PostgreSQL database me analysis result ko JSON format me cache/save kiya jata hai taaki next time prompt lookup quick ho sake."
        : "Caches and saves the analysis result payload in JSON format inside the PostgreSQL database using Drizzle ORM to enable fast lookups for subsequent queries.",
      code: `// schema.ts - Drizzle DB schema configuration
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  fullName: text("full_name").notNull(),
  description: text("description"),
  stars: integer("stars").notNull().default(0),
  language: text("language"),
  result: jsonb("result").notNull(), // complete AnalysisResult payload cached here
  createdAt: timestamp("created_at").defaultNow().notNull(),
});`
    },
    {
      id: 6,
      title: "6. Interactive Presentation",
      icon: <Eye className="w-5 h-5" />,
      file: "frontend/src/components/AnalysisPage.tsx & AnalysisView.tsx",
      details: lang === "hi"
        ? "Set status update hote hi AnalysisPage client components load ho jate hain. Smooth scroll listener aur Translation controller users ko dynamic Hinglish / English reading layouts toggle karne aur reports download karne ki suvidha dete hain."
        : "Once the status updates, the AnalysisPage client components load. A smooth scroll listener and Translation controller allow users to toggle dynamic Hinglish / English reading layouts and download reports.",
      code: `// AnalysisPage.tsx - dynamic translator toggle
const displayData = data && lang === "en" ? translateToEnglish(data) : data;

return (
  <div className="grid grid-cols-12 gap-8">
    <aside className="col-span-3">
      {/* Navigation menu & download handlers */}
    </aside>
    <main className="col-span-9">
      <AnalysisView data={displayData} />
    </main>
  </div>
);`
    }
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-800 pb-20 relative">
      <div className="cyber-grid" />
      <Navbar onNavigate={onNavigate} currentPage="architecture" />

      <div className="max-w-6xl mx-auto px-6 pt-28 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 flex-wrap gap-4">
          <div className="space-y-1">
            <button
              onClick={() => onNavigate("analysis")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-0 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "Back to Analysis (Overview)" : "Back to Analysis (Overview)"}</span>
            </button>
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">App Architecture & Code Flow</h1>
            <p className="text-sm text-zinc-500">
              {lang === "hi"
                ? "Sikhein ki kaise URL input se lekar screen render tak, data flow hota hai."
                : "Learn how data flows from URL input to screen rendering."}
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                lang === "en"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 bg-transparent"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                lang === "hi"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 bg-transparent"
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* 1. ASCII System Architecture Diagram */}
        <section className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-zinc-900">1. ASCII Architecture Diagram</h2>
          </div>
          <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-zinc-800">
{`+-----------------------------------------------------------------------------------+
|                                  USER BROWSER (Vite UI)                           |
|  [LandingPage.tsx] -- Submit URL -> [App.tsx] State management -> [AnalysisPage]  |
+-----------------------------------------------------+-----------------------------+
                                                      |
                                               POST /api/analyze { url }
                                                      |
                                                      v
+-----------------------------------------------------------------------------------+
|                            EXPRESS BACKEND (Node.js)                              |
|  [server.ts] (POST route)                                                         |
|       |                                                                           |
|       |--> 1. Parsed using parseRepoUrl() in [github.ts]                           |
|       |--> 2. Fetched Meta & FileTree from GitHub API                             |
|       |--> 3. Runs analyzeRepo(meta, tree) in [analyzer.ts]                        |
+-------+---------------------------------------------+-----------------------------+
        |                                             |
        | Drizzle ORM insert                          | Fetch Raw Files (README, pkg)
        v                                             v
+-------+------------------------+          +---------+-----------------------------+
|    POSTGRESQL DATABASE (Cache) |          |               GITHUB API              |
|  Table: \`analyses\`             |          |  Endpoints:                           |
|  Store payload in \`result\`     |          |  - /repos/{owner}/{repo}              |
|  JSONB field (best-effort)     |          |  - /git/trees/{branch}?recursive=1    |
+--------------------------------+          +---------------------------------------+`}
          </pre>
        </section>

        {/* 2. Premium Visual Interactive Flow Diagram */}
        <section className="glass-card rounded-2xl p-6 bg-zinc-50/50 border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <h2 className="text-lg font-bold text-zinc-900">
                {lang === "hi" ? "2. Real Repo Flow Architecture" : "2. Real Repo Flow Architecture"}
              </h2>
            </div>
            <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase">
              Live Diagram
            </span>
          </div>

          <div className="flex flex-col items-center py-6 select-none bg-white rounded-2xl border border-zinc-150 shadow-inner p-4 sm:p-8 max-w-2xl mx-auto space-y-0">
            {/* Card 1: GitHub Repo URL */}
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-md">
                <Github className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-zinc-900 text-sm truncate">{repoName}</h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                  ⭐ {stars} Stars &bull; 🍴 {forks} Forks &bull; Branch: {defaultBranch}
                </p>
              </div>
            </div>

            {/* Connector 1 */}
            <div className="w-0.5 h-8 border-l border-dashed border-zinc-300 my-0" />

            {/* Card 2: Frontend Layer */}
            <div className="w-full max-w-md bg-white border-2 border-cyan-400 ring-4 ring-cyan-50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-zinc-900 text-sm">{frontendTitle}</h3>
                <p className="text-xs text-zinc-650 font-semibold mt-0.5 leading-tight">{frontendDesc}</p>
                {srcFolder && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                    &bull; /{srcFolder.path} ({srcFolder.purpose})
                  </p>
                )}
              </div>
            </div>

            {/* Connector 2 */}
            <div className="w-0.5 h-8 border-l border-dashed border-zinc-300 my-0" />

            {/* Card 3: Backend Gateway */}
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-md">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-zinc-900 text-sm">{backendTitle}</h3>
                <p className="text-xs text-zinc-550 font-medium mt-0.5 leading-tight">{backendDesc}</p>
                {serverFolder && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                    &bull; /{serverFolder.path} ({serverFolder.purpose})
                  </p>
                )}
              </div>
            </div>

            {/* Connector 3: Branching Path */}
            <div className="relative w-full h-12 flex justify-center my-0">
              {/* Desktop path */}
              <svg className="hidden sm:block w-full max-w-[400px] h-full" viewBox="0 0 400 48" fill="none" preserveAspectRatio="none">
                <path d="M 200 0 L 200 16" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 200 16 L 80 16 L 80 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 200 16 L 320 16 L 320 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="80" cy="24" r="5" fill="#22d3ee" className="animate-ping" />
                <circle cx="80" cy="24" r="3.5" fill="#06b6d4" />
                <circle cx="320" cy="24" r="5" fill="#22d3ee" className="animate-ping" />
                <circle cx="320" cy="24" r="3.5" fill="#06b6d4" />
              </svg>
              {/* Mobile path */}
              <svg className="sm:hidden w-full h-full" viewBox="0 0 100 48" fill="none" preserveAspectRatio="none">
                <path d="M 50 0 L 50 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="50" cy="24" r="5" fill="#22d3ee" className="animate-ping" />
                <circle cx="50" cy="24" r="3.5" fill="#06b6d4" />
              </svg>
            </div>

            {/* Split cards container */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-[500px] justify-between items-center z-10 relative">
              {/* Card 4a: Left Pipeline (CI/CD or config) */}
              <div className="w-full sm:w-[220px] bg-white border border-zinc-200 rounded-2xl p-3 flex items-center gap-3 hover:shadow-md hover:border-zinc-300 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-zinc-900 text-xs truncate">
                    {hasActions ? "GitHub CI/CD" : "Configurations"}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium truncate mt-0.5 font-mono">
                    {configFiles.length > 0 ? configFiles.slice(0, 2).join(", ") : "project configs"}
                  </p>
                </div>
              </div>

              {/* Mobile straight line connector when cards stack */}
              <div className="sm:hidden w-0.5 h-6 border-l border-dashed border-zinc-300 my-0" />

              {/* Card 4b: Right Pipeline (Docker or Gemini) */}
              <div className="w-full sm:w-[220px] bg-white border border-zinc-200 rounded-2xl p-3 flex items-center gap-3 hover:shadow-md hover:border-zinc-300 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-zinc-900 text-xs truncate">
                    {hasDocker ? "Dockerized Env" : "AI Summaries"}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium truncate mt-0.5">
                    {hasDocker ? "container configs" : "Gemini explanations"}
                  </p>
                </div>
              </div>
            </div>

            {/* Connector 4: Merge Path */}
            <div className="relative w-full h-12 flex justify-center my-0">
              {/* Desktop path */}
              <svg className="hidden sm:block w-full max-w-[400px] h-full" viewBox="0 0 400 48" fill="none" preserveAspectRatio="none">
                <path d="M 80 0 L 80 32 L 200 32 L 200 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 320 0 L 320 32 L 200 32 L 200 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="32" r="5.5" fill="#22d3ee" className="animate-ping" />
                <circle cx="200" cy="32" r="4" fill="#06b6d4" />
              </svg>
              {/* Mobile path */}
              <svg className="sm:hidden w-full h-full" viewBox="0 0 100 48" fill="none" preserveAspectRatio="none">
                <path d="M 50 0 L 50 48" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="50" cy="24" r="5" fill="#22d3ee" className="animate-ping" />
                <circle cx="50" cy="24" r="3.5" fill="#06b6d4" />
              </svg>
            </div>

            {/* Card 5: Database Layer */}
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <Database className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-zinc-900 text-sm">{dbTitle}</h3>
                <p className="text-xs text-zinc-400 font-semibold mt-0.5 leading-tight">
                  {hasDB ? "Persistent storage & caching query indexes" : "In-memory caching layer"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Flow Pipeline */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Steps selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-zinc-900">3. Execution Step Pipeline</h2>
            </div>
            
            <div className="space-y-2">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`w-full flex items-center justify-between text-left p-4 rounded-xl transition-all cursor-pointer border ${
                    activeStep === s.id
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeStep === s.id ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-700"}`}>
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{s.title}</h3>
                      <span className="text-[10px] font-mono opacity-80 block">{s.file.split("/").pop()}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Code & explanation details view */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl border border-zinc-200 bg-white overflow-hidden sticky top-28">
              <div className="bg-zinc-950 text-zinc-400 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  {steps[activeStep - 1].file}
                </span>
                <span className="rounded bg-zinc-800 text-[10px] px-2 py-0.5 text-zinc-300 uppercase tracking-wide">
                  Step {activeStep}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-950 mb-1">{steps[activeStep - 1].title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-semibold">{steps[activeStep - 1].details}</p>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-zinc-950 text-indigo-200 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed border border-zinc-800">
                    <code>{steps[activeStep - 1].code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 4. Mermaid Flowchart as Code Block */}
        <section className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-zinc-900">4. Mermaid System Flowchart (Architecture Graph)</h2>
          </div>
          
          <div className="text-xs text-zinc-600 leading-relaxed font-medium space-y-2">
            <p>
              {lang === "hi"
                ? "System flows ka flowchart code (Mermaid notation) aur flow sequence graphical flow architecture diya gaya hai:"
                : "Below is the system flow chart code (Mermaid notation) and the sequence of graphical flow architecture:"}
            </p>
          </div>

          <pre className="p-4 bg-zinc-950 text-indigo-200 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-zinc-800">
{`graph TD
    A[Vite UI: User Inputs URL] -->|POST /api/analyze| B[Express: server.ts Handler]
    B -->|Check repo validation| C[github.ts: parseRepoUrl]
    C -->|Fetch repo payload| D[github.ts: fetchRepoMeta]
    C -->|Fetch file structures| E[github.ts: fetchRepoTree]
    
    D & E -->|Input arrays & keys| F[analyzer.ts: analyzeRepo Core Engine]
    F -->|Classify Stack & Types| G[analyzer.ts: detectProject]
    F -->|Logical execution steps| H[analyzer.ts: buildWorkflow]
    F -->|Parse main components| I[analyzer.ts: pickKeyFiles]
    
    G & H & I -->|Final result payload| J[server.ts: Save to database]
    J -->|drizzle db.insert| K[(PostgreSQL DB Cache)]
    
    J -->|Return response object| L[Vite UI: render view]
    L -->|Toggle language state| M[translator.ts: Translate to English/Hinglish]
    M -->|Dynamic render nodes| N[AnalysisView.tsx: Render segments]`}
          </pre>
        </section>

      </div>
    </div>
  );
}
