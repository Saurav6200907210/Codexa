import { useState } from "react";
import type { AnalysisResult } from "../types";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";
import { FileTree } from "./FileTree";

function SectionTitle({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white text-base">
          {n}
        </span>
        <h2 className="text-2xl font-extrabold text-zinc-950">{title}</h2>
      </div>
      <p className="pl-12 text-sm text-zinc-500 font-semibold">{sub}</p>
    </div>
  );
}

export function AnalysisView({ data, lang }: { data: AnalysisResult; lang: "en" | "hi" }) {
  const { repo, stats, projectType, techStack } = data;
  const maxLang = Math.max(1, ...stats.languages.map((l) => l.count));
  const isHinglish = lang === "hi";

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const getFileExplanation = (path: string): { summary: string; points: string[]; role: string } => {
    // 1. Check if we already have it in data.files
    const existing = data.files.find(f => f.path === path);
    if (existing) {
      return {
        summary: existing.summary,
        points: existing.points,
        role: existing.role
      };
    }

    // 2. Otherwise generate a dynamic explanation
    const filename = path.split("/").pop() || path;
    const nameLower = filename.toLowerCase();
    const pathLower = path.toLowerCase();
    
    let summary = `Ye file \`${filename}\` code flow ke liye ek key part hai.`;
    const points: string[] = [];
    let role = "Source File";

    if (nameLower.endsWith(".json")) {
      role = "Configuration File";
      summary = `Ye project ki configuration settings file \`${filename}\` hai.`;
      points.push(
        "Isme JSON formatted structured key-value configurations store kiye gaye hain.",
        "Dependency libraries, build variables aur typescript environment settings control karti hai.",
        "Is file ke badalne se runtime behaviors aur library version constraints change ho sakte hain."
      );
    } else if (nameLower.endsWith(".config.js") || nameLower.endsWith(".config.ts") || nameLower.endsWith(".config.mjs")) {
      role = "Module Configuration";
      summary = `Ye tool configure karne ki configuration file \`${filename}\` hai.`;
      points.push(
        "Build engines (Vite/Next), CSS styling rules (Tailwind/PostCSS) ya database migrations settings init karti hai.",
        "Server-side optimization parameters, entry routes proxies aur base paths control karti hai."
      );
    } else if (pathLower.includes("db/") || pathLower.includes("database/") || nameLower.includes("schema")) {
      role = "Database Schema / Connection";
      summary = `Ye database integrity aur structure maintain karne ki logic file \`${filename}\` hai.`;
      points.push(
        "Database tables schemas, entity columns datatypes aur index constraints mappings store karti hai.",
        "Drizzle/Prisma client hooks provide karti hai jisse frontend-backend type-safe queries kar sakein.",
        "Relation configurations aur defaults hooks (jaise defaultNow()) define kiye gaye hain."
      );
    } else if (pathLower.includes("routes/") || pathLower.includes("api/")) {
      role = "API Endpoint Route";
      summary = `Ye HTTP requests processing endpoints register karne wali routing file \`${filename}\` hai.`;
      points.push(
        "Kaunse request paths (GET, POST, DELETE etc.) kaunse backend actions run karenge, yeh handle karti hai.",
        "Database handlers trigger karti hai request responses dynamically retrieve/update karne ke liye.",
        "JSON payloads wrap karke secure status headers ke sath output return karti hai."
      );
    } else if (pathLower.includes("components/") || pathLower.includes("ui/") || pathLower.includes("shared/")) {
      role = "Reusable UI Component";
      summary = `Ye front-end presentation layer component file \`${filename}\` hai.`;
      points.push(
        "TypeScript/React reusable visual structure define karti hai jo application shell layout me use hota hai.",
        "Props interfaces define karke structural elements dynamically bind karti hai.",
        "Modern CSS animations (jaise Framer Motion hooks) aur responsive rules include karti hai."
      );
    } else if (pathLower.includes("pages/") || pathLower.includes("app/") || pathLower.includes("views/")) {
      role = "Page Router View";
      summary = `Ye specific route rendering page view component file \`${filename}\` hai.`;
      points.push(
        "URL targets matching UI layout render karti hai.",
        "Internal components import karke pages structures grid compose karti hai.",
        "Client side routing state transitions and redirect triggers attach karti hai."
      );
    } else if (pathLower.includes("lib/") || pathLower.includes("services/") || pathLower.includes("utils/")) {
      role = "Helper / Utility Module";
      summary = `Ye reusable core function logic code file \`${filename}\` hai.`;
      points.push(
        "Modular utility calculation, date parse aur helpers helper exports rakhti hai.",
        "Third party SDK clients initialize karti hai aur custom exceptions checks handles validate karti hai.",
        "Main calculations aur process flows layers decouple karke clean maintain karti hai."
      );
    } else {
      points.push(
        `Code language aur extensions parsing files settings evaluate karti hai.`,
        `Repository architecture timeline patterns integration steps define karti hai.`
      );
    }

    return { summary, points, role };
  };

  return (
    <div className="space-y-16">
      {/* Repo header */}
      <section id="overview" className="scroll-mt-24">
        <Reveal>
          <div className="glass-card rounded-2xl p-6 sm:p-8 bg-white border border-zinc-200">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl font-extrabold text-zinc-950 hover:text-cyan-600 sm:text-3xl"
                >
                  {repo.fullName} ↗
                </a>
                <p className="mt-2 max-w-2xl text-zinc-600 text-sm leading-relaxed">
                  {repo.description || "Is repo ki koi description available nahi hai."}
                </p>
              </div>
              <span className="rounded-full bg-cyan-50 border border-cyan-200 px-4 py-1.5 text-xs font-bold text-cyan-700">
                {data.projectType}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <Stat type="stars" label="⭐ Stars" value={repo.stars.toLocaleString()} />
              <Stat type="forks" label="🍴 Forks" value={repo.forks.toLocaleString()} />
              <Stat type="files" label="📄 Files" value={stats.totalFiles.toLocaleString()} />
              <Stat type="folders" label="📁 Folders" value={stats.totalFolders.toLocaleString()} />
              {repo.language && <Stat type="language" label="💻 Language" value={repo.language} />}
              {repo.license && <Stat type="license" label="⚖️ License" value={repo.license} />}
            </div>

            {data.techStack.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {data.techStack.map((t) => (
                  <span
                    key={t.name}
                    title={t.reason}
                    className="cursor-help rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 font-bold transition hover:border-cyan-500/30 hover:bg-cyan-50"
                  >
                    {t.emoji} {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* 1. Summary */}
      <section id="summary" className="scroll-mt-24">
        <SectionTitle n="📖" title="Ek Line Mein Summary" sub="Sabse pehle poore project ka overview." />
        <Reveal>
          <div className="glass-card rounded-2xl p-6 text-sm leading-relaxed text-zinc-700 bg-white border border-zinc-200">
            <Rich text={data.summary} />
          </div>
        </Reveal>
      </section>

      {/* 2. Tech stack detail */}
      {data.techStack.length > 0 && (
        <section id="tech-stack" className="scroll-mt-24">
          <SectionTitle n="🧰" title="Tech Stack — Kaunse Tools Use Hue" sub="Har tool kis kaam ke liye laga hai." />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.techStack.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="glass-card flex gap-3 rounded-xl p-4 bg-white border border-zinc-200">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="font-bold text-zinc-950">{t.name}</div>
                    <div className="text-xs text-zinc-500 mt-1">{t.reason}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 3. Workflow timeline */}
      <section id="workflow" className="scroll-mt-24">
        <SectionTitle
          n="🔄"
          title="Workflow — Project Kaise Chalta Hai"
          sub="Step by step: pehle kya hota hai, phir kya. Aise hi request-response flow chalta hai."
        />
        <div className="relative pl-4">
          <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-zinc-200" />
          <div className="space-y-4">
            {data.workflow.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="relative flex gap-4">
                  <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-50 text-xl shadow-sm">
                    {s.emoji}
                  </span>
                  <div className="glass-card flex-1 rounded-xl p-4 bg-white border border-zinc-200">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700">
                        Step {s.step}
                      </span>
                      <h3 className="font-bold text-zinc-900">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                      <Rich text={s.description} />
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Folder by folder */}
      <section id="folders" className="scroll-mt-24">
        <SectionTitle
          n="📁"
          title="Folder by Folder Breakdown"
          sub="Har important folder kya kaam karta hai, logical order mein."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {data.folders.map((f, i) => (
            <Reveal key={f.path} delay={i * 50}>
              <div className="glass-card h-full rounded-xl p-5 bg-white border border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{f.emoji}</span>
                  <code className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    {f.path}/
                  </code>
                  <span className="ml-auto rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-500 font-semibold">
                    {f.fileCount} files
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">{f.purpose}</p>
                {f.sampleFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.sampleFiles.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-zinc-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Key files code-wise */}
      <section id="files" className="scroll-mt-24">
        <SectionTitle
          n="🔍"
          title="Important Files — Code Wise Samjho"
          sub="In files ko andar se dekha gaya hai: kya import karti hain, kya banati hain."
        />
        <div className="space-y-4">
          {data.files.map((file, i) => (
            <Reveal key={file.path} delay={i * 40}>
              <div className="glass-card rounded-xl p-5 bg-white border border-zinc-200">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{file.path}</code>
                  <span className="rounded bg-emerald-50 border border-emerald-250 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {file.role}
                  </span>
                  <span className="rounded bg-zinc-50 border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600 font-bold">
                    {file.language}
                  </span>
                </div>
                {file.summary && (
                  <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                    <Rich text={file.summary} />
                  </p>
                )}
                {file.points.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {file.points.map((p, j) => (
                      <li key={j} className="flex gap-2 text-xs text-zinc-600 leading-relaxed">
                        <span className="text-zinc-400">▹</span>
                        <span>
                          <Rich text={p} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Languages + tree */}
      <section id="explorer" className="scroll-mt-24">
        <SectionTitle n="🗂️" title="Poora File Structure" sub="Languages ka mix aur complete folder tree." />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="glass-card rounded-xl p-5 bg-white border border-zinc-200">
              <h3 className="mb-4 font-bold text-zinc-900 text-sm">Languages Mix</h3>
              <div className="space-y-3">
                {stats.languages.length === 0 && (
                  <p className="text-xs text-zinc-500">Koi code language detect nahi hui.</p>
                )}
                {stats.languages.map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-xs text-zinc-600">
                      <span>{l.name}</span>
                      <span>{l.count} files</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-950"
                        style={{ width: `${(l.count / maxLang) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-3" delay={100}>
            <FileTree tree={data.tree} onFileClick={setSelectedFile} />
          </Reveal>
        </div>
      </section>

      {/* 7. Learn Deeply */}
      {(() => {
        // --- RECURSIVE FILE EXTRACTOR FROM TREE ---
        const getAllFilesFromTree = (node: any): string[] => {
          const files: string[] = [];
          const traverse = (n: any) => {
            if (n.type === "file") {
              files.push(n.path);
            } else if (n.children) {
              n.children.forEach(traverse);
            }
          };
          traverse(node);
          return files;
        };

        const allFiles = getAllFilesFromTree(data.tree);

        // 1. Config & Project Setup files
        const configFiles = allFiles.filter(p => 
          p.endsWith(".json") || p.endsWith(".config.js") || p.endsWith(".config.ts") || p.endsWith(".config.mjs") || p.includes(".gitignore") || p.includes(".oxlintrc") || p.endsWith("eslint.config.js")
        );

        // 2. Database Layer files
        const dbFiles = allFiles.filter(p => 
          (p.includes("db/") || p.includes("database/") || p.toLowerCase().includes("schema") || p.includes("models/")) && !configFiles.includes(p)
        );

        // 3. API / Route files
        const apiFiles = allFiles.filter(p => 
          (p.includes("api/") || p.includes("routes/") || p.includes("controllers/") || p.toLowerCase().endsWith("server.ts") || p.toLowerCase().endsWith("server.js") || p.toLowerCase().endsWith("app.js")) && !configFiles.includes(p) && !dbFiles.includes(p)
        );

        // 4. Core logic / Services / Utils / Middleware
        const coreFiles = allFiles.filter(p => 
          (p.includes("lib/") || p.includes("services/") || p.includes("utils/") || p.includes("helpers/") || p.includes("middleware/") || p.includes("middlewares/") || p.toLowerCase().includes("analyzer") || p.toLowerCase().includes("github") || p.toLowerCase().includes("knowledge") || p.toLowerCase().includes("translator")) && 
          !configFiles.includes(p) && !dbFiles.includes(p) && !apiFiles.includes(p)
        );

        // 5. Global Layout UI / Shell components
        const layoutFiles = allFiles.filter(p => 
          (p.toLowerCase().includes("layout") || p.toLowerCase().includes("navbar") || p.toLowerCase().includes("sidebar") || p.toLowerCase().includes("header") || p.toLowerCase().includes("commandpalette")) && 
          !configFiles.includes(p) && !dbFiles.includes(p) && !apiFiles.includes(p) && !coreFiles.includes(p)
        );

        // 6. UI Components
        const componentFiles = allFiles.filter(p => 
          (p.includes("components/") || p.includes("ui/") || p.includes("shared/")) && 
          !configFiles.includes(p) && !dbFiles.includes(p) && !apiFiles.includes(p) && !coreFiles.includes(p) && !layoutFiles.includes(p)
        );

        // 7. Pages / Views / Core Router components
        const pageFiles = allFiles.filter(p => 
          (p.includes("pages/") || p.includes("app/") || p.includes("views/") || p.toLowerCase().endsWith("app.tsx") || p.toLowerCase().endsWith("main.tsx") || p.toLowerCase().endsWith("index.html") || p.toLowerCase().includes("stores/")) && 
          !configFiles.includes(p) && !dbFiles.includes(p) && !apiFiles.includes(p) && !coreFiles.includes(p) && !layoutFiles.includes(p) && !componentFiles.includes(p)
        );

        // 8. Other / Assets / CSS Styles
        const otherFiles = allFiles.filter(p => 
          !configFiles.includes(p) && !dbFiles.includes(p) && !apiFiles.includes(p) && !coreFiles.includes(p) && !layoutFiles.includes(p) && !componentFiles.includes(p) && !pageFiles.includes(p)
        );

        // Build Complete Timeline Flow (Every file path mapping is included)
        const timelineSteps: string[] = ["Project Initialization Configs"];
        if (configFiles.length > 0) timelineSteps.push(...configFiles.map(f => f.split("/").pop() || f));
        if (dbFiles.length > 0) {
          timelineSteps.push("Database Schema & Connection");
          timelineSteps.push(...dbFiles.map(f => f.split("/").pop() || f));
        }
        if (coreFiles.length > 0) {
          timelineSteps.push("Core Business Logic / Engine");
          timelineSteps.push(...coreFiles.map(f => f.split("/").pop() || f));
        }
        if (apiFiles.length > 0) {
          timelineSteps.push("API Routes & Request Handlers");
          timelineSteps.push(...apiFiles.map(f => f.split("/").pop() || f));
        }
        if (layoutFiles.length > 0) {
          timelineSteps.push("Global Layout Shell Components");
          timelineSteps.push(...layoutFiles.map(f => f.split("/").pop() || f));
        }
        if (componentFiles.length > 0) {
          timelineSteps.push("Reusable UI Controls & Modals");
          timelineSteps.push(...componentFiles.map(f => f.split("/").pop() || f));
        }
        if (pageFiles.length > 0) {
          timelineSteps.push("Router Pages & Global Client Store");
          timelineSteps.push(...pageFiles.map(f => f.split("/").pop() || f));
        }
        if (otherFiles.length > 0) {
          timelineSteps.push("Static Assets & Style Rules");
          timelineSteps.push(...otherFiles.map(f => f.split("/").pop() || f));
        }
        timelineSteps.push("Refactoring / Build Compile", "Production Ready");

        const visualTimelineStr = timelineSteps.join("\n        │\n        ▼\n");

        return (
          <section id="learn-deeply" className="scroll-mt-24">
            <SectionTitle
              n="🧠"
              title="Learn Deeply — Development Flow & Folder Structure"
              sub="Is repo ke logic aur structure ke analysis se nikala gaya logical implementation order aur development phase sequence. Isme project ki ek bhi file miss nahi ki gayi hai."
            />
            <Reveal>
              <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-8 text-sm leading-relaxed text-zinc-700">
                
                {/* Dynamic introductory note */}
                <p className="text-zinc-600 text-xs italic bg-zinc-50 border-l-4 border-zinc-500 p-3 rounded-r-xl">
                  {isHinglish ? (
                    <>Haan, agar koi senior developer is <strong>{projectType}</strong> project ko scratch se banata, toh files aur folder architecture ka development order kuch is tarah hota. Ye folder tree aur tech stack analyze karke reconstructed flow hai.</>
                  ) : (
                    <>Based on our analysis of this <strong>{projectType}</strong> repository, here is how a senior developer would typically build it scratch-by-scratch. This represents the reconstructed logical flow.</>
                  )}
                </p>

                {/* Stepper phases */}
                <div className="space-y-6">
                  
                  {/* Phase 1: Configs */}
                  {configFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-950 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🚀</span> Phase 1 — Project Initialization
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Project configs setup and initialization.</p>
                      <div className="mt-2 text-xs text-zinc-600 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150">
                          {configFiles.map((cfg) => (
                            <div key={cfg} className="flex items-center gap-1.5">
                              <span className="text-zinc-900 font-bold">📄 {cfg}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 2: Database Layer */}
                  {dbFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🏗️</span> Phase 2 — Database Layer
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Database models aur connection connection logic define karna.</p>
                      <div className="mt-2 grid md:grid-cols-2 gap-4">
                        <div className="font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1">
                          <span className="text-zinc-800 font-bold">Database Files:</span>
                          {dbFiles.map(df => <div key={df} className="pl-2">📄 {df}</div>)}
                        </div>
                        <div className="text-xs text-zinc-600 space-y-1.5 flex flex-col justify-center">
                          <div>• Connection clients create kiye gaye aur credentials hook kiye gaye.</div>
                          <div>• Schema tables relational schema and columns structural mapping load hui.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 3: Core Logic */}
                  {coreFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🌐</span> Phase 3 — Backend / Core Business Logic
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Business functions, modules utilities, middleware hooks aur calculations.</p>
                      <div className="mt-2 grid md:grid-cols-2 gap-4">
                        <div className="font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1 max-h-[250px] overflow-y-auto">
                          <span className="text-zinc-800 font-bold">Logic Files:</span>
                          {coreFiles.map(cf => <div key={cf} className="pl-2">📄 {cf}</div>)}
                        </div>
                        <div className="text-xs text-zinc-600 space-y-1.5 flex flex-col justify-center">
                          <div>• Custom core algorithms, helper utils files aur logic definitions register hue.</div>
                          <div>• Internal processing layers integrate aur test kiye gaye.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 4: API / Routing */}
                  {apiFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🔌</span> Phase 4 — API Routes / Server Handlers
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">API request routes setup karna backend database connectivity ke sath.</p>
                      <div className="mt-2 font-mono text-[10px] bg-zinc-50 p-2.5 rounded border border-zinc-150 space-y-1 max-h-[250px] overflow-y-auto">
                        <span className="text-zinc-800 font-bold">Routing Handlers:</span>
                        {apiFiles.map(af => <div key={af} className="pl-2">✓ {af}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Phase 5: Global Layouts */}
                  {layoutFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🎨</span> Phase 5 — Global Layouts & UI Shell
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Universal layouts components, navbar header headers aur main structure templates.</p>
                      <div className="mt-2 font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-0.5">
                        {layoutFiles.map(lf => <div key={lf}>📄 {lf}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Phase 6: Components */}
                  {componentFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🧩</span> Phase 6 — Reusable UI Components
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Isolate UI features, reusable modals, buttons aur display tables.</p>
                      <div className="mt-2 font-mono text-[10px] bg-zinc-50 p-2.5 rounded border border-zinc-150 space-y-1 max-h-[250px] overflow-y-auto">
                        <span className="text-zinc-800 font-bold">Interface Components:</span>
                        {componentFiles.map(cf => <div key={cf} className="pl-2">📄 {cf}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Phase 7: Pages / views */}
                  {pageFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🏠</span> Phase 7 — Page Layout Views & Stores
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Specific pages views folder structure aur global context providers state.</p>
                      <div className="mt-2 font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1 max-h-[250px] overflow-y-auto">
                        <span className="text-zinc-800 font-bold">Client Views:</span>
                        {pageFiles.map(pf => <div key={pf} className="pl-2">🗺️ {pf}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Phase 8: Other assets */}
                  {otherFiles.length > 0 && (
                    <div className="relative pl-6 border-l-2 border-zinc-200">
                      <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-900 ring-4 ring-white" />
                      <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                        <span>🖼️</span> Phase 8 — Static Assets & CSS Stylesheets
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Images, SVGs assets files aur base CSS styling rules sets.</p>
                      <div className="mt-2 font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1 max-h-[200px] overflow-y-auto">
                        {otherFiles.map(of => <div key={of}>📄 {of}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Final Phase */}
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 rounded-full bg-zinc-950 ring-4 ring-white" />
                    <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2">
                      <span>🚀</span> Final Polish & Deploy
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Code compression bundles assets dynamic integration aur final verification steps.</p>
                  </div>

                </div>

                {/* Timeline Chart */}
                <div className="border-t border-zinc-150 pt-6">
                  <h3 className="font-extrabold text-zinc-900 text-sm flex items-center gap-2 mb-4">
                    <span>📊</span> Complete Development Timeline
                  </h3>
                  <div className="p-4 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner border border-zinc-900 leading-relaxed max-h-[400px]">
                    {visualTimelineStr}
                  </div>
                </div>

                {/* Footnote */}
                <div className="text-[11px] text-zinc-400 font-sans border-t border-zinc-100 pt-4">
                  * Ye order source tree key hierarchy aur files metadata structure ke basis par compile-time reconstruct kiya gaya hai.
                </div>

              </div>
            </Reveal>
          </section>
        );
      })()}

      {/* Dynamic File Explainer Modal */}
      {selectedFile && (() => {
        const expl = getFileExplanation(selectedFile);
        const filename = selectedFile.split("/").pop() || selectedFile;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
            <div className="glass-card w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-750 transition-colors cursor-pointer border-0 bg-transparent text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl mt-1">📄</span>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-950 font-mono truncate max-w-[320px]">
                    {filename}
                  </h3>
                  <code className="text-[10px] text-zinc-400 block break-all font-mono mt-0.5">
                    {selectedFile}
                  </code>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-[10px] font-bold text-cyan-700">
                  {expl.role}
                </span>
                <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[10px] font-bold text-zinc-650">
                  {selectedFile.split(".").pop()?.toUpperCase()} File
                </span>
              </div>

              {/* Content sections */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                
                {/* 1. Overview */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>📝</span> Code me kya ho raha hai?
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                    {expl.summary}
                  </p>
                </div>

                {/* 2. Key Details */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>💡</span> Key Functions & Details:
                  </h4>
                  <ul className="space-y-2">
                    {expl.points.map((pt, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-zinc-650 leading-relaxed">
                        <span className="text-cyan-600 font-bold shrink-0">▸</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>

              {/* Footer action */}
              <div className="border-t border-zinc-100 pt-4 mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2 px-5 rounded-xl text-xs cursor-pointer border-0 transition-colors"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function Stat({ label, value, type }: { label: string; value: string; type: string }) {
  let colors = "border-zinc-250 bg-zinc-50 text-zinc-800";
  if (type === "stars") colors = "border-amber-200 bg-amber-50 text-amber-800";
  else if (type === "forks") colors = "border-cyan-200 bg-cyan-50 text-cyan-800";
  else if (type === "files") colors = "border-emerald-200 bg-emerald-50 text-emerald-800";
  else if (type === "folders") colors = "border-blue-200 bg-blue-50 text-blue-800";
  else if (type === "language") colors = "border-purple-200 bg-purple-50 text-purple-800";
  else if (type === "license") colors = "border-pink-200 bg-pink-50 text-pink-800";

  return (
    <span className={`rounded-lg border px-3 py-1 font-bold text-xs ${colors}`}>
      <span>{label}:</span>{" "}
      <span className="font-extrabold">{value}</span>
    </span>
  );
}
