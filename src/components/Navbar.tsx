"use client";

import { useEffect, useState } from "react";
import { Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-4 bg-gray-950/70 border-b border-white/5 backdrop-blur-xl"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Repo<span className="text-gradient">Samjho</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection("demo")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action Button & GitHub */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Saurav6200907210/Codexa"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          <button
            onClick={() => scrollToSection("hero")}
            className="glow-btn bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
