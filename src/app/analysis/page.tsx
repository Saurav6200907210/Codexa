"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { AnalysisResult } from "@/lib/types";
import { AnalysisView } from "@/components/AnalysisView";
import Navbar from "@/components/Navbar";
import { 
  ArrowLeft, Download, FileText, LayoutDashboard, Cpu, GitFork, 
  Terminal, Database, HelpCircle, List, Loader2, Sparkles, BookOpen
} from "lucide-react";
import Link from "next/link";

function AnalysisPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("url");

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const fetchAnalysis = async () => {
      // 1. First, check if there's pre-loaded data in sessionStorage
      const cached = sessionStorage.getItem("repo_analysis");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Verify it matches the URL if URL is provided
          if (!repoUrl || parsed.repo.url.toLowerCase().includes(repoUrl.toLowerCase()) || repoUrl.toLowerCase().includes(parsed.repo.fullName.toLowerCase())) {
            setData(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          sessionStorage.removeItem("repo_analysis");
        }
      }

      // 2. Fetch analysis dynamically if not cached or URL doesn't match
      if (!repoUrl) {
        setError("Repository URL is required. Please go back to the home page.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: repoUrl }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Failed to analyze repository.");
        } else {
          setData(json.result);
          sessionStorage.setItem("repo_analysis", JSON.stringify(json.result));
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [repoUrl]);

  // Export functions
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
    // Print triggers standard browser print to PDF
    window.print();
  };

  // Sticky scroll section spy
  useEffect(() => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
          <h3 className="text-xl font-bold text-white">Analyzing Repository...</h3>
          <p className="text-xs text-gray-500">Scanning structures and mapping dependencies. This will take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-md glass-card p-8 rounded-2xl border border-red-500/20">
          <h3 className="text-xl font-bold text-red-400">Error Occurred</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 bg-grid-pattern pb-20 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Sidebar Nav */}
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
                  className={`w-full text-left py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    activeSection === item.id
                      ? "bg-indigo-500/10 text-indigo-300 font-semibold border-l-2 border-indigo-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Export options */}
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
                <span>Export PDF / Print</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-12">
          {/* Header section with back btn */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <span>{data.repo.fullName}</span>
            </div>
          </div>

          <div id="overview" className="scroll-mt-24">
            {/* Overview / Header Stats */}
            <AnalysisView data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
      </div>
    }>
      <AnalysisPageContent />
    </Suspense>
  );
}
