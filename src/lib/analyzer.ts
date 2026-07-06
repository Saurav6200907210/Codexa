import type {
  AnalysisResult,
  FileExplanation,
  FolderExplanation,
  RepoMeta,
  TechItem,
  TreeNode,
  WorkflowStep,
} from "./types";
import { fetchRawFile, type GitTreeItem } from "./github";
import { folderPurpose, KNOWN_FILES, langFromPath } from "./knowledge";

/* ----------------------------- tree building ----------------------------- */

function buildTree(items: GitTreeItem[]): TreeNode {
  const root: TreeNode = { name: "root", path: "", type: "dir", children: [] };
  const dirMap = new Map<string, TreeNode>();
  dirMap.set("", root);

  const ensureDir = (path: string): TreeNode => {
    if (dirMap.has(path)) return dirMap.get(path)!;
    const parts = path.split("/");
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join("/");
    const parent = ensureDir(parentPath);
    const node: TreeNode = { name, path, type: "dir", children: [] };
    parent.children!.push(node);
    dirMap.set(path, node);
    return node;
  };

  for (const item of items) {
    if (item.type === "tree") {
      ensureDir(item.path);
    } else {
      const parts = item.path.split("/");
      const name = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join("/");
      const parent = ensureDir(parentPath);
      parent.children!.push({ name, path: item.path, type: "file" });
    }
  }

  const sortNode = (node: TreeNode) => {
    if (!node.children) return;
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNode);
  };
  sortNode(root);
  return root;
}

/* --------------------------- project detection --------------------------- */

interface Detection {
  projectType: string;
  techStack: TechItem[];
  summary: string;
  pkg: PackageJson | null;
}

interface PackageJson {
  name?: string;
  description?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function has(paths: Set<string>, ...names: string[]): boolean {
  return names.some((n) => paths.has(n.toLowerCase()));
}

function detectProject(
  meta: RepoMeta,
  paths: Set<string>,
  pkg: PackageJson | null
): Detection {
  const deps = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
  };
  const hasDep = (name: string) => Object.keys(deps).some((d) => d === name || d.startsWith(name));
  const tech: TechItem[] = [];
  let projectType = "Software Project";

  // Frameworks / languages
  if (hasDep("next")) {
    projectType = "Next.js Web App";
    tech.push({ name: "Next.js", emoji: "▲", reason: "React ka full-stack framework — pages, routing aur backend ek saath deta hai." });
  } else if (hasDep("@remix-run")) {
    projectType = "Remix Web App";
    tech.push({ name: "Remix", emoji: "💿", reason: "Full-stack React framework." });
  } else if (hasDep("gatsby")) {
    projectType = "Gatsby Site";
    tech.push({ name: "Gatsby", emoji: "🟣", reason: "React based static site generator." });
  } else if (hasDep("nuxt")) {
    projectType = "Nuxt (Vue) App";
    tech.push({ name: "Nuxt", emoji: "💚", reason: "Vue ka full-stack framework." });
  } else if (hasDep("vue")) {
    projectType = "Vue App";
    tech.push({ name: "Vue", emoji: "💚", reason: "UI banane ka progressive JavaScript framework." });
  } else if (hasDep("@angular/core")) {
    projectType = "Angular App";
    tech.push({ name: "Angular", emoji: "🅰️", reason: "Google ka bada framework enterprise apps ke liye." });
  } else if (hasDep("svelte")) {
    projectType = "Svelte App";
    tech.push({ name: "Svelte", emoji: "🧡", reason: "Compile-time UI framework, bahut fast." });
  } else if (hasDep("react")) {
    projectType = "React App";
    tech.push({ name: "React", emoji: "⚛️", reason: "Component-based UI library — screen ko chhote tukdon mein todti hai." });
  } else if (hasDep("express")) {
    projectType = "Node.js Backend (Express)";
    tech.push({ name: "Express", emoji: "🚂", reason: "Node.js ka minimal web server framework — API banane ke liye." });
  } else if (hasDep("@nestjs/core")) {
    projectType = "NestJS Backend";
    tech.push({ name: "NestJS", emoji: "🐈", reason: "Structured Node.js backend framework." });
  } else if (hasDep("fastify")) {
    projectType = "Fastify Backend";
    tech.push({ name: "Fastify", emoji: "⚡", reason: "Tez Node.js web framework." });
  }

