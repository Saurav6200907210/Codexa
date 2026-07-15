import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import DataFlowAnimation from "./DataFlowAnimation";
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
  onNavigate: (page: "landing" | "analysis" | "architecture") => void;
}

const FAQ_ITEMS = [
  {
    q: "Kya Codexa private repositories support karta hai?",
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
    { label: "Paste GitHub URL", status: "done" },
    { label: "Analyzing Repository...", status: "active" },
    { label: "Reading Folder Structure...", status: "pending" },
    { label: "Detecting Tech Stack...", status: "pending" },
    { label: "Generating Architecture...", status: "pending" }
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 1800);
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
    setLoadingStep(1);

    try {
      const rawUrl = import.meta.env.VITE_API_URL || "";
      const baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
      const res = await fetch(`${baseUrl}/api/analyze`, {
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

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-20 selection:bg-cyan-500 selection:text-white">
      {/* Premium background mesh & grids */}
      <div className="cyber-grid" />
      <div className="noise-bg opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0" />

      {/* Mouse spotlight overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 radial-spotlight"
        style={{
          "--x": `${mousePos.x}px`,
          "--y": `${mousePos.y}px`
        } as React.CSSProperties}
      />

      <Navbar onNavigate={onNavigate} currentPage="landing" />

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div 
          className="lg:col-span-7 space-y-6"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50/80 backdrop-blur-md text-zinc-800 text-xs font-semibold shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-zinc-900 animate-pulse" />
            <span>AI-Powered GitHub Explainer</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-zinc-950"
          >
            Understand Any <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-800 to-indigo-600">GitHub Repository</span> <br className="hidden sm:inline" />
            in Minutes.
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xs sm:text-sm md:text-base text-zinc-500 max-w-lg leading-relaxed"
          >
            Paste any public GitHub repository URL, and watch Codexa explain code flows, 
            folder layouts, database structures, and setup instructions in simple, beginner-friendly language.
          </motion.p>

          <motion.div variants={fadeInUp} className="max-w-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white border border-zinc-200 rounded-2xl shadow-lg focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-100 transition-all">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 sm:py-0">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="bg-transparent border-0 outline-none text-zinc-800 text-xs w-full placeholder:text-zinc-400 font-mono"
                />
              </div>
              <button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="glow-btn bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.97] transition-all text-xs border-0 shrink-0"
              >
                <span>Explain Repository</span>
                <ArrowRight className="w-4.5 h-4.5 text-white" />
              </button>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-red-500 bg-red-50/80 backdrop-blur-sm border border-red-100 px-3 py-2.5 rounded-xl flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400 pt-1">
                <span>Recently Analyzed:</span>
                {recent.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleAnalyze(`https://github.com/${r.fullName}`)}
                    className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-800 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer text-[10px] text-zinc-650 font-bold"
                  >
                    {r.fullName}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
        >
          <DataFlowAnimation loading={loading} loadingStep={loadingStep} url={url} />
        </motion.div>
      </section>

      <TechMarquee />

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div 
          className="text-center max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950">How Codexa Works</h2>
          <p className="text-xs text-zinc-400 mt-2">Follow our dynamic 4-step pipeline to extract logical code architecture.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Paste URL", desc: "GitHub URL paste karein jisko aap seekhna ya samajhna chahte hain." },
            { step: "02", title: "AI Analysis", desc: "AI repository ki directory, dependency, aur code files ko evaluate karta hai." },
            { step: "03", title: "Diagram Maps", desc: "Architecture diagrams aur dependency flowchart automatically generate hote hain." },
            { step: "04", title: "Learn & Export", desc: "Pure summary to read karein ya use PDF/Markdown file mein export karein." },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="glass-card rounded-2xl p-6 relative border border-zinc-200 bg-white/70 backdrop-blur-md space-y-4 hover:shadow-lg transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <span className="text-3xl font-black text-zinc-900/5 block absolute top-4 right-6 group-hover:scale-110 transition-transform duration-300">{item.step}</span>
              <h3 className="text-base font-bold text-zinc-900 pt-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-100">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[180px]"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="md:col-span-7 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-zinc-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                <Layers className="w-4.5 h-4.5 text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 pt-1">Full Folder Breakdown</h3>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                Codebase structures analyzed folder-by-folder in plain Hinglish definitions.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="md:col-span-5 md:row-span-1 glass-card rounded-2xl p-6 flex items-start gap-4 border border-zinc-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200 shrink-0">
              <Map className="w-4.5 h-4.5 text-zinc-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Architecture Maps</h3>
              <p className="text-zinc-500 text-xs">Visual dependencies and graphs mapping code flows.</p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="md:col-span-5 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-zinc-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                <Database className="w-4.5 h-4.5 text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 pt-1">Database Relations</h3>
              <p className="text-zinc-500 text-xs">ORM details (Drizzle, Prisma) maps schema fields.</p>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="md:col-span-7 md:row-span-1 glass-card rounded-2xl p-6 flex items-center gap-4 border border-zinc-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200 shrink-0">
              <Key className="w-4.5 h-4.5 text-zinc-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Setup Instructions</h3>
              <p className="text-zinc-500 text-xs">Explains environment configurations and npm scripts.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-100">
        <motion.div 
          className="text-center max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950">Interactive Repository Explorer</h2>
          <p className="text-xs text-zinc-400 mt-2">See how our autosequencing visualizer reads modules dynamically.</p>
        </motion.div>
        <div className="max-w-4xl mx-auto">
          <InteractiveExplorer />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-100">
        <motion.div 
          className="text-center max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-extrabold text-zinc-950">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl border border-zinc-200 overflow-hidden bg-white/50 backdrop-blur-md">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-xs text-zinc-900 flex justify-between items-center cursor-pointer bg-transparent border-0"
              >
                <span>{faq.q}</span>
                <span className={`text-zinc-400 transform transition-transform duration-300 ${expandedFaq === idx ? "rotate-90" : ""}`}>
                  ▶
                </span>
              </button>
              <AnimatePresence initial={false}>
                {expandedFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-zinc-150 text-xs text-zinc-500 bg-zinc-50/50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Stepper Analysis overlay modal */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md w-full text-center space-y-6">
              {/* Spinning AI Orb */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border border-indigo-200/50 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-zinc-950 animate-pulse flex items-center justify-center shadow-lg">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">AI Repository Explainer Engine</h3>
              
              {/* Interactive Checklist steps */}
              <div className="space-y-3 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-left font-sans">
                {LOADING_STEPS.map((step, idx) => {
                  const isActive = loadingStep === idx + 1;
                  const isDone = loadingStep > idx + 1;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full block ${
                          isDone ? "bg-emerald-500" : isActive ? "bg-cyan-500 animate-pulse" : "bg-zinc-300"
                        }`} />
                        <span className={`font-semibold ${
                          isDone ? "text-zinc-500 line-through" : isActive ? "text-zinc-950 font-bold" : "text-zinc-400"
                        }`}>{step.label}</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono">
                        {isDone ? "✓ Done" : isActive ? "Scanning..." : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
