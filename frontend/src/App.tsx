import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AnalysisPage from "./components/AnalysisPage";
import ArchitecturePage from "./components/ArchitecturePage";
import FileInfoPage from "./components/FileInfoPage";
import type { AnalysisResult } from "./types";

interface RecentItem {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
}

export default function App() {
  const [page, setPage] = useState<"landing" | "analysis" | "architecture" | "file-info">(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("reposamjho_page");
      if (savedPage === "landing" || savedPage === "analysis" || savedPage === "architecture" || savedPage === "file-info") {
        return savedPage;
      }
    }
    return "landing";
  });

  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("reposamjho_analysis");
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [lang, setLang] = useState<"en" | "hi">("hi");

  useEffect(() => {
    // Fetch recent items from the Express backend
    const fetchRecent = async () => {
      try {
        const rawUrl = import.meta.env.VITE_API_URL || "";
        const baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
        const res = await fetch(`${baseUrl}/api/recent`);
        if (res.ok) {
          const json = await res.json();
          setRecent(json.recent || []);
        }
      } catch (err) {
        console.error("Failed to load recent list:", err);
      }
    };
    fetchRecent();
  }, [page]);

  const handleNavigate = (newPage: "landing" | "analysis" | "architecture" | "file-info") => {
    setPage(newPage);
    localStorage.setItem("reposamjho_page", newPage);
    if (newPage === "landing") {
      setAnalysisData(null);
      localStorage.removeItem("reposamjho_analysis");
    }
    // Scroll window to top on page change
    window.scrollTo(0, 0);
  };

  const handleSetAnalysis = (data: AnalysisResult) => {
    setAnalysisData(data);
    localStorage.setItem("reposamjho_analysis", JSON.stringify(data));
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-150">
      {page === "landing" ? (
        <LandingPage
          recent={recent}
          onSetAnalysis={handleSetAnalysis}
          onNavigate={handleNavigate}
        />
      ) : page === "analysis" ? (
        <AnalysisPage
          data={analysisData}
          onNavigate={handleNavigate}
          lang={lang}
          setLang={setLang}
        />
      ) : page === "architecture" ? (
        <ArchitecturePage
          onNavigate={handleNavigate}
          lang={lang}
          setLang={setLang}
          data={analysisData}
        />
      ) : (
        <FileInfoPage
          onNavigate={handleNavigate}
          lang={lang}
          setLang={setLang}
          data={analysisData}
        />
      )}
    </main>
  );
}