  // Python / others by files
  if (has(paths, "requirements.txt", "pyproject.toml", "manage.py")) {
    if (has(paths, "manage.py")) {
      projectType = "Django Web App (Python)";
      tech.push({ name: "Django", emoji: "🎸", reason: "Python ka batteries-included web framework." });
    } else {
      projectType = projectType === "Software Project" ? "Python Project" : projectType;
      tech.push({ name: "Python", emoji: "🐍", reason: "Simple aur powerful programming language." });
    }
  }
  if (has(paths, "go.mod")) {
    projectType = "Go Project";
    tech.push({ name: "Go", emoji: "🐹", reason: "Google ki fast, compiled language." });
  }
  if (has(paths, "cargo.toml")) {
    projectType = "Rust Project";
    tech.push({ name: "Rust", emoji: "🦀", reason: "Safe aur fast systems language." });
  }

  // Add supporting tech
  if (hasDep("typescript") || has(paths, "tsconfig.json"))
    tech.push({ name: "TypeScript", emoji: "🔷", reason: "JavaScript + types = kam bugs, better autocomplete." });
  if (hasDep("tailwindcss"))
    tech.push({ name: "Tailwind CSS", emoji: "🌬️", reason: "Utility classes se fatafat styling." });
  if (hasDep("drizzle-orm"))
    tech.push({ name: "Drizzle ORM", emoji: "💧", reason: "TypeScript-first database toolkit." });
  if (hasDep("prisma") || hasDep("@prisma/client"))
    tech.push({ name: "Prisma", emoji: "◾", reason: "Modern database ORM, type-safe queries." });
  if (hasDep("mongoose"))
    tech.push({ name: "MongoDB (Mongoose)", emoji: "🍃", reason: "NoSQL database ke liye ODM." });
  if (hasDep("pg") || hasDep("postgres"))
    tech.push({ name: "PostgreSQL", emoji: "🐘", reason: "Powerful relational database." });
  if (hasDep("redux") || hasDep("@reduxjs/toolkit"))
    tech.push({ name: "Redux", emoji: "🏪", reason: "Global state management." });
  if (hasDep("zustand"))
    tech.push({ name: "Zustand", emoji: "🐻", reason: "Halka state management library." });
  if (hasDep("vite"))
    tech.push({ name: "Vite", emoji: "⚡", reason: "Super-fast build tool aur dev server." });
  if (hasDep("jest") || hasDep("vitest"))
    tech.push({ name: "Testing", emoji: "🧪", reason: "Automated tests se code reliable banta hai." });
  if (has(paths, "dockerfile", "docker-compose.yml"))
    tech.push({ name: "Docker", emoji: "🐳", reason: "App ko container mein pack kar ke kahin bhi chalao." });

  // If nothing detected, fall back to repo language
  if (tech.length === 0 && meta.language) {
    tech.push({ name: meta.language, emoji: "💻", reason: `Is project ki main language ${meta.language} hai.` });
  }

  const summary = buildSummary(meta, projectType, pkg);
  return { projectType, techStack: tech, summary, pkg };
}

function buildSummary(meta: RepoMeta, projectType: string, pkg: PackageJson | null): string {
  const desc = meta.description || pkg?.description;
  let s = `**${meta.fullName}** ek ${projectType} hai`;
  if (desc) s += ` jiska maksad hai: "${desc}"`;
  s += `. `;
  s += `Is repo ko ${meta.stars} logon ne star kiya hai`;
  if (meta.language) s += ` aur iski main language ${meta.language} hai`;
  s += `. Neeche hum step-by-step samjhenge ki yeh project andar se kaise kaam karta hai — kaunsa folder kya kaam karta hai aur code kaise flow hota hai.`;
  return s;
}

