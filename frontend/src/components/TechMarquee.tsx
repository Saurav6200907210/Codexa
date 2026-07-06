const TECHNOLOGIES = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "TypeScript",
  "TailwindCSS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Prisma",
  "Python",
  "Java",
  "Go",
  "Rust",
  "Terraform",
  "AWS",
];

export default function TechMarquee() {
  const techList = [...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <div className="w-full overflow-hidden py-10 bg-black/40 border-y border-white/5 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <h3 className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Trusted Technologies & Frameworks Supported
        </h3>
      </div>

      <div className="flex overflow-hidden w-full relative">
        <div className="marquee-content gap-3 flex items-center">
          {techList.map((tech, idx) => (
            <div
              key={idx}
              className="px-5 py-2 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-md border border-white"
            >
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
