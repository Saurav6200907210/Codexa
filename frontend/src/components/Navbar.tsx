import { useEffect, useState } from "react";
import { ArrowRight, Terminal, Github } from "lucide-react";

interface NavbarProps {
  onNavigate?: (page: "landing" | "analysis" | "architecture" | "file-info") => void;
  currentPage?: "landing" | "analysis" | "architecture" | "file-info";
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
    if (onNavigate && currentPage === "landing") {
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3.5 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate?.("landing")}
          className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-0 text-left p-0"
        >
          <div className="w-8 h-8 rounded-md bg-gray-900 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
            <Terminal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-gray-900 font-sans">
              Codexa
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gray-100 text-gray-600 border border-gray-200 font-mono">
              v1.0
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          {currentPage !== "landing" && (
            <>
              <button
                onClick={() => onNavigate?.("architecture")}
                className={`transition-colors cursor-pointer bg-transparent border-0 flex items-center gap-1.5 ${
                  currentPage === "architecture"
                    ? "text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5"
                    : "hover:text-gray-900"
                }`}
              >
                <span>⚙️ App Flow Architecture</span>
              </button>
              <button
                onClick={() => onNavigate?.("file-info")}
                className={`transition-colors cursor-pointer bg-transparent border-0 flex items-center gap-1.5 ${
                  currentPage === "file-info"
                    ? "text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5"
                    : "hover:text-gray-900"
                }`}
              >
                <span>📁 File Wise Information</span>
              </button>
            </>
          )}

          {currentPage === "landing" && (
            <>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 relative group py-1"
              >
                <span>Features</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-200" />
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 relative group py-1"
              >
                <span>How it Works</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-200" />
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 relative group py-1"
              >
                <span>Demo</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-200" />
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-0 relative group py-1"
              >
                <span>FAQ</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-200" />
              </button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {currentPage !== "landing" && (
            <>
              <button
                onClick={() => onNavigate?.("architecture")}
                className={`md:hidden transition-colors cursor-pointer bg-transparent border-0 text-xs font-semibold ${
                  currentPage === "architecture" ? "text-gray-900 font-bold" : "text-gray-600"
                }`}
              >
                ⚙️ Flow
              </button>
              <button
                onClick={() => onNavigate?.("file-info")}
                className={`md:hidden transition-colors cursor-pointer bg-transparent border-0 text-xs font-semibold ${
                  currentPage === "file-info" ? "text-gray-900 font-bold" : "text-gray-600"
                }`}
              >
                📁 Files
              </button>
            </>
          )}

          <a
            href="https://github.com/Saurav6200907210/Codexa.git"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 hover:text-gray-900 shadow-xs"
          >
            <Github className="w-4 h-4" />
          </a>

          {currentPage === "landing" && (
            <button
              onClick={() => scrollToSection("hero")}
              className="btn-github-primary px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer border-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 arrow-icon transition-transform duration-200" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
