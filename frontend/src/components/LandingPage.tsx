import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import FakeIDE from "./FakeIDE";
import TechMarquee from "./TechMarquee";
import InteractiveExplorer from "./InteractiveExplorer";
import { 
  ArrowRight, Search, Key, Cpu, Layers, Map, Database 
} from "lucide-react";
import type { AnalysisResult } from "../types";

interface RecentItem {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
}

interface LandingPageProps {
  recent: RecentItem[];
  onSetAnalysis: (data: AnalysisResult) => void;
  onNavigate: (page: "landing" | "analysis") => void;
}

const FAQ_ITEMS = [
  {
    q: "Kya RepoSamjho private repositories support karta hai?",
    a: "Nahi, abhi hum sirf public GitHub repositories ko support karte hain. Private repositories ka support future update mein aayega.",
  },
  {
    q: "AI analysis mein kitna time lagta hai?",
    a: "Aam taur par 5 se 15 seconds. Agar repo bohot badi hai, toh 20-30 seconds lag sakte hain.",
  },
  {
    q: "Kya hum analysis ko export kar sakte hain?",
    a: "Haan! Aap code summary aur full analysis report ko PDF ya Markdown format mein export kar sakte hain.",
  },
];

export default function LandingPage({ recent, onSetAnalysis, onNavigate }: LandingPageProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const LOADING_STEPS = [
    "Cloning Repository...",
    "Reading Files and Directories...",
    "Understanding Project Architecture...",
    "Generating Beginner-Friendly Hinglish Documentation...",
    "Almost Ready..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAnalyze = async (targetUrl?: string) => {
    const activeUrl = (targetUrl ?? url).trim();
    if (!activeUrl) {
      setError("Please paste a valid GitHub URL first!");
      return;
    }
    setError(null);
    setLoading(true);
    setLoadingStep(0);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: activeUrl }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error ?? "Analysis fail ho gaya.");
        setLoading(false);
      } else {
        onSetAnalysis(data.result);
        onNavigate("analysis");
      }
    } catch (err) {
      setError("Failed to connect to server. Try again.");
      setLoading(false);
    }
  };

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden bg-grid-pattern pb-20">
      <div 
        className="fixed inset-0 pointer-events-none z-0 radial-spotlight"
        style={{
          "--x": `${mousePos.x}px`,
          "--y": `${mousePos.y}px`
        } as React.CSSProperties}
      />

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-aurora pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] animate-aurora pointer-events-none" />

      <Navbar onNavigate={onNavigate} />

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold hover:border-indigo-500/50 transition-colors">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Powered GitHub Explainer</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Understand Any <br />
            <span className="text-gradient">GitHub Repository</span> <br />
            in Minutes.
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            Paste any public GitHub repository URL, and watch RepoSamjho explain code flows, 
            folder layouts, database structures, and setup instructions in simple, beginner-friendly language.
          </p>

          <div className="max-w-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-900/60 border border-white/5 rounded-2xl backdrop-blur-md shadow-2xl">
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder:text-gray-500"
                />
              </div>
              <button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="glow-btn bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform shrink-0"
              >
                <span>Explain Repository</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 pt-2">
                <span>Recently Analyzed:</span>
                {recent.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleAnalyze(`https://github.com/${r.fullName}`)}
                    className="bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {r.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <FakeIDE />
        </div>
      </section>

      <TechMarquee />

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">How RepoSamjho Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Paste URL", desc: "GitHub URL paste karein jisko aap seekhna ya samajhna chahte hain." },
            { step: "02", title: "AI Analysis", desc: "AI repository ki directory, dependency, aur code files ko evaluate karta hai." },
            { step: "03", title: "Diagram Maps", desc: "Architecture diagrams aur dependency flowchart automatically generate hote hain." },
            { step: "04", title: "Learn & Export", desc: "Pure summary to read karein ya use PDF/Markdown file mein export karein." },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 relative border border-white/5 space-y-4">
              <span className="text-4xl font-black text-indigo-500/10 block absolute top-4 right-6">{item.step}</span>
              <h3 className="text-lg font-bold text-white pt-2">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[200px]">
          <div className="md:col-span-7 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white pt-2">Full Folder Breakdown</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Codebase structures analyzed folder-by-folder in plain Hinglish definitions.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:row-span-1 glass-card rounded-2xl p-6 flex items-start gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
              <Map className="w-5 h-5 text-pink-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Architecture Maps</h3>
              <p className="text-gray-400 text-xs">Visual dependencies and graphs mapping code flows.</p>
            </div>
          </div>

          <div className="md:col-span-5 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white pt-2">Database Relations</h3>
              <p className="text-gray-400 text-xs">ORM details (Drizzle, Prisma) maps schema fields.</p>
            </div>
          </div>

          <div className="md:col-span-7 md:row-span-1 glass-card rounded-2xl p-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Setup Instructions</h3>
              <p className="text-gray-400 text-xs">Explains environment configurations and npm scripts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Interactive Repository Explorer</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <InteractiveExplorer />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-sm text-white flex justify-between items-center cursor-pointer bg-transparent border-0"
              >
                <span>{faq.q}</span>
              </button>
              {expandedFaq === idx && (
                <div className="p-5 border-t border-white/5 text-xs text-gray-400 bg-black/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500 animate-spin" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-pulse flex items-center justify-center">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">Analyzing Repository</h3>
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 font-mono text-xs">
              🚀 {LOADING_STEPS[loadingStep]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
