import { motion } from "framer-motion";

const TECH_BADGES = [
  "Docker",
  "Kubernetes",
  "AWS",
  "Terraform",
  "PostgreSQL",
  "Redis",
  "Prisma",
  "Go",
  "Python",
  "Java",
  "React",
  "Next.js",
  "TypeScript",
];

export default function TechMarquee() {
  const list = [...TECH_BADGES, ...TECH_BADGES, ...TECH_BADGES];

  return (
    <div className="w-full py-9 bg-gray-50/80 border-y border-gray-200/80 relative overflow-hidden">
      {/* Side Fade Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFBFC] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFBFC] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
          SUPPORTED ECOSYSTEMS & TOOLS
        </p>
      </div>

      <div className="flex overflow-hidden w-full relative">
        <div className="marquee-content gap-3 flex items-center py-1">
          {list.map((tech, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-xs font-semibold shadow-xs flex items-center gap-2 shrink-0 cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-all font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
