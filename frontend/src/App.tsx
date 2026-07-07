import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AnalysisPage from "./components/AnalysisPage";
import ArchitecturePage from "./components/ArchitecturePage";
import type { AnalysisResult } from "./types";

interface RecentItem {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
}

export default function App() {
  const [page, setPage] = useState<"landing" | "analysis" | "architecture">("landing");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
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

  return (
    <main className="min-h-screen bg-gray-950 text-gray-150">
      {page === "landing" ? (
        <LandingPage
          recent={recent}
          onSetAnalysis={setAnalysisData}
          onNavigate={setPage}
        />
      ) : page === "analysis" ? (
        <AnalysisPage data={analysisData} onNavigate={setPage} lang={lang} setLang={setLang} />
      ) : (
        <ArchitecturePage onNavigate={setPage} lang={lang} setLang={setLang} data={analysisData} />
      )}
    </main>
  );
}
