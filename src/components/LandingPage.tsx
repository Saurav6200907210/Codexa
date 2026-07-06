"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FakeIDE from "@/components/FakeIDE";
import TechMarquee from "@/components/TechMarquee";
import InteractiveExplorer from "@/components/InteractiveExplorer";
import { 
  ArrowRight, Search, FileCode, CheckCircle, Zap, Shield, FileText, Database, 
  Map, BarChart2, Key, Star, HelpCircle, User, GitBranch, ArrowUpRight, Cpu, Layers
} from "lucide-react";

interface RecentItem {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
}

interface LandingPageProps {
  recent: RecentItem[];
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
  {
    q: "Drizzle config aur schema details kaise build hoti hain?",
    a: "Hum repository ke packages aur configurations scan karte hain, jisse database structures aur code dependencies ka exact path visual ho jata hai.",
  },
];

export default function LandingPage({ recent }: LandingPageProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Spotlight effect variables
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
    "Finalizing visual dependency graph...",
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
        // Cache the analysis result to sessionStorage
        sessionStorage.setItem("repo_analysis", JSON.stringify(data.result));
        // Redirect to analysis page
        router.push("/analysis");
      }
    } catch (err) {
      setError("Failed to connect to server. Try again.");
      setLoading(false);
    }
  };

  // FAQ Expand/Collapse
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden bg-grid-pattern pb-20">
      {/* Background spotlights */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 radial-spotlight"
        style={{
          "--x": `${mousePos.x}px`,
          "--y": `${mousePos.y}px`
        } as React.CSSProperties}
      />

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-aurora pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] animate-aurora pointer-events-none" />

      <Navbar />

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

          {/* Search/Paste form */}
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

            {/* Examples / Quick try */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 pt-1">
              <span>Try:</span>
              {["facebook/react", "expressjs/express", "vercel/next.js"].map((repo) => (
                <button
                  key={repo}
                  onClick={() => handleAnalyze(`https://github.com/${repo}`)}
                  className="bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {repo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fake IDE component right side */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-2xl filter pointer-events-none animate-pulse" />
          <FakeIDE />
        </div>
      </section>

      {/* Tech Marquee */}
      <TechMarquee />

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">How RepoSamjho Works</h2>
          <p className="text-gray-400 text-sm">
            Hum code structure ko scan karke aapke liye simple layout aur summary diagrams build karte hain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Paste URL",
              desc: "GitHub URL paste karein jisko aap seekhna ya samajhna chahte hain.",
            },
            {
              step: "02",
              title: "AI Analysis",
              desc: "AI repository ki directory, dependency, aur code files ko evaluate karta hai.",
            },
            {
              step: "03",
              title: "Diagram Maps",
              desc: "Architecture diagrams aur dependency flowchart automatically generate hote hain.",
            },
            {
              step: "04",
              title: "Learn & Export",
              desc: "Pure summary to read karein ya use PDF/Markdown file mein export karein.",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 relative border border-white/5 space-y-4 hover:-translate-y-1 transition-all duration-300">
              <span className="text-4xl font-black text-indigo-500/10 block absolute top-4 right-6">{item.step}</span>
              <h3 className="text-lg font-bold text-white pt-2">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Bento Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Feature-Rich Repository Analysis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[200px]">
          {/* Card 1 */}
          <div className="md:col-span-7 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white pt-2">Full Folder Breakdown</h3>
              <p className="text-gray-400 text-xs leading-relaxed max-w-md">
                Aapke codebase ka folder structure break down karke simple terminology me definitions clear karega, bina kisi complexity ke.
              </p>
            </div>
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-[10px] text-gray-400 font-mono">
              src/components/ ➔ Reusable button, modal and input modules.
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-5 md:row-span-1 glass-card rounded-2xl p-6 flex items-start gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
              <Map className="w-5 h-5 text-pink-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Architecture Diagrams</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Visual SVGs and interactive graphs mapping how code links together.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-5 md:row-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white pt-2">Database Relations</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                ORM mapping config parsing (Drizzle, Prisma) visually mapping DB architecture and migrations.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-indigo-500/15 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-mono text-indigo-300">drizzle.schema</span>
              <span className="bg-pink-500/15 border border-pink-500/20 px-2 py-1 rounded text-[10px] font-mono text-pink-300">postgres.pool</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-7 md:row-span-1 glass-card rounded-2xl p-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Environment variables & Setup</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Explains required config scripts, .env keys and local execution steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview / Interactive Explorer Section */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-pink-400">Interactive Preview</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Click and Explore Live</h2>
          <p className="text-gray-400 text-xs">
            Interact with the file tree below to see sample file descriptions and code views instantly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <InteractiveExplorer />
        </div>
      </section>

      {/* Comparison Section (README vs RepoSamjho) */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Traditional README vs RepoSamjho</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* README card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-gray-400 text-lg">Boring README</h3>
              <span className="text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded text-[10px] font-bold">Standard</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>❌ Technical jargon without beginner explanations.</li>
              <li>❌ Folder map changes manually and goes out of date.</li>
              <li>❌ No visual dependency or data-flow map.</li>
              <li>❌ Hard to find where code executions start.</li>
            </ul>
          </div>

          {/* RepoSamjho card */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 space-y-4 shadow-xl shadow-indigo-500/5">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h3 className="font-bold text-white text-lg">RepoSamjho AI</h3>
              <span className="text-indigo-400 bg-indigo-400/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">AI Active</span>
            </div>
            <ul className="space-y-2 text-xs text-indigo-200">
              <li className="flex items-center gap-2">✅ Simple Hinglish summaries for beginners.</li>
              <li className="flex items-center gap-2">✅ Live parsed interactive folder trees.</li>
              <li className="flex items-center gap-2">✅ Dynamic graphs showing database connections.</li>
              <li className="flex items-center gap-2">✅ Exportable PDF/Markdown templates.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Loved by Developers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Saurav Kumar",
              role: "Junior React Dev",
              quote: "Mujhe GitHub code structure samajhne mein hours lagte the, ab sirf URL paste karke immediate details mil jate hain.",
            },
            {
              name: "Priya Sharma",
              role: "Fullstack Intern",
              quote: "Drizzle migrations aur schemas ka visualization is next level. Saved my onboarding time!",
            },
            {
              name: "Amit Patel",
              role: "Computer Science Student",
              quote: "Awwwards-worthy design and simple language explanations. It helps me study complex open source libraries.",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <p className="text-gray-300 text-xs italic">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <span className="text-[10px] text-gray-500">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-sm text-white flex justify-between items-center cursor-pointer"
              >
                <span>{faq.q}</span>
                <HelpCircle className="w-5 h-5 text-gray-500" />
              </button>
              {expandedFaq === idx && (
                <div className="p-5 border-t border-white/5 text-xs text-gray-400 leading-relaxed bg-black/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="glass-card rounded-3xl p-10 md:p-16 border border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Ready to Understand Any <br />
            GitHub Repository?
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Paste the URL below and let our AI compile comprehensive folder reports instantly.
          </p>
          
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              document.querySelector("input")?.focus();
            }}
            className="glow-btn bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-xl text-sm"
          >
            <span>Start Analyzing Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Full-Screen Loading Screen Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-2xl flex flex-col items-center justify-center z-50 animate-fade-in p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Spinning AI Sphere Loader */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-indigo-400/20" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-pulse flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Analyzing Repository</h3>
              <p className="text-xs text-gray-500">This takes just a few seconds. Do not refresh.</p>
            </div>

            {/* Current Loading Step */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 font-mono text-xs">
              🚀 {LOADING_STEPS[loadingStep]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