/* ----------------------------- folder summary ---------------------------- */

function buildFolders(items: GitTreeItem[]): FolderExplanation[] {
  const dirs = items.filter((i) => i.type === "tree");
  const files = items.filter((i) => i.type === "blob");

  // Prefer top-level and important second-level folders.
  const interesting = dirs.filter((d) => {
    const depth = d.path.split("/").length;
    const base = d.path.split("/").pop() ?? "";
    if (["node_modules", ".git", ".next", "dist", "build", ".github", "coverage"].includes(base))
      return false;
    return depth <= 2;
  });

  const explanations: FolderExplanation[] = interesting.map((d) => {
    const base = d.path.split("/").pop() ?? d.path;
    const { purpose, emoji } = folderPurpose(base);
    const inside = files.filter((f) => {
      const parent = f.path.split("/").slice(0, -1).join("/");
      return parent === d.path;
    });
    const sample = inside.slice(0, 6).map((f) => f.path.split("/").pop() ?? f.path);
    return {
      path: d.path,
      purpose,
      emoji,
      fileCount: inside.length,
      sampleFiles: sample,
      order: 0,
    };
  });

  // Order: entry-ish folders first, then logical flow.
  const rank = (p: string): number => {
    const b = p.split("/").pop()!.toLowerCase();
    const order = [
      "src", "app", "pages", "public", "components", "layouts", "hooks",
      "context", "store", "lib", "utils", "helpers", "api", "routes",
      "controllers", "services", "middleware", "models", "db", "database",
      "migrations", "config", "types", "styles", "tests", "scripts", "docs",
    ];
    const idx = order.indexOf(b);
    return idx === -1 ? 100 + p.length : idx;
  };
  explanations.sort((a, b) => rank(a.path) - rank(b.path));
  explanations.forEach((e, i) => (e.order = i + 1));
  return explanations;
}

/* ------------------------------ file picking ----------------------------- */

