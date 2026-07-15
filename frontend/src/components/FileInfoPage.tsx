import { useState } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, BookOpen, Database, Cpu, Globe, FolderOpen, RefreshCw } from "lucide-react";
import { FileTree } from "./FileTree";
import { Rich } from "./Rich";
import type { AnalysisResult, TreeNode } from "../types";

interface FileInfoPageProps {
  onNavigate: (page: "landing" | "analysis" | "architecture" | "file-info") => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  data: AnalysisResult | null;
}

function buildCustomTree(rootNode: TreeNode): TreeNode {
  const newChildren: TreeNode[] = [];

  // 1. Get all top-level files from the "frontend" directory
  const frontendNode = rootNode.children?.find(c => c.name === "frontend");
  if (frontendNode && frontendNode.children) {
    frontendNode.children.forEach(child => {
      if (child.type === "file") {
        newChildren.push(child);
      }
    });
  }

  // 2. Get the "src" folder from the root
  const srcNode = rootNode.children?.find(c => c.name === "src");
  if (srcNode) {
    newChildren.push(srcNode);
  }

  // 3. Get all top-level files from the root
  rootNode.children?.forEach(child => {
    if (child.type === "file") {
      newChildren.push(child);
    }
  });

  return {
    ...rootNode,
    children: newChildren
  };
}

export default function FileInfoPage({ onNavigate, lang, setLang, data }: FileInfoPageProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const isHinglish = lang === "hi";

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm glass-card p-6 rounded-2xl border border-zinc-200">
          <p className="text-zinc-500 text-sm">No analysis result loaded. Please start from the landing page.</p>
          <button
            onClick={() => onNavigate("landing")}
            className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer border-0"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { repo, stats, projectType } = data;
  const maxLang = Math.max(1, ...stats.languages.map((l) => l.count));

  const getFileDetailedExplanation = (path: string): { title: string; content: string }[] => {
    const filename = path.split("/").pop() || path;
    const nameLower = filename.toLowerCase();
    const pathLower = path.toLowerCase();
    const ext = filename.split(".").pop()?.toUpperCase() || "File";

    let descType = "Source Logic Component";
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

    sections.push({
      title: isHinglish ? "4. Beginner Friendly Explanation (Hindi + English)" : "4. Beginner Friendly Explanation",
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

    return sections;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-800 pb-20 relative">
      <div className="cyber-grid" />
      <Navbar onNavigate={onNavigate} currentPage="file-info" />

      <div className="max-w-6xl mx-auto px-6 pt-28 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 flex-wrap gap-4">
          <div className="space-y-1">
            <button
              onClick={() => onNavigate("analysis")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-0 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Analysis (Overview)</span>
            </button>
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">File Wise Information</h1>
            <p className="text-sm text-zinc-500">
              {isHinglish
                ? "Repository ke files aur folders ka structured analysis aur details."
                : "Structured analysis and details of the repository files and folders."}
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

        {/* Tree and Languages Grid */}
        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Languages Mix */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
              <h3 className="mb-4 font-bold text-zinc-900 text-sm">Languages Mix</h3>
              <div className="space-y-3">
                {stats.languages.length === 0 && (
                  <p className="text-xs text-zinc-500">Koi code language detect nahi hui.</p>
                )}
                {stats.languages.map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-xs text-zinc-650">
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
          </div>

          {/* Interactive File Tree */}
          <div className="lg:col-span-3">
            <FileTree tree={buildCustomTree(data.tree)} onFileClick={setSelectedFile} />
          </div>
        </div>

      </div>

      {/* Explainer Modal */}
      {selectedFile && (() => {
        const sections = getFileDetailedExplanation(selectedFile);
        const filename = selectedFile.split("/").pop() || selectedFile;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity">
            <div className="glass-card w-full max-w-3xl bg-white border border-zinc-200 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
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

              {/* Content panel */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth py-1 min-h-0">
                {sections.map((sec, idx) => (
                  <div key={idx} className="bg-zinc-50/50 p-5 rounded-xl border border-zinc-150 shadow-sm">
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
