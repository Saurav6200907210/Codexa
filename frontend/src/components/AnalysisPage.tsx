import { useEffect, useState } from "react";
import type { AnalysisResult } from "../types";
import { AnalysisView } from "./AnalysisView";
import Navbar from "./Navbar";
import { 
  ArrowLeft, Download, FileText, BookOpen
} from "lucide-react";
import { translateToEnglish } from "../lib/translator";

interface AnalysisPageProps {
  data: AnalysisResult | null;
  onNavigate: (page: "landing" | "analysis" | "architecture") => void;
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
}

export default function AnalysisPage({ data, onNavigate, lang, setLang }: AnalysisPageProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const displayData = (data && lang === "en" ? translateToEnglish(data) : data) as AnalysisResult;

  const handleExportMarkdown = () => {
    if (!displayData) return;
    const text = `# Analysis of ${displayData.repo.fullName}

## Project Overview
${displayData.summary}

## Tech Stack
${displayData.techStack.map(t => `- **${t.name}**: ${t.reason}`).join("\n")}

## Workflow
${displayData.workflow.map(w => `${w.step}. **${w.title}**: ${w.description}`).join("\n")}

## Folders
${displayData.folders.map(f => `- **${f.path}**: ${f.purpose} (${f.fileCount} files)`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayData.repo.name}-analysis.md`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  useEffect(() => {
    if (!data) return;
    const sections = ["overview", "summary", "tech-stack", "workflow", "folders", "files", "explorer", "learn-deeply"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

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

  return (
    <div className="min-h-screen bg-white text-zinc-800 pb-20 relative">
      <div className="cyber-grid" />
      <Navbar onNavigate={onNavigate} currentPage="analysis" />

      <div className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <aside className="lg:col-span-3 hidden lg:block space-y-6">
          <div className="sticky top-28 glass-card p-5 rounded-2xl border border-zinc-200 bg-white space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Navigation</span>
            </div>

            <nav className="space-y-1 text-xs">
              {[
                { id: "overview", label: "Overview" },
                { id: "summary", label: "Project Summary" },
                { id: "tech-stack", label: "Tech Stack & Tools" },
                { id: "workflow", label: "Request Workflow" },
                { id: "folders", label: "Folder Structure" },
                { id: "files", label: "Important Code Files" },
                { id: "explorer", label: "Interactive File Tree" },
                { id: "learn-deeply", label: "Learn Deeply" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(item.id);
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-2 bg-transparent border-0 ${
                    activeSection === item.id
                      ? "bg-zinc-950 text-white font-bold"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="border-t border-zinc-100 pt-4 space-y-2">
              <button
                onClick={handleExportMarkdown}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-12">
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 pb-4 gap-4">
            <button
              onClick={() => onNavigate("landing")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer bg-transparent border-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </button>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                    lang === "en"
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 bg-transparent"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("hi")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                    lang === "hi"
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 bg-transparent"
                  }`}
                >
                  Hinglish
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 truncate max-w-[150px] sm:max-w-xs" title={displayData.repo.fullName}>
                <span className="truncate">{displayData.repo.fullName}</span>
              </div>
            </div>
          </div>

          <AnalysisView data={displayData} lang={lang} />
        </main>
      </div>
    </div>
  );
}