// Choose the most useful files to explain in detail (limit requests).
function pickKeyFiles(items: GitTreeItem[]): string[] {
  const files = items.filter((i) => i.type === "blob").map((i) => i.path);
  const picked: string[] = [];
  const add = (p: string) => {
    if (p && !picked.includes(p) && picked.length < 14) picked.push(p);
  };

  const lower = (p: string) => p.toLowerCase();
  // 1. Important config/entry files
  const priority = [
    "package.json",
    "next.config.ts", "next.config.js", "next.config.mjs",
    "vite.config.ts", "vite.config.js",
    "src/index.ts", "src/index.js", "src/main.ts", "src/main.tsx", "src/main.js",
    "index.js", "index.ts", "main.py", "app.py", "server.js", "server.ts",
    "src/app.js", "src/app.ts", "app.js", "app.ts",
    "src/app/page.tsx", "app/page.tsx", "pages/index.js", "pages/index.tsx",
    "src/app/layout.tsx", "app/layout.tsx",
  ];
  for (const p of priority) {
    const found = files.find((f) => lower(f) === p);
    if (found) add(found);
  }

  // 2. A few representative source files from common folders
  const sourceExts = [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java", ".vue"];
  const isSource = (p: string) => sourceExts.some((e) => p.endsWith(e));
  const scoreFolder = (p: string): number => {
    if (p.includes("/components/")) return 5;
    if (p.includes("/api/") || p.includes("/routes/")) return 6;
    if (p.includes("/models/") || p.includes("/db/") || p.includes("schema")) return 7;
    if (p.includes("/lib/") || p.includes("/utils/")) return 4;
    if (p.includes("/hooks/")) return 3;
    return 1;
  };
  const candidates = files
    .filter((f) => isSource(f))
    .filter((f) => !f.includes("node_modules") && !f.includes(".test.") && !f.includes(".spec."))
    .filter((f) => !picked.includes(f))
    .sort((a, b) => scoreFolder(b) - scoreFolder(a));
  for (const c of candidates) add(c);

  return picked;
}

/* -------------------------- per-file explanation ------------------------- */

function explainFile(path: string, content: string | null): FileExplanation {
  const base = path.split("/").pop() ?? path;
  const language = langFromPath(path);
  const points: string[] = [];
  let role = "Source file";

  // Known config files get a canned summary.
  const knownKey = KNOWN_FILES[base.toLowerCase()] ?? KNOWN_FILES[path.toLowerCase()];
  if (base.toLowerCase() === "package.json" && content) {
    role = "Project config";
    try {
      const pkg = JSON.parse(content);
      if (pkg.scripts) {
        const scripts = Object.keys(pkg.scripts).slice(0, 6);
        points.push(`Scripts available: ${scripts.map((s) => `\`npm run ${s}\``).join(", ")}. Yeh commands project ko chalane/build karne ke liye hain.`);
      }
      const deps = Object.keys(pkg.dependencies ?? {});
      if (deps.length) points.push(`${deps.length} main dependencies use hoti hain, jaise: ${deps.slice(0, 8).join(", ")}.`);
      const dev = Object.keys(pkg.devDependencies ?? {});
      if (dev.length) points.push(`${dev.length} dev-dependencies (sirf development ke liye) jaise: ${dev.slice(0, 6).join(", ")}.`);
    } catch {
      points.push("Project ka metadata aur dependencies define karta hai.");
    }
    return { path, language, role, summary: knownKey ?? "", points };
  }

  if (knownKey) {
    return {
      path,
      language,
      role: "Config",
      summary: knownKey,
      points: content ? codePoints(path, content) : [],
    };
  }

  // Generic source file analysis
  role = fileRole(path);
  const summary = fileSummary(path, role);
  if (content) points.push(...codePoints(path, content));
  return { path, language, role, summary, points };
}

function fileRole(path: string): string {
  const p = path.toLowerCase();
  const base = p.split("/").pop() ?? p;
  if (base.startsWith("use") && (base.endsWith(".ts") || base.endsWith(".tsx"))) return "React Hook";
  if (p.includes("/api/") || p.includes("route.")) return "API / Route handler";
  if (p.includes("/components/")) return "UI Component";
  if (p.includes("/models/") || p.includes("schema")) return "Data Model / Schema";
  if (p.includes("/controllers/")) return "Controller";
  if (p.includes("/services/")) return "Service (business logic)";
  if (p.includes("/utils/") || p.includes("/helpers/")) return "Utility helper";
  if (p.includes("/lib/")) return "Library setup";
  if (base.includes("layout")) return "Layout";
  if (base.includes("page") || base === "index.tsx" || base === "index.jsx") return "Page";
  if (base.includes("index")) return "Entry point";
  return "Source file";
}

function fileSummary(path: string, role: string): string {
  const base = path.split("/").pop() ?? path;
  const map: Record<string, string> = {
    "React Hook": `\`${base}\` ek custom React hook hai — reusable logic jo components mein use hoti hai.`,
    "API / Route handler": `\`${base}\` ek backend endpoint hai. Jab frontend request bhejta hai to yeh code chalta hai aur response wapas deta hai.`,
    "UI Component": `\`${base}\` ek UI component hai — screen ka ek reusable tukda jo props leke kuch render karta hai.`,
    "Data Model / Schema": `\`${base}\` data ka structure define karta hai — database mein data kaisa store hoga.`,
    Controller: `\`${base}\` request handle karta hai aur decide karta hai kya response bhejna hai.`,
    "Service (business logic)": `\`${base}\` mein asli business logic hai jo controllers/routes use karte hain.`,
    "Utility helper": `\`${base}\` chhoti helper functions rakhta hai jo baar-baar kaam aati hain.`,
    "Library setup": `\`${base}\` reusable setup/config code rakhta hai (jaise DB ya API client).`,
    Layout: `\`${base}\` page ka common wrapper hai (header/footer) jo har page ke around lagta hai.`,
    Page: `\`${base}\` ek page hai jo user ko browser mein dikhta hai.`,
    "Entry point": `\`${base}\` app ka shuruaati point hai — yahin se cheezein start hoti hain.`,
  };
  return map[role] ?? `\`${base}\` project ka ek source file hai.`;
}

// Very light static analysis -> beginner-friendly bullet points.
function codePoints(path: string, content: string): string[] {
  const points: string[] = [];
  const lines = content.split("\n");
  const totalLines = lines.length;

  // Imports
  const imports = new Set<string>();
  const importRe = /(?:import[\s\S]*?from\s+|require\()\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(content)) !== null) imports.add(m[1]);
  const pyImportRe = /^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))/gm;
  while ((m = pyImportRe.exec(content)) !== null) imports.add(m[1] || m[2]);
  if (imports.size) {
    const list = Array.from(imports).slice(0, 6);
    points.push(`Yeh file inko import/use karti hai: ${list.map((i) => `\`${i}\``).join(", ")}${imports.size > 6 ? " (aur bhi)" : ""}.`);
  }

  // Exported / defined functions & components
  const names = new Set<string>();
  const fnRe = /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/g;
  while ((m = fnRe.exec(content)) !== null) names.add(m[1]);
  const arrowRe = /(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/g;
  while ((m = arrowRe.exec(content)) !== null) names.add(m[1]);
  const classRe = /(?:export\s+)?class\s+([A-Za-z0-9_]+)/g;
  while ((m = classRe.exec(content)) !== null) names.add(m[1]);
  const pyDefRe = /^\s*def\s+([A-Za-z0-9_]+)/gm;
  while ((m = pyDefRe.exec(content)) !== null) names.add(m[1]);
  const pyClassRe = /^\s*class\s+([A-Za-z0-9_]+)/gm;
  while ((m = pyClassRe.exec(content)) !== null) names.add(m[1]);
  if (names.size) {
    const list = Array.from(names).slice(0, 6);
    points.push(`Isme yeh functions/components banaye gaye hain: ${list.map((n) => `\`${n}()\``).join(", ")}${names.size > 6 ? " (aur bhi)" : ""}.`);
  }

  // HTTP methods (route files)
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"].filter((mm) =>
    new RegExp(`export\\s+(?:async\\s+)?function\\s+${mm}\\b|\\.${mm.toLowerCase()}\\s*\\(`).test(content)
  );
  if (methods.length)
    points.push(`Yeh in HTTP methods ko handle karta hai: ${methods.join(", ")}. Matlab frontend in tarikon se data maang/bhej sakta hai.`);

  // React hooks usage
  const hooks = ["useState", "useEffect", "useContext", "useRef", "useMemo", "useCallback"].filter((h) =>
    content.includes(h)
  );
  if (hooks.length)
    points.push(`React hooks use hote hain: ${hooks.join(", ")} — inse component apna data/state manage karta hai.`);

  // DB hints
  if (/select|insert|update|delete/i.test(content) && /from\s+['"]?\w/i.test(content) === false && /\b(select|insert into|update|delete from)\b/i.test(content))
    points.push("Database queries (SQL) is file mein likhi gayi hain.");

  points.push(`Total lagbhag ${totalLines} lines ka code hai (${langFromPath(path)}).`);
  return points;
}

/* ------------------------------- workflow -------------------------------- */

function buildWorkflow(
  projectType: string,
  folders: FolderExplanation[],
  paths: Set<string>
): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  const folderNames = new Set(folders.map((f) => f.path.split("/").pop()!.toLowerCase()));
  let n = 1;
  const push = (title: string, description: string, emoji: string) =>
    steps.push({ step: n++, title, description, emoji });

  push(
    "Project start hota hai",
    has(paths, "package.json")
      ? "`npm install` se dependencies aati hain, phir `npm run dev`/`start` se app chalu hoti hai. Entry file yahin se load hoti hai."
      : "Project ki entry file se execution shuru hoti hai.",
    "🚀"
  );

  if (projectType.includes("Next.js") || folderNames.has("app") || folderNames.has("pages")) {
    push("Routing decide hoti hai", "Next.js `app/` ya `pages/` folder ko dekh kar URL banata hai. Jo URL user kholta hai, uska matching page render hota hai.", "🛣️");
    push("UI render hota hai", "Page apne components (buttons, cards) ko jodta hai aur browser mein screen dikhati hai.", "🖼️");
  } else if (projectType.includes("React") || projectType.includes("Vue")) {
    push("App mount hoti hai", "Root component DOM mein mount hota hai aur poori UI build karta hai.", "⚛️");
    push("Components render hote hain", "Chhote-chhote components milkar poora page banate hain. Props se data neeche flow hota hai.", "🧩");
  } else if (projectType.includes("Express") || projectType.includes("Backend") || projectType.includes("Nest")) {
    push("Server sunna shuru karta hai", "Server ek port par requests ka intezaar karta hai.", "🖥️");
    push("Route match hota hai", "Request URL dekh kar sahi route/controller chuna jaata hai.", "🛣️");
  }

  if (folderNames.has("api") || folderNames.has("routes") || folderNames.has("controllers")) {
    push("Backend request handle karta hai", "API/route handler request leta hai, zaroori check karta hai aur kaam karta hai.", "🔌");
  }
  if (folderNames.has("services")) {
    push("Business logic chalti hai", "Service layer asli kaam karti hai (calculations, external API calls).", "⚙️");
  }
  if (folderNames.has("models") || folderNames.has("db") || folderNames.has("database") || has(paths, "schema.prisma", "src/db/schema.ts")) {
    push("Database se baat hoti hai", "Models/DB layer data ko save ya fetch karti hai (create, read, update, delete).", "🗄️");
  }
  push(
    "Response wapas jaata hai",
    "Data process hone ke baad result user ko dikhaya jaata hai ya API JSON ke roop mein wapas milta hai.",
    "✅"
  );
  return steps;
}

/* -------------------------------- stats ---------------------------------- */

function buildStats(items: GitTreeItem[]) {
  const files = items.filter((i) => i.type === "blob");
  const folders = items.filter((i) => i.type === "tree");
  const counts = new Map<string, number>();
  for (const f of files) {
    const lang = langFromPath(f.path);
    if (["JSON", "Markdown", "Text", "YAML", "Env config"].includes(lang)) continue;
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  const languages = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  return { totalFiles: files.length, totalFolders: folders.length, languages };
}

/* ------------------------------- main run -------------------------------- */

export async function analyzeRepo(
  meta: RepoMeta,
  items: GitTreeItem[]
): Promise<AnalysisResult> {
  const pathSet = new Set(items.map((i) => i.path.toLowerCase()));

  // Read package.json for detection
  let pkg: PackageJson | null = null;
  if (pathSet.has("package.json")) {
    const raw = await fetchRawFile(meta.owner, meta.name, meta.defaultBranch, "package.json");
    if (raw) {
      try {
        pkg = JSON.parse(raw);
      } catch {
        pkg = null;
      }
    }
  }

  const detection = detectProject(meta, pathSet, pkg);
  const folders = buildFolders(items);
  const workflow = buildWorkflow(detection.projectType, folders, pathSet);
  const tree = buildTree(items);
  const stats = buildStats(items);

  // Explain key files (fetch their content in parallel)
  const keyFiles = pickKeyFiles(items);
  const contents = await Promise.all(
    keyFiles.map((p) => fetchRawFile(meta.owner, meta.name, meta.defaultBranch, p))
  );
  const files = keyFiles.map((p, i) => explainFile(p, contents[i]));

  return {
    repo: meta,
    summary: detection.summary,
    projectType: detection.projectType,
    techStack: detection.techStack,
    workflow,
    folders,
    files,
    tree,
    stats,
  };
}
