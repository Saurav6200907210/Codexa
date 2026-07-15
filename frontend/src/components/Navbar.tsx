import { useEffect, useState } from "react";
import { Sparkles, Terminal } from "lucide-react";

interface NavbarProps {
  onNavigate?: (page: "landing" | "analysis" | "architecture") => void;
  currentPage?: "landing" | "analysis" | "architecture";
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (onNavigate) {
      onNavigate("landing");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isLanding = currentPage === "landing";
  const showScrolledStyles = scrolled || !isLanding;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:transition-all md:duration-500 bg-white/90 border-b border-zinc-100 backdrop-blur-xl ${
        !showScrolledStyles
          ? "md:bg-transparent md:border-b-0 md:backdrop-blur-none"
          : ""
      } ${
        showScrolledStyles
          ? "md:py-4 md:bg-white/90 md:border-b md:border-zinc-100 md:backdrop-blur-xl"
          : "md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate?.("landing")} className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-0 text-left p-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white font-bold" />
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight text-zinc-950 group-hover:text-zinc-800 transition-colors">
            Repo<span>Samjho</span>
          </span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500">
          {currentPage !== "landing" && (
            <button
              onClick={() => onNavigate?.("architecture")}
              className="hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-0 flex items-center gap-1 font-bold text-indigo-500"
            >
              ⚙️ App Flow Architecture
            </button>
          )}
          {currentPage === "landing" && (
            <>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-0"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-0"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-0"
              >
                Demo
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-0"
              >
                FAQ
              </button>
            </>
          )}
        </div>

        {/* Action Button & GitHub */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentPage !== "landing" && (
            <button
              onClick={() => onNavigate?.("architecture")}
              className="md:hidden hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-0 text-xs font-bold text-indigo-500"
            >
              ⚙️ Flow
            </button>
          )}
          <a
            href="https://github.com/Saurav6200907210/Codexa.git"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-zinc-600 hover:text-zinc-900"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          {currentPage === "landing" && (
            <button
              onClick={() => scrollToSection("hero")}
              className="glow-btn bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1 sm:gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              <span>Get Started</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
