import type { AnalysisResult } from "../types";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";
import { FileTree } from "./FileTree";

function SectionTitle({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white text-base">
          {n}
        </span>
        <h2 className="text-2xl font-extrabold text-zinc-950">{title}</h2>
      </div>
      <p className="pl-12 text-sm text-zinc-500 font-semibold">{sub}</p>
    </div>
  );
}

export function AnalysisView({ data }: { data: AnalysisResult }) {
  const { repo, stats } = data;
  const maxLang = Math.max(1, ...stats.languages.map((l) => l.count));

  return (
    <div className="space-y-16">
      {/* Repo header */}
      <section id="overview" className="scroll-mt-24">
        <Reveal>
          <div className="glass-card rounded-2xl p-6 sm:p-8 bg-white border border-zinc-200">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl font-extrabold text-zinc-950 hover:text-cyan-600 sm:text-3xl"
                >
                  {repo.fullName} ↗
                </a>
                <p className="mt-2 max-w-2xl text-zinc-600 text-sm leading-relaxed">
                  {repo.description || "Is repo ki koi description available nahi hai."}
                </p>
              </div>
              <span className="rounded-full bg-cyan-50 border border-cyan-200 px-4 py-1.5 text-xs font-bold text-cyan-700">
                {data.projectType}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <Stat type="stars" label="⭐ Stars" value={repo.stars.toLocaleString()} />
              <Stat type="forks" label="🍴 Forks" value={repo.forks.toLocaleString()} />
              <Stat type="files" label="📄 Files" value={stats.totalFiles.toLocaleString()} />
              <Stat type="folders" label="📁 Folders" value={stats.totalFolders.toLocaleString()} />
              {repo.language && <Stat type="language" label="💻 Language" value={repo.language} />}
              {repo.license && <Stat type="license" label="⚖️ License" value={repo.license} />}
            </div>

            {data.techStack.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {data.techStack.map((t) => (
                  <span
                    key={t.name}
                    title={t.reason}
                    className="cursor-help rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 font-bold transition hover:border-cyan-500/30 hover:bg-cyan-50"
                  >
                    {t.emoji} {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* 1. Summary */}
      <section id="summary" className="scroll-mt-24">
        <SectionTitle n="📖" title="Ek Line Mein Summary" sub="Sabse pehle poore project ka overview." />
        <Reveal>
          <div className="glass-card rounded-2xl p-6 text-sm leading-relaxed text-zinc-700 bg-white border border-zinc-200">
            <Rich text={data.summary} />
          </div>
        </Reveal>
      </section>

      {/* 2. Tech stack detail */}
      {data.techStack.length > 0 && (
        <section id="tech-stack" className="scroll-mt-24">
          <SectionTitle n="🧰" title="Tech Stack — Kaunse Tools Use Hue" sub="Har tool kis kaam ke liye laga hai." />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.techStack.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="glass-card flex gap-3 rounded-xl p-4 bg-white border border-zinc-200">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="font-bold text-zinc-950">{t.name}</div>
                    <div className="text-xs text-zinc-500 mt-1">{t.reason}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 3. Workflow timeline */}
      <section id="workflow" className="scroll-mt-24">
        <SectionTitle
          n="🔄"
          title="Workflow — Project Kaise Chalta Hai"
          sub="Step by step: pehle kya hota hai, phir kya. Aise hi request-response flow chalta hai."
        />
        <div className="relative pl-4">
          <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-zinc-200" />
          <div className="space-y-4">
            {data.workflow.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="relative flex gap-4">
                  <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-50 text-xl shadow-sm">
                    {s.emoji}
                  </span>
                  <div className="glass-card flex-1 rounded-xl p-4 bg-white border border-zinc-200">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700">
                        Step {s.step}
                      </span>
                      <h3 className="font-bold text-zinc-900">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
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
      <section id="folders" className="scroll-mt-24">
        <SectionTitle
          n="📁"
          title="Folder by Folder Breakdown"
          sub="Har important folder kya kaam karta hai, logical order mein."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {data.folders.map((f, i) => (
            <Reveal key={f.path} delay={i * 50}>
              <div className="glass-card h-full rounded-xl p-5 bg-white border border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{f.emoji}</span>
                  <code className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    {f.path}/
                  </code>
                  <span className="ml-auto rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-500 font-semibold">
                    {f.fileCount} files
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">{f.purpose}</p>
                {f.sampleFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {f.sampleFiles.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-zinc-600"
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
      <section id="files" className="scroll-mt-24">
        <SectionTitle
          n="🔍"
          title="Important Files — Code Wise Samjho"
          sub="In files ko andar se dekha gaya hai: kya import karti hain, kya banati hain."
        />
        <div className="space-y-4">
          {data.files.map((file, i) => (
            <Reveal key={file.path} delay={i * 40}>
              <div className="glass-card rounded-xl p-5 bg-white border border-zinc-200">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{file.path}</code>
                  <span className="rounded bg-emerald-50 border border-emerald-250 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {file.role}
                  </span>
                  <span className="rounded bg-zinc-50 border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600 font-bold">
                    {file.language}
                  </span>
                </div>
                {file.summary && (
                  <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                    <Rich text={file.summary} />
                  </p>
                )}
                {file.points.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {file.points.map((p, j) => (
                      <li key={j} className="flex gap-2 text-xs text-zinc-600 leading-relaxed">
                        <span className="text-zinc-400">▹</span>
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
      <section id="explorer" className="scroll-mt-24">
        <SectionTitle n="🗂️" title="Poora File Structure" sub="Languages ka mix aur complete folder tree." />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="glass-card rounded-xl p-5 bg-white border border-zinc-200">
              <h3 className="mb-4 font-bold text-zinc-900 text-sm">Languages Mix</h3>
              <div className="space-y-3">
                {stats.languages.length === 0 && (
                  <p className="text-xs text-zinc-500">Koi code language detect nahi hui.</p>
                )}
                {stats.languages.map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-xs text-zinc-600">
                      <span>{l.name}</span>
                      <span>{l.count} files</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-950"
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

function Stat({ label, value, type }: { label: string; value: string; type: string }) {
  let colors = "border-zinc-250 bg-zinc-50 text-zinc-800";
  if (type === "stars") colors = "border-amber-200 bg-amber-50 text-amber-800";
  else if (type === "forks") colors = "border-cyan-200 bg-cyan-50 text-cyan-800";
  else if (type === "files") colors = "border-emerald-200 bg-emerald-50 text-emerald-800";
  else if (type === "folders") colors = "border-blue-200 bg-blue-50 text-blue-800";
  else if (type === "language") colors = "border-purple-200 bg-purple-50 text-purple-800";
  else if (type === "license") colors = "border-pink-200 bg-pink-50 text-pink-800";

  return (
    <span className={`rounded-lg border px-3 py-1 font-bold text-xs ${colors}`}>
      <span>{label}:</span>{" "}
      <span className="font-extrabold">{value}</span>
    </span>
  );
}
