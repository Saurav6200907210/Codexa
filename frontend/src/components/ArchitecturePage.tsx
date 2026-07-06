import { useState } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, BookOpen, Terminal, Cpu, Database, Eye, Globe, ChevronRight } from "lucide-react";

interface ArchitecturePageProps {
  onNavigate: (page: "landing" | "analysis" | "architecture") => void;
}

export default function ArchitecturePage({ onNavigate }: ArchitecturePageProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: "1. UI Request (URL Input)",
      icon: <Globe className="w-5 h-5" />,
      file: "frontend/src/components/LandingPage.tsx",
      details: "User input box mein GitHub repo URL type karta hai. Button click par `handleSubmit` trigger hota hai aur `fetch('/api/analyze')` call execute ki jaati hai.",
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
      details: "POST /api/analyze request ko accept karta hai. URL extract karke github helper functions ke through check kiya jaata hai aur metadata load hota hai.",
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
      details: "GitHub REST/GraphQL API ka use karke repository information, description, stars aur complete file tree (recursive list) collect ki jaati hai.",
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
      details: "Bina database download kiye, file paths aur configurations ko inspect kiya jaata hai. File tree ko build karke language share, stack classification, folder classification aur logical workflow timelines taiyaar hote hain.",
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
      details: "Drizzle ORM ke through PostgreSQL database me analysis result ko JSON format me cache/save kiya jata hai taaki next time prompt lookup quick ho sake.",
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
      details: "Set status update hote hi AnalysisPage client components load ho jate hain. Smooth scroll listener aur Translation controller users ko dynamic Hinglish / English reading layouts toggle karne aur reports download karne ki suvidha dete hain.",
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
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
          <div className="space-y-1">
            <button
              onClick={() => onNavigate("landing")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-0 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </button>
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">App Architecture & Code Flow</h1>
            <p className="text-sm text-zinc-500">Sikhein ki kaise URL input se lekar screen render tak, data flow hota hai.</p>
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

        {/* 2. Interactive Flow Pipeline */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Steps selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-zinc-900">2. Execution Step Pipeline</h2>
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

        {/* 3. Mermaid Flowchart as Code Block */}
        <section className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-zinc-900">3. Mermaid System Flowchart (Architecture Graph)</h2>
          </div>
          
          <div className="text-xs text-zinc-600 leading-relaxed font-medium space-y-2">
            <p>System flows ka flowchart code (Mermaid notation) aur flow sequence graphical flow architecture diya gaya hai:</p>
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
