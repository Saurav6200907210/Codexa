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

  useEffect(() => {
    // Fetch recent items from the Express backend
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/recent");
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
        <AnalysisPage data={analysisData} onNavigate={setPage} />
      ) : (
        <ArchitecturePage onNavigate={setPage} />
      )}
    </main>
  );
}
