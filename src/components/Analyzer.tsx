"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { AnalysisView } from "./AnalysisView";

interface RecentItem {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
}

const EXAMPLES = [
  "vercel/next.js",
  "facebook/react",
  "expressjs/express",
  "tailwindlabs/tailwindcss",
];

const LOADING_MSGS = [
  "GitHub se repo details laa rahe hain...",
  "Folder structure padh rahe hain...",
  "Framework aur tech stack detect kar rahe hain...",
  "Important files ka code samajh rahe hain...",
  "Beginner-friendly explanation bana rahe hain...",
];

export function Analyzer({ recent }: { recent: RecentItem[] }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function analyze(target?: string) {
    const value = (target ?? url).trim();
    if (!value) {
      setError("Pehle ek GitHub repo URL daalo.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    setMsgIndex(0);
    const timer = setInterval(
      () => setMsgIndex((i) => (i + 1) % LOADING_MSGS.length),
      1300
    );
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kuch galat ho gaya.");
      } else {
        setResult(data.result);
        if (target) setUrl(value);
        setTimeout(
          () => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }
    } catch {
      setError("Network error. Internet check karke dobara try karo.");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300">
          <span className="animate-floaty inline-block">🔎</span> GitHub Repo Explainer for Beginners
        </div>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">
          <span className="gradient-text">Repo</span>
          <span className="text-white">Samjho</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Koi bhi GitHub repo ka URL daalo. Hum poora project samjhaenge —{" "}
          <span className="text-white">kaise kaam karta hai</span>, kaunsa folder kya karta hai,
          aur code kaise flow hota hai. AI se code likhwane wale beginners ke liye perfect. 🚀
        </p>
      </div>

      {/* Input */}
      <div className="mx-auto mt-8 max-w-2xl animate-fade-up" style={{ animationDelay: "120ms" }}>
        <div className="glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="https://github.com/owner/repo"
            className="flex-1 rounded-xl bg-black/30 px-4 py-3 text-white outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-indigo-400"
          />
          <button
            onClick={() => analyze()}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Samjhao ✨"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>Try:</span>
          {EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => analyze(e)}
              disabled={loading}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300 transition hover:border-indigo-400/50 hover:text-white disabled:opacity-50"
            >
              {e}
            </button>
          ))}
        </div>
        {error && (
          <div className="animate-pop mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="mx-auto mt-12 max-w-3xl animate-fade-in">
          <p className="mb-4 text-center text-sm text-indigo-300">{LOADING_MSGS[msgIndex]}</p>
          <div className="space-y-3">
            <div className="skeleton h-24 rounded-2xl" />
            <div className="skeleton h-16 rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-20 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Recent (only when idle) */}
      {!loading && !result && recent.length > 0 && (
        <div className="mx-auto mt-14 max-w-4xl animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
            Recently Analyzed
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((r) => (
              <button
                key={r.id}
                onClick={() => analyze(r.fullName)}
                className="glass rounded-xl p-4 text-left transition hover:border-indigo-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{r.fullName}</span>
                  <span className="text-xs text-yellow-300">⭐ {r.stars.toLocaleString()}</span>
                </div>
                {r.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{r.description}</p>
                )}
                {r.language && (
                  <span className="mt-2 inline-block rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                    {r.language}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div id="result" className="mx-auto mt-16 max-w-5xl">
          <AnalysisView data={result} />
          <div className="mt-16 text-center">
            <button
              onClick={() => {
                setResult(null);
                setUrl("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              ↑ Doosri repo analyze karo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
