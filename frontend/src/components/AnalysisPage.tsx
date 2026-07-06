import { useEffect, useState } from "react";
import type { AnalysisResult } from "../types";
import { AnalysisView } from "./AnalysisView";
import Navbar from "./Navbar";
import { 
  ArrowLeft, Download, FileText, BookOpen
} from "lucide-react";

interface AnalysisPageProps {
  data: AnalysisResult | null;
  onNavigate: (page: "landing" | "analysis") => void;
}

export default function AnalysisPage({ data, onNavigate }: AnalysisPageProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const handleExportMarkdown = () => {
    if (!data) return;
    const text = `# Analysis of ${data.repo.fullName}

## Project Overview
${data.summary}

## Tech Stack
${data.techStack.map(t => `- **${t.name}**: ${t.reason}`).join("\n")}

## Workflow
${data.workflow.map(w => `${w.step}. **${w.title}**: ${w.description}`).join("\n")}

## Folders
${data.folders.map(f => `- **${f.path}**: ${f.purpose} (${f.fileCount} files)`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.repo.name}-analysis.md`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  useEffect(() => {
    if (!data) return;
    const sections = ["overview", "summary", "tech-stack", "workflow", "folders", "files", "explorer"];
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
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm glass-card p-6 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm">No analysis result loaded. Please start from the landing page.</p>
          <button
            onClick={() => onNavigate("landing")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 bg-grid-pattern pb-20 relative">
      <Navbar onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <aside className="lg:col-span-3 hidden lg:block space-y-6">
          <div className="sticky top-28 glass-card p-5 rounded-2xl border border-white/5 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Navigation</span>
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
                      ? "bg-indigo-500/10 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <button
                onClick={handleExportMarkdown}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={() => onNavigate("landing")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <span>{data.repo.fullName}</span>
            </div>
          </div>

          <div id="overview" className="scroll-mt-24">
            <AnalysisView data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}
