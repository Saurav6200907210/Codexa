import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import DataFlowAnimation from "./DataFlowAnimation";
import TechMarquee from "./TechMarquee";
import InteractiveExplorer from "./InteractiveExplorer";
import Footer from "./Footer";
import { 
  ArrowRight, Search, Key, Layers, Map, Database, Github, ChevronDown, CheckCircle2, ShieldCheck, Terminal
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
  onNavigate: (page: "landing" | "analysis" | "architecture" | "file-info") => void;
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
  {
    q: "Kaise pata chalega ki tech stack kaunsa hai?",
    a: "Codexa package.json, requirements.txt, go.mod, Dockerfile, etc. ko automatically parse karke full technology map generate karta hai.",
  },
];

const TYPING_EXAMPLES = [
  "https://github.com/vercel/next.js",
  "https://github.com/facebook/react",
  "https://github.com/kubernetes/kubernetes",
];

export default function LandingPage({ recent, onSetAnalysis, onNavigate }: LandingPageProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Animated Repository URL Typing effect placeholder
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typing animation effect loop
  useEffect(() => {
    const currentFullText = TYPING_EXAMPLES[typingIndex];
    let timer: any;

    if (!isDeleting && charIndex < currentFullText.length) {
      timer = setTimeout(() => {
        setTypedPlaceholder(currentFullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 70);
    } else if (!isDeleting && charIndex === currentFullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setTypedPlaceholder(currentFullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % TYPING_EXAMPLES.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex]);

  const LOADING_STEPS = [
    { label: "Paste GitHub URL", status: "done" },
    { label: "Analyzing Repository Structure...", status: "active" },
    { label: "Reading Folder & Module Layout...", status: "pending" },
    { label: "Detecting Tech Stack & Dependencies...", status: "pending" },
    { label: "Generating Hinglish Architecture Map...", status: "pending" },
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
    const activeUrl = (targetUrl ?? url ?? typedPlaceholder).trim();
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#FAFBFC] overflow-hidden text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Grid & Dots Overlay */}
      <div className="tech-grid" />
      <div className="tech-dots" />

      {/* Mouse Spotlight Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 radial-spotlight"
        style={{
          "--x": `${mousePos.x}px`,
          "--y": `${mousePos.y}px`,
        } as React.CSSProperties}
      />

      <Navbar onNavigate={onNavigate} currentPage="landing" />

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div
          className="lg:col-span-7 space-y-7"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Trust Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-800 text-xs font-semibold shadow-2xs font-mono"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Built for Engineers & Software Teams</span>
          </motion.div>

          {/* Headline - 72px Bold */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-gray-950 font-sans"
          >
            Understand Any <br />
            <span className="text-blue-600">Repository</span> <br />
            in Minutes.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-normal"
          >
            Paste any public GitHub repository URL, and watch Codexa extract folder maps, AST structures, database relations, and setup guides—all in easy Hinglish.
          </motion.p>

          {/* GitHub Input & CTA buttons */}
          <motion.div variants={fadeInUp} className="max-w-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-0">
                <Search className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder={typedPlaceholder || "https://github.com/owner/repository"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="bg-transparent border-0 outline-none text-gray-900 text-sm w-full placeholder:text-gray-400 font-mono"
                />
              </div>
              <button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="btn-github-primary px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border-0 shrink-0"
              >
                <span>Explain Repository</span>
                <ArrowRight className="w-4 h-4 arrow-icon" />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500 font-mono">
              <span className="font-semibold text-gray-700">Supports:</span>
              <span>React • Next.js • Node.js • Python • Go • Java</span>
            </div>

            {/* Recently Analyzed Quick Chips */}
            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 pt-1">
                <span className="font-semibold">Recent:</span>
                {recent.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleAnalyze(`https://github.com/${r.fullName}`)}
                    className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold px-2.5 py-1 rounded-lg transition-colors text-[11px] cursor-pointer"
                  >
                    {r.fullName}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Right side REAL architecture visualization */}
        <motion.div
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <DataFlowAnimation loading={loading} loadingStep={loadingStep} url={url} />
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-y border-gray-200/80 bg-white z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-mono">100K+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Repositories Explained</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono">25+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Frameworks Supported</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">95%</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Analysis Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-mono">60 sec</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Average Analysis Time</div>
          </div>
        </div>
      </section>

      {/* Tech Stack Chips Marquee */}
      <TechMarquee />

      {/* How it Works Timeline Section (6 Steps) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 space-y-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold tracking-wider uppercase font-mono">
            ENGINE TIMELINE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            How Codexa Works
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            A 6-step developer intelligence pipeline processing repository AST trees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
          {[
            { step: "1", title: "Repository URL", desc: "Paste any public repo link." },
            { step: "2", title: "Repository Scan", desc: "Tree metadata fetched." },
            { step: "3", title: "AI Processing", desc: "AST & Heuristics parsed." },
            { step: "4", title: "Architecture", desc: "Dependency graphs mapped." },
            { step: "5", title: "Documentation", desc: "Hinglish summaries built." },
            { step: "6", title: "Export", desc: "Download PDF/Markdown." },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="dev-card p-5 space-y-3 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-md bg-gray-900 text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  {item.step}
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-950">{item.title}</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Section Cards */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 relative z-10 border-t border-gray-200/80">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 space-y-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold tracking-wider uppercase font-mono">
            DEVELOPER FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            Built for Modern Developers
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Everything you need to understand open-source codebases instantly.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-5"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Card 1 - Blue Icon */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-7 dev-card p-7 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Full Folder Breakdown</h3>
              <p className="text-gray-600 text-xs leading-relaxed max-w-md">
                Every directory and file is explained in plain Hinglish, detailing exactly what components, hooks, or backend logic reside inside.
              </p>
            </div>
          </motion.div>

          {/* Card 2 - Green Icon */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-5 dev-card p-7 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Visual Architecture Maps</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Dynamic flow diagrams mapping out frontend views, backend routes, database schema relations, and third-party integrations.
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Orange Icon */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-5 dev-card p-7 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Database Relations</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Automatic detection of ORM schemas (Drizzle, Prisma, Mongoose) mapping database fields and table relationships.
              </p>
            </div>
          </motion.div>

          {/* Card 4 - Red Icon */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-7 dev-card p-7 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Setup & Env Explanations</h3>
              <p className="text-gray-600 text-xs leading-relaxed max-w-md">
                Get step-by-step terminal instructions, environment variable keys, Docker setup, and npm scripts required to run the repo locally.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Code Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-gray-200/80">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 space-y-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold tracking-wider uppercase font-mono">
            CURSOR IDE SANDBOX
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            Explore Repository Tree
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Click files below to inspect real-time AI node explanations.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <InteractiveExplorer />
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 relative z-10 border-t border-gray-200/80">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16 space-y-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="dev-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-xs sm:text-sm text-gray-900 flex justify-between items-center cursor-pointer bg-transparent border-0"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Minimal Compact Developer Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Loading Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-md w-full text-center space-y-6">
              <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center text-white mx-auto shadow-lg">
                <Terminal className="w-7 h-7 animate-pulse" />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                AI Repository Explainer Engine
              </h3>

              <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left font-sans">
                {LOADING_STEPS.map((step, idx) => {
                  const isActive = loadingStep === idx + 1;
                  const isDone = loadingStep > idx + 1;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs transition-all">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full block ${
                            isDone ? "bg-emerald-500" : isActive ? "bg-blue-600 animate-pulse" : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            isDone ? "text-gray-400 line-through" : isActive ? "text-gray-950 font-bold" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-gray-500">
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
