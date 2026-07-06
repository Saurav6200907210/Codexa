"use client";

import type { AnalysisResult } from "@/lib/types";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";
import { FileTree } from "./FileTree";

function SectionTitle({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-lg">
          {n}
        </span>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="pl-12 text-sm text-slate-400">{sub}</p>
    </div>
  );
}

export function AnalysisView({ data }: { data: AnalysisResult }) {
  const { repo, stats } = data;
  const maxLang = Math.max(1, ...stats.languages.map((l) => l.count));

  return (
    <div className="space-y-16">
      {/* Repo header */}
      <Reveal>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="text-2xl font-bold text-white hover:text-indigo-300 sm:text-3xl"
              >
                {repo.fullName} ↗
              </a>
              <p className="mt-2 max-w-2xl text-slate-300">
                {repo.description || "Is repo ki koi description available nahi hai."}
              </p>
            </div>
            <span className="rounded-full bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-200">
              {data.projectType}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Stat label="⭐ Stars" value={repo.stars.toLocaleString()} />
            <Stat label="🍴 Forks" value={repo.forks.toLocaleString()} />
            <Stat label="📄 Files" value={stats.totalFiles.toLocaleString()} />
            <Stat label="📁 Folders" value={stats.totalFolders.toLocaleString()} />
            {repo.language && <Stat label="💻 Language" value={repo.language} />}
            {repo.license && <Stat label="⚖️ License" value={repo.license} />}
          </div>

          {data.techStack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.techStack.map((t) => (
                <span
                  key={t.name}
                  title={t.reason}
                  className="cursor-help rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-indigo-400/50 hover:bg-indigo-500/10"
                >
                  {t.emoji} {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* 1. Summary */}
      <section>
        <SectionTitle n="📖" title="Ek Line Mein Summary" sub="Sabse pehle poore project ka overview." />
        <Reveal>
          <div className="glass rounded-2xl p-6 text-lg leading-relaxed text-slate-200">
            <Rich text={data.summary} />
          </div>
        </Reveal>
      </section>

      {/* 2. Tech stack detail */}
      {data.techStack.length > 0 && (
        <section>
          <SectionTitle n="🧰" title="Tech Stack — Kaunse Tools Use Hue" sub="Har tool kis kaam ke liye laga hai." />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.techStack.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="glass flex gap-3 rounded-xl p-4">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.reason}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 3. Workflow timeline */}
      <section>
        <SectionTitle
          n="🔄"
          title="Workflow — Project Kaise Chalta Hai"
          sub="Step by step: pehle kya hota hai, phir kya. Aise hi request-response flow chalta hai."
        />
        <div className="relative pl-4">
          <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
          <div className="space-y-4">
            {data.workflow.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="relative flex gap-4">
                  <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-indigo-400/40 bg-slate-900 text-xl shadow-lg">
                    {s.emoji}
                  </span>
                  <div className="glass flex-1 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-200">
                        Step {s.step}
                      </span>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-300">
                      <Rich text={s.description} />
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Folder by folder */}
      <section>
        <SectionTitle
          n="📁"
          title="Folder by Folder Breakdown"
          sub="Har important folder kya kaam karta hai, logical order mein."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {data.folders.map((f, i) => (
            <Reveal key={f.path} delay={i * 50}>
              <div className="glass h-full rounded-xl p-5 transition hover:border-indigo-400/40">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{f.emoji}</span>
                  <code className="font-mono text-sm font-semibold text-indigo-200">
                    {f.path}/
                  </code>
                  <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {f.fileCount} files
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{f.purpose}</p>
                {f.sampleFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.sampleFiles.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-black/30 px-2 py-0.5 font-mono text-[11px] text-slate-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Key files code-wise */}
      <section>
        <SectionTitle
          n="🔍"
          title="Important Files — Code Wise Samjho"
          sub="In files ko andar se dekha gaya hai: kya import karti hain, kya banati hain."
        />
        <div className="space-y-4">
          {data.files.map((file, i) => (
            <Reveal key={file.path} delay={i * 40}>
              <div className="glass rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-sm font-semibold text-pink-200">{file.path}</code>
                  <span className="rounded bg-purple-500/15 px-2 py-0.5 text-xs text-purple-200">
                    {file.role}
                  </span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {file.language}
                  </span>
                </div>
                {file.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    <Rich text={file.summary} />
                  </p>
                )}
                {file.points.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {file.points.map((p, j) => (
                      <li key={j} className="flex gap-2 text-sm text-slate-300">
                        <span className="mt-1 text-indigo-400">▹</span>
                        <span>
                          <Rich text={p} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Languages + tree */}
      <section>
        <SectionTitle n="🗂️" title="Poora File Structure" sub="Languages ka mix aur complete folder tree." />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="glass rounded-xl p-5">
              <h3 className="mb-4 font-semibold text-white">Languages Mix</h3>
              <div className="space-y-3">
                {stats.languages.length === 0 && (
                  <p className="text-sm text-slate-400">Koi code language detect nahi hui.</p>
                )}
                {stats.languages.map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-xs text-slate-300">
                      <span>{l.name}</span>
                      <span>{l.count} files</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"
                        style={{ width: `${(l.count / maxLang) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-3" delay={100}>
            <FileTree tree={data.tree} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">
      <span className="text-slate-400">{label}:</span>{" "}
      <span className="font-semibold text-white">{value}</span>
    </span>
  );
}
