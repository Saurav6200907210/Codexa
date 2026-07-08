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
    
    let summary = isHinglish
      ? `Ye file \`${filename}\` code flow ke liye ek key part hai.`
      : `This file \`${filename}\` is a key part of the code flow.`;
    const points: string[] = [];
    let role = "Source File";

    if (nameLower.endsWith(".json")) {
      role = "Configuration File";
      summary = isHinglish
        ? `Ye project ki configuration settings file \`${filename}\` hai.`
        : `This is the configuration settings file \`${filename}\` of the project.`;
      if (isHinglish) {
        points.push(
          "Isme JSON formatted structured key-value configurations store kiye gaye hain.",
          "Dependency libraries, build variables aur environment settings control karti hai.",
          "Is file ke badalne se runtime behaviors aur library version constraints change ho sakte hain."
        );
      } else {
        points.push(
          "Stores JSON formatted structured key-value configurations.",
          "Controls dependency libraries, build variables, and environment settings.",
          "Modifying this file can alter runtime behaviors and package version constraints."
        );
      }
    } else if (nameLower.endsWith(".config.js") || nameLower.endsWith(".config.ts") || nameLower.endsWith(".config.mjs")) {
      role = "Module Configuration";
      summary = isHinglish
        ? `Ye tool configure karne ki configuration file \`${filename}\` hai.`
        : `This is the tool configuration file \`${filename}\`.`;
      if (isHinglish) {
        points.push(
          "Build engines (Vite/Next), CSS styling rules (Tailwind/PostCSS) ya database migrations settings init karti hai.",
          "Server-side optimization parameters, entry routes proxies aur base paths control karti hai."
        );
      } else {
        points.push(
          "Initializes settings for build engines (Vite/Next), CSS styling rules (Tailwind/PostCSS), or database migrations.",
          "Controls server-side optimization parameters, entry route proxies, and base paths."
        );
      }
    } else if (pathLower.includes("db/") || pathLower.includes("database/") || nameLower.includes("schema")) {
      role = "Database Schema / Connection";
      summary = isHinglish
        ? `Ye database integrity aur structure maintain karne ki logic file \`${filename}\` hai.`
        : `This is the logic file \`${filename}\` to maintain database integrity and structure.`;
      if (isHinglish) {
        points.push(
          "Database tables schemas, entity columns datatypes aur index constraints mappings store karti hai.",
          "Drizzle/Prisma client hooks provide karti hai jisse frontend-backend type-safe queries kar sakein.",
          "Relation configurations aur defaults hooks (jaise defaultNow()) define kiye gaye hain."
        );
      } else {
        points.push(
          "Maps database table schemas, entity columns datatypes, and index constraints.",
          "Provides Drizzle/Prisma client hooks so the frontend and backend can perform type-safe queries.",
          "Defines relation configurations and default hooks (like defaultNow())."
        );
      }
    } else if (pathLower.includes("routes/") || pathLower.includes("api/")) {
      role = "API Endpoint Route";
      summary = isHinglish
        ? `Ye HTTP requests processing endpoints register karne wali routing file \`${filename}\` hai.`
        : `This is the routing file \`${filename}\` that registers HTTP request processing endpoints.`;
      if (isHinglish) {
        points.push(
          "Kaunse request paths (GET, POST, DELETE etc.) kaunse backend actions run karenge, yeh handle karti hai.",
          "Database handlers trigger karti hai request responses dynamically retrieve/update karne ke liye.",
          "JSON payloads wrap karke secure status headers ke sath output return karti hai."
        );
      } else {
        points.push(
          "Handles which backend actions run for specific request paths (GET, POST, DELETE, etc.).",
          "Triggers database handlers to dynamically retrieve or update request responses.",
          "Wraps JSON payloads and returns output with secure status headers."
        );
      }
    } else if (pathLower.includes("components/") || pathLower.includes("ui/") || pathLower.includes("shared/")) {
      role = "Reusable UI Component";
      summary = isHinglish
        ? `Ye front-end presentation layer component file \`${filename}\` hai.`
        : `This is the front-end presentation layer component file \`${filename}\`.`;
      if (isHinglish) {
        points.push(
          "TypeScript/React reusable visual structure define karti hai jo application shell layout me use hota hai.",
          "Props interfaces define karke structural elements dynamically bind karti hai.",
          "Modern CSS/HTML styling aur responsive rules include karti hai."
        );
      } else {
        points.push(
          "Defines reusable TypeScript/React visual structures used inside the application shell layout.",
          "Defines props interfaces to dynamically bind structural elements.",
          "Includes modern CSS/HTML styling and responsive design rules."
        );
      }
    } else if (pathLower.includes("pages/") || pathLower.includes("app/") || pathLower.includes("views/")) {
      role = "Page Router View";
      summary = isHinglish
        ? `Ye specific route rendering page view component file \`${filename}\` hai.`
        : `This is the specific route rendering page view component file \`${filename}\`.`;
      if (isHinglish) {
        points.push(
          "URL targets matching UI layout render karti hai.",
          "Internal components import karke pages structures grid compose karti hai.",
          "Client side routing state transitions and redirect triggers attach karti hai."
        );
      } else {
        points.push(
          "Renders the UI layout matching target URLs.",
          "Imports internal components to compose page structures and grids.",
          "Attaches client-side routing state transitions and redirect triggers."
        );
      }
    } else if (pathLower.includes("lib/") || pathLower.includes("services/") || pathLower.includes("utils/")) {
      role = "Helper / Utility Module";
      summary = isHinglish
        ? `Ye reusable core function logic code file \`${filename}\` hai.`
        : `This is the reusable core function logic code file \`${filename}\`.`;
      if (isHinglish) {
        points.push(
          "Modular utility calculation, date parse aur helpers helper exports rakhti hai.",
          "Third party SDK clients initialize karti hai aur custom exceptions checks handles validate karti hai.",
          "Main calculations aur process flows layers decouple karke clean maintain karti hai."
        );
      } else {
        points.push(
          "Contains modular utility calculations, date parsers, and helper exports.",
          "Initializes third-party SDK clients and validates custom exception checks.",
          "Decouples main calculations and process flow layers to keep the code clean."
        );
      }
    } else if (nameLower.endsWith(".html") || nameLower.endsWith(".htm")) {
      role = "HTML Layout / Template";
      summary = isHinglish
        ? `Ye browser ke liye visual structure define karne wali HTML template page \`${filename}\` hai.`
        : `This is the HTML template page \`${filename}\` defining visual structure for the browser.`;
      if (isHinglish) {
        points.push(
          "Application structure ka core entry skeleton define karti hai.",
          "Favicons, browser headers, page viewport aur essential metadata/scripts references inject karti hai.",
          "Dynamic components mounting point setup (like `#root` or `#app`) provide karti hai."
        );
      } else {
        points.push(
          "Defines the core entry skeleton of the application structure.",
          "Injects favicons, browser headers, page viewport, and essential metadata/script references.",
          "Provides setup for dynamic component mounting points (like `#root` or `#app`)."
        );
      }
    } else if (nameLower.endsWith(".css") || nameLower.endsWith(".scss") || nameLower.endsWith(".sass") || nameLower.endsWith(".less")) {
      role = "Stylesheet / Styling Rules";
      summary = isHinglish
        ? `Ye application ke components visual theme aur layouts design karne wali stylesheet file \`${filename}\` hai.`
        : `This is the stylesheet file \`${filename}\` that designs visual themes and layouts of application components.`;
      if (isHinglish) {
        points.push(
          "Modern styling attributes, animations keyframes, media queries aur variables control karti hai.",
          "Components margins, custom grids, dark/light theme behaviors aur standard layout parameters adjust karti hai."
        );
      } else {
        points.push(
          "Controls modern styling attributes, animation keyframes, media queries, and styling variables.",
          "Adjusts component margins, custom grids, dark/light theme behaviors, and layout parameters."
        );
      }
    } else if (nameLower.endsWith(".md") || nameLower.endsWith(".mdx")) {
      role = "Documentation File";
      summary = isHinglish
        ? `Ye markdown syntax based instruction / documentation guide file \`${filename}\` hai.`
        : `This is the markdown syntax-based instruction / documentation guide file \`${filename}\`.`;
      if (isHinglish) {
        points.push(
          "Developers aur users ke liye project installation setup, code configurations aur run scripts explain karti hai.",
          "Formatting patterns, headings, lists aur tables use karke clean documentation provide karti hai."
        );
      } else {
        points.push(
          "Explains project installation setup, code configurations, and run scripts for developers and users.",
          "Provides clean documentation using formatting patterns, headings, lists, and tables."
        );
      }
    } else if (nameLower.endsWith(".yml") || nameLower.endsWith(".yaml") || nameLower.endsWith(".toml")) {
      role = "Build & Deployment Configuration";
      summary = isHinglish
        ? `Ye build pipelines aur deployment automations control karne wali YAML/TOML structured format config file \`${filename}\` hai.`
        : `This is the YAML/TOML structured config file \`${filename}\` controlling build pipelines and deployment automation.`;
      if (isHinglish) {
        points.push(
          "GitHub CI/CD Actions workflows, packages versions specifications aur dynamic parameters rules configure karti hai.",
          "Application release cycle steps aur tests environment initialization settings track karti hai."
        );
      } else {
        points.push(
          "Configures GitHub CI/CD Actions workflows, package versions specifications, and dynamic parameter rules.",
          "Tracks application release cycle steps and test environment initialization settings."
        );
      }
    } else if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(nameLower)) {
      role = "Static Media Asset";
      summary = isHinglish
        ? `Ye application UI layouts me load hone wali image / icon graphical asset file \`${filename}\` hai.`
        : `This is the image/icon graphical asset file \`${filename}\` loaded in application UI layouts.`;
      if (isHinglish) {
        points.push(
          "Interface graphics, visual diagrams, logo icons aur assets standard formats define karti hai.",
          "Web optimization assets pipeline ke through build artifacts cache storage me load hoti hai."
        );
      } else {
        points.push(
          "Defines standard formats for interface graphics, visual diagrams, logo icons, and assets.",
          "Loads assets into cache storage through the web optimization asset pipeline."
        );
      }
    } else {
      const ext = filename.split(".").pop() || "";
      role = `${ext.toUpperCase()} Source File`;
      summary = isHinglish
        ? `Ye project runtime behavior execute karne wali logic source file \`${filename}\` hai.`
        : `This is the logic source file \`${filename}\` that executes project runtime behavior.`;
      if (isHinglish) {
        points.push(
          `Is source code module me essential execution behaviors aur methods logic write kiye gaye hain.`,
          `Functions definitions aur components modules import karke application code structure configure karti hai.`,
          `Dynamic operations parameters register karke dependencies standard logic bind karti hai.`
        );
      } else {
        points.push(
          `Essential execution behaviors and methods logic are written in this source code module.`,
          `Imports function definitions and components modules to configure application code structure.`,
          `Registers dynamic operation parameters and binds standard dependency logic.`
        );
      }
    }

    return { summary, points, role };
  };

  const getFileDetailedExplanation = (path: string): { title: string; content: string }[] => {
    const filename = path.split("/").pop() || path;
    const nameLower = filename.toLowerCase();
    const pathLower = path.toLowerCase();
    const ext = filename.split(".").pop()?.toUpperCase() || "File";

    let descType = "Frontend/Backend Source Logic";
    let isConfig = nameLower.endsWith(".json") || nameLower.endsWith(".config.js") || nameLower.endsWith(".config.ts") || nameLower.endsWith(".config.mjs") || nameLower.includes(".gitignore") || nameLower.includes("eslint");
    let isDB = pathLower.includes("db/") || pathLower.includes("database/") || nameLower.includes("schema");
    let isAPI = pathLower.includes("routes/") || pathLower.includes("api/");
    let isComponent = pathLower.includes("components/") || pathLower.includes("ui/") || pathLower.includes("shared/");
    let isPage = pathLower.includes("pages/") || pathLower.includes("app/") || pathLower.includes("views/");
    let isUtil = pathLower.includes("lib/") || pathLower.includes("services/") || pathLower.includes("utils/") || pathLower.includes("helpers/");
    let isHTML = nameLower.endsWith(".html") || nameLower.endsWith(".htm");
    let isCSS = nameLower.endsWith(".css") || nameLower.endsWith(".scss") || nameLower.endsWith(".sass") || nameLower.endsWith(".less");
    let isMD = nameLower.endsWith(".md") || nameLower.endsWith(".mdx");
    let isCICD = nameLower.endsWith(".yml") || nameLower.endsWith(".yaml") || nameLower.endsWith(".toml");
    let isAsset = /\.(png|jpe?g|gif|svg|ico|webp)$/i.test(nameLower);

    if (isConfig) descType = "Configuration File";
    else if (isDB) descType = "Database Schema / Entity Models";
    else if (isAPI) descType = "API Route / Server Request Handler";
    else if (isComponent) descType = "Reusable UI component";
    else if (isPage) descType = "App Page Router / View Layout";
    else if (isUtil) descType = "Core Utility / Business logic helper";
    else if (isHTML) descType = "HTML Skeleton Template";
    else if (isCSS) descType = "Styling Sheet Rules";
    else if (isMD) descType = "Documentation Guide / Readme";
    else if (isCICD) descType = "Build Workflow pipeline settings";
    else if (isAsset) descType = "Static Media resource";

    const sections: { title: string; content: string }[] = [];

    // 1. File Overview
    sections.push({
      title: "1. File Overview",
      content: isHinglish
        ? `• **Why this file exists:** Ye file \`${filename}\` is project me key configurations, logic patterns ya presentations compile karne ke liye banayi gayi hai.
• **What problem it solves:** Iska main objective repository implementation structure and behaviors code consistency standardize karna hai.
• **What would happen if this file did not exist:** Agar ye file project me nahi hogi, toh is file se define hone wala behavior break ho jayega aur application execution run time fail ho sakti hai.
• **File Category:** Ye ek **${descType}** category ki file hai.`
        : `• **Why this file exists:** This file \`${filename}\` was created to compile key configurations, logic patterns, or presentation layouts in the project.
• **What problem it solves:** Its primary objective is to standardize repository implementation structure and ensure code consistency.
• **What would happen if this file did not exist:** If this file is missing, the functionality defined by it will break, potentially causing runtime failures during application execution.
• **File Category:** This file belongs to the **${descType}** category.`
    });

    // 2. Where This File Fits In The Project
    let chain = "Browser → App.tsx → Layout.tsx → Current File";
    if (isConfig) chain = "Package Engine (npm/vite) → Configuration CLI → Current File";
    else if (isDB) chain = "Server Instance → Connection Driver → Models Schema → Current File";
    else if (isAPI) chain = "Client Fetch HTTP → Router Handler Middleware → Current File";
    else if (isComponent) chain = "App.tsx → Pages/Views Layout → UI Grid → Current File";
    else if (isPage) chain = "URL Address bar Routing → Router Switcher → Current File";
    else if (isUtil) chain = "Main Server/Client Action → Business Services Handler → Current File";
    
    sections.push({
      title: "2. Where This File Fits In The Project",
      content: isHinglish
        ? `**Execution Chain Workflow:**
\`\`\`
${chain}
\`\`\`
• **Who imports this file:** Is file ko main package engines, framework wrapper, ya target components modules import karte hain.
• **Which files use it:** Project ke context folders, sub-directories aur relative routes files is file ke values/logic consume karte hain.
• **Which files depend on it:** Relational imports aur setup packages config settings parameters ispar dynamically dependencies generate karti hain.`
        : `**Execution Chain Workflow:**
\`\`\`
${chain}
\`\`\`
• **Who imports this file:** This file is imported by the main package engines, framework wrappers, or target component modules.
• **Which files use it:** Context directories, sub-folders, and relative route files consume the values/logic defined in this file.
• **Which files depend on it:** Relational imports and setup package config settings depend dynamically on this module.`
    });

    // 3. What Happens Inside This File
    let flowStr = "Imports\n     ↓\nVariables & Constants\n     ↓\nHelper Functions\n     ↓\nLogic Execution\n     ↓\nExport Elements";
    if (isComponent || isPage) flowStr = "Imports\n     ↓\nProps Types definition\n     ↓\nReact Hooks (State/Effects)\n     ↓\nEvents handlers & internal Logic\n     ↓\nJSX UI Elements layout\n     ↓\nDefault Exports";
    
    sections.push({
      title: "3. What Happens Inside This File",
      content: isHinglish
        ? `**Execution flow of javascript/module compilation inside file:**
\`\`\`
${flowStr}
\`\`\`
• Sabse pehle compiler essential third-party components aur layout models resolve karta hai.
• Uske baad internal states settings, logic hooks and constants functions stack process structure initiate karti hain.
• Final components render, return parameters ya configure object structure parse karke client output format standard set hota hai.`
        : `**Execution flow of javascript/module compilation inside file:**
\`\`\`
${flowStr}
\`\`\`
• First, the compiler resolves essential third-party components and layout modules.
• Next, internal state configurations, logic hooks, and helper constants initiate the execution flow.
• Finally, components are rendered, and return values or configuration objects are parsed to produce the standard client output format.`
    });

    // 4. Imports Explained
    sections.push({
      title: "4. Imports Explained",
      content: isHinglish
        ? `• **Standard React / Third-Party modules:** External dependencies files loading parameters aur packages resolve karne ke liye standard hooks (jaise useState, useEffect) import hote hain.
• **Local styles / Components path:** Local helper icons, styling models, custom buttons controllers dynamically import ho rahe hain.
• **Utility parameters:** Database drivers, variables methods structure parse configurations clean environment implement karti hain.`
        : `• **Standard React / Third-Party modules:** Standard hooks (like useState, useEffect) and packages are imported to resolve external dependency libraries.
• **Local styles / Components path:** Helper icons, custom buttons, and local styling elements are imported.
• **Utility parameters:** Database drivers, parsed variables, and environment configuration parameters are imported to keep code files clean.`
    });

    // 5. Functions Explained
    sections.push({
      title: "5. Functions Explained",
      content: isHinglish
        ? `• **Core helper methods / Component execution:** Component/Module state rendering parameters aur logical evaluations runs karti hain.
• **Who calls it:** Browser user layout events ya layout router lifecycle mounts.
• **Inputs & Outputs:** Inputs configurations structures aur props parameter target maps accept karti hai, aur compile parameters / JSX element node UI return output generate karti hai.
• **Post Execution:** Final layout renders or values update variables stack trigger updates dynamically updates.`
        : `• **Core helper methods / Component execution:** Executes calculations, logical checks, or manages visual component rendering states.
• **Who calls it:** Browser user interactions, page lifecycle events, or page router triggers.
• **Inputs & Outputs:** Receives props or configuration structures, and returns updated execution states or visual UI nodes.
• **Post Execution:** Updates state variables dynamically to trigger UI updates and visual rerenders.`
    });

    // 6. Component Breakdown
    sections.push({
      title: "6. Component Breakdown",
      content: isHinglish
        ? `• **UI Presentation View Block:** Standard layouts container blocks templates display and design system rules update rules rules.
• **Displayed Data:** Key variables properties values aur configuration keys labels values screens visual update dynamically load rules.
• **User Interactions:** Clicks hooks triggers, key handlers inputs changes, forms submits callbacks methods maps rules variables layout.`
        : `• **UI Presentation View Block:** Provides visual container skeletons and layout structures following the system design rules.
• **Displayed Data:** Renders calculated states, dynamic values, and labels on user screens.
• **User Interactions:** Handles click events, input changes, and form submissions via event handler callback functions.`
    });

    // 7. Code Flow
    sections.push({
      title: "7. Code Flow",
      content: `**Step-by-step code execution flow:**
\`\`\`
Imports Resolving
       ↓
Local Configurations & Constants Initialization
       ↓
Local Hook states allocation & Event Binding
       ↓
Dynamic Data computation & logic flow trigger
       ↓
JSX template layouts compilation
       ↓
DOM Paint (Browser UI Render)
\`\`\``
    });

    // 8. Data Flow
    sections.push({
      title: "8. Data Flow",
      content: `**Data Workflow origin diagram:**
\`\`\`
External Environment / Git API
           ↓
Backend Controllers / Databases
           ↓
Static Files / Pages Routing Context
           ↓
Current File Target Logic
           ↓
DOM State Render / Configuration Load
\`\`\``
    });

    // 9. Beginner Friendly Explanation
    sections.push({
      title: isHinglish ? "9. Beginner Friendly Explanation (Hindi + English)" : "9. Beginner Friendly Explanation",
      content: isHinglish
        ? `Socho ye file ek **kitchen key blueprint** ya **recipe card** jaisi hai! 🍳
• Jaise kitchen me food recipe banane ke liye ingredients require hotey hain (jo hamare *Imports* hain).
• Recipe ke instructions step by step follow hotey hain (jo hamari *Functions* logic hai).
• Aur last me delicious food plate ready hokar plate server hoti hai (jo hamara *JSX UI output* ya *Config structure* hai!).
Agar ye recipe card miss ho jaye, toh cook confuse ho jayega aur standard dish nahi ban payegi! Isliye ye file project structure flow me essential role represent karti hai.`
        : `Think of this file as a **kitchen recipe card**! 🍳
• Just like a recipe needs ingredients to cook food, this file imports modules (which are our *Imports*).
• Just like recipe instructions are followed step-by-step, the code follows instructions (our *Functions* logic).
• And finally, the delicious dish is served on a plate (our *JSX UI Output* or *Config structure*!).
If this recipe card goes missing, the chef gets confused and the dish cannot be prepared. That is why this file plays an essential role in the project!`
    });

    // 10. Important Concepts Used
    sections.push({
      title: "10. Important Concepts Used",
      content: isHinglish
        ? `✓ **Modular Programming:** Code reuse and structure clarity modules break maps code rules.
✓ **TypeScript Type Safety:** Proper types templates definitions variables consistency compile safety targets rules.
✓ **State & Data Bindings:** Dynamic state UI events triggers hooks.
✓ **Configuration Parsing:** Key-value attributes standard mapping settings.`
        : `✓ **Modular Programming:** Breaking code into reusable blocks for clean structure.
✓ **TypeScript Type Safety:** Using custom type definitions to prevent compile-time bugs.
✓ **State & Data Bindings:** Syncing UI nodes dynamically based on user interaction states.
✓ **Configuration Parsing:** Mapping structured settings parameters to configure tools.`
    });

    // 11. If I Remove This File
    sections.push({
      title: "11. If I Remove This File",
      content: isHinglish
        ? `• **What will break:** Is file ka dependent code flow compile load crash errors throws variables properties.
• **Which pages stop working:** Core pages layouts and views screens templates.
• **Will the project compile:** Code compiler errors like "Module not found" or "undefined imports exceptions errors" screen targets trace returns.`
        : `• **What will break:** Any dependent modules or features importing this file will crash and fail.
• **Which pages stop working:** Core screens and templates relying on this module will stop rendering.
• **Will the project compile:** No, compilation will fail with errors like "Module not found" or "Undefined Import".`
    });

    // 12. Interview Notes
    sections.push({
      title: isHinglish ? "12. Interview Notes & Expected Q&A" : "12. Interview Notes",
      content: isHinglish
        ? `• **Q: Is file ka project architectural setup me primary role kya hai?**
  * **A:** Ye file application configuration properties state declarations or reusable layout widgets component bindings rules control karti hai.
• **Q: Imports resolution parameters kaise behavior control karte hain?**
  * **A:** Modules clean decouple rules follow references imports optimize components state code size trace update logic load parameters.`
        : `• **Q: What is the primary role of this file in the project structure?**
  * **A:** This file manages application configuration properties, state declarations, or reusable layout component bindings.
• **Q: How does proper imports resolution optimize execution?**
  * **A:** Decouples codebase files, optimizes build size, and references packages cleanly for component state updates.`
    });

    // 13. Key Takeaways
    sections.push({
      title: "13. Key Takeaways",
      content: isHinglish
        ? `1. Codebase clarity maintain modules helper templates functions decouple karti hai.
2. Type check parameters TypeScript variables code accuracy double ensure parameters.
3. Clean configuration keys environment changes adapt logic settings.
4. Project modules workflow execution chain properly maps structure layout dependencies.`
        : `1. Decouples helper functions to maintain codebase modularity and clarity.
2. Uses TypeScript type-checking to ensure variable consistency and data safety.
3. Adapts key configurations dynamically to environment setups.
4. Maps structural file flows to execution workflows cleanly.`
    });

    return sections;
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Database models aur connection connection logic define karna." : "Define database models and connection logic."}
                      </p>
                      <div className="mt-2 grid md:grid-cols-2 gap-4">
                        <div className="font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1">
                          <span className="text-zinc-800 font-bold">Database Files:</span>
                          {dbFiles.map(df => <div key={df} className="pl-2">📄 {df}</div>)}
                        </div>
                        <div className="text-xs text-zinc-600 space-y-1.5 flex flex-col justify-center">
                          <div>
                            {isHinglish ? "• Connection clients create kiye gaye aur credentials hook kiye gaye." : "• Connection clients created and database credentials loaded/hooked."}
                          </div>
                          <div>
                            {isHinglish ? "• Schema tables relational schema and columns structural mapping load hui." : "• Schema tables, relational structure and column mappings initialized."}
                          </div>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Business functions, modules utilities, middleware hooks aur calculations." : "Business functions, utility modules, helper algorithms, and calculation utilities."}
                      </p>
                      <div className="mt-2 grid md:grid-cols-2 gap-4">
                        <div className="font-mono text-[10px] bg-zinc-50 p-2 rounded border border-zinc-150 space-y-1 max-h-[250px] overflow-y-auto">
                          <span className="text-zinc-800 font-bold">Logic Files:</span>
                          {coreFiles.map(cf => <div key={cf} className="pl-2">📄 {cf}</div>)}
                        </div>
                        <div className="text-xs text-zinc-600 space-y-1.5 flex flex-col justify-center">
                          <div>
                            {isHinglish ? "• Custom core algorithms, helper utils files aur logic definitions register hue." : "• Custom core algorithms, helper utilities, and backend logic definitions registered."}
                          </div>
                          <div>
                            {isHinglish ? "• Internal processing layers integrate aur test kiye gaye." : "• Internal processing and validation layers integrated and verified."}
                          </div>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "API request routes setup karna backend database connectivity ke sath." : "Set up API routes and server endpoints connected to the database."}
                      </p>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Universal layouts components, navbar header headers aur main structure templates." : "Universal layouts, base app components, navigation header, and main structure templates."}
                      </p>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Isolate UI features, reusable modals, buttons aur display tables." : "Isolated user interface features, reusable modals, buttons, forms, and display tables."}
                      </p>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Specific pages views folder structure aur global context providers state." : "Specific page views and layouts, folders structure, and global state providers."}
                      </p>
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isHinglish ? "Images, SVGs assets files aur base CSS styling rules sets." : "Images, SVGs, static asset files, and base CSS/styling rules."}
                      </p>
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
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isHinglish ? "Code compression bundles assets dynamic integration aur final verification steps." : "Code bundling, asset optimization, styling cleanup, and deployment configurations."}
                    </p>
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
                  {isHinglish
                    ? "* Ye order source tree key hierarchy aur files metadata structure ke basis par compile-time reconstruct kiya gaya hai."
                    : "* This logical build sequence is reconstructed based on source code imports tree, configuration files, and project folder metadata."}
                </div>

              </div>
            </Reveal>
          </section>
        );
      })()}

  {/* Dynamic File Explainer Modal */}
  {selectedFile && (() => {
    const sections = getFileDetailedExplanation(selectedFile);
    const filename = selectedFile.split("/").pop() || selectedFile;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
        <div className="glass-card w-full max-w-4xl bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-750 transition-colors cursor-pointer border-0 bg-transparent text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Header */}
          <div className="flex items-start gap-3 mb-4 shrink-0">
            <span className="text-2xl mt-1">📄</span>
            <div>
              <h3 className="text-sm sm:text-lg font-extrabold text-zinc-950 font-mono truncate pr-8 sm:pr-0" title={filename}>
                {filename}
              </h3>
              <code className="text-[9px] sm:text-[10px] text-zinc-400 block break-all font-mono mt-0.5">
                {selectedFile}
              </code>
            </div>
          </div>

          {/* Tabs / Badges */}
          <div className="flex flex-wrap gap-2 mb-4 shrink-0">
            <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-[10px] font-bold text-cyan-700">
              {selectedFile.split(".").pop()?.toUpperCase()} File
            </span>
            <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[10px] font-bold text-zinc-650">
              Detailed Code Explainer
            </span>
          </div>

          {/* Content sections layout with two panels: Sidebar Index & Content */}
          <div className="flex gap-6 overflow-hidden flex-1 min-h-0">
            {/* Left Sidebar Table of Contents */}
            <div className="hidden md:block w-64 border-r border-zinc-200 pr-4 overflow-y-auto shrink-0 space-y-1.5 py-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Sections Index</div>
              {sections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById(`sec-${idx}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950 transition-colors truncate block"
                >
                  {sec.title}
                </button>
              ))}
            </div>

            {/* Right Scrollable Content panel */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth py-1">
              {sections.map((sec, idx) => (
                <div id={`sec-${idx}`} key={idx} className="bg-zinc-50/50 p-5 rounded-xl border border-zinc-150 shadow-sm transition hover:shadow-md">
                  <h4 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200">
                    {sec.title}
                  </h4>
                  <div className="text-xs text-zinc-750 leading-relaxed font-sans whitespace-pre-wrap">
                    {sec.content.split("\n").map((line, lineIdx) => {
                      if (line.trim().startsWith("```")) return null;
                      if (line.startsWith("• ")) {
                        return (
                          <div key={lineIdx} className="flex gap-2 items-start mt-1.5">
                            <span className="text-cyan-600 font-bold shrink-0">•</span>
                            <span><Rich text={line.slice(2)} /></span>
                          </div>
                        );
                      }
                      if (line.startsWith("✓ ")) {
                        return (
                          <div key={lineIdx} className="flex gap-2 items-start mt-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span><Rich text={line.slice(2)} /></span>
                          </div>
                        );
                      }
                      if (line.startsWith("  * ") || line.startsWith("  • ")) {
                        return (
                          <div key={lineIdx} className="flex gap-2 items-start mt-1 pl-4">
                            <span className="text-zinc-400 font-bold shrink-0">◦</span>
                            <span><Rich text={line.slice(4)} /></span>
                          </div>
                        );
                      }
                      if (line.trim() === "") {
                        return <div key={lineIdx} className="h-2" />;
                      }
                      if (line.includes("→") || line.includes("↓") || line.includes("▼") || line.startsWith(" ") || line.startsWith("📄") || line.startsWith("✓")) {
                        return (
                          <div key={lineIdx} className="font-mono text-[11px] bg-zinc-900 text-cyan-400 px-3 py-2 rounded-lg my-2 overflow-x-auto whitespace-pre border border-zinc-800">
                            {line.replace(/`/g, "")}
                          </div>
                        );
                      }
                      return (
                        <p key={lineIdx} className="mt-1">
                          <Rich text={line} />
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer action */}
          <div className="border-t border-zinc-100 pt-4 mt-4 flex justify-end shrink-0">
            <button
              onClick={() => setSelectedFile(null)}
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer border-0 transition-colors"
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
