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
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-indigo-400/80">
          Trusted Technologies & Frameworks Supported
        </h3>
      </div>

      <div className="flex overflow-hidden w-full relative">
        <div className="marquee-content gap-4 flex items-center">
          {techList.map((tech, idx) => (
            <div
              key={idx}
              className="px-6 py-3 rounded-2xl glass-card flex items-center justify-center font-semibold text-sm hover:border-pink-500/30 transition-colors duration-300"
            >
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
