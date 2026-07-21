import { Terminal, Github, Linkedin } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: "landing" | "analysis" | "architecture" | "file-info") => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-gray-200/80 py-12 relative z-10 text-center font-sans">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center space-y-6">
        
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate?.("landing")}
          className="flex items-center gap-2 group cursor-pointer bg-transparent border-0 p-0"
        >
          <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors duration-200">
            <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-950">
            Codexa
          </span>
        </button>

        {/* Built By Tag */}
        <div className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-1.5">
          <span>Built by</span>
          <a
            href="https://github.com/Saurav6200907210"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 underline underline-offset-4 decoration-gray-300 hover:decoration-blue-600"
          >
            Saurav Kumar
          </a>
        </div>

        {/* Minimal Social Links */}
        <div className="flex items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-600">
          <a
            href="https://github.com/Saurav6200907210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 hover:scale-105 transition-all duration-200 group"
          >
            <Github className="w-4 h-4 group-hover:text-blue-600 transition-colors duration-200" />
            <span>GitHub</span>
          </a>

          <span className="text-gray-300">•</span>

          <a
            href="https://www.linkedin.com/in/SAURAV-LINKEDIN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 hover:scale-105 transition-all duration-200 group"
          >
            <Linkedin className="w-4 h-4 group-hover:text-blue-600 transition-colors duration-200" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="pt-2 text-xs text-gray-500 font-mono">
          © 2026 Codexa. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
