import { useState, useEffect } from "react";
import { Folder, FolderOpen, FileCode, ChevronRight, Terminal, Info, CornerDownRight, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  explanation: string;
  code?: string;
  children?: FileNode[];
}

const MOCK_FILES: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    explanation: "Core codebase directory containing App Router files, Drizzle connectors, and API routes.",
    children: [
      {
        name: "app",
        type: "folder",
        path: "src/app",
        explanation: "Next.js App router containing server layout views and backend API routes.",
        children: [
          {
            name: "api",
            type: "folder",
            path: "src/app/api",
            explanation: "REST endpoint controller folder handling GitHub tree scanning.",
            children: [
              {
                name: "route.ts",
                type: "file",
                path: "src/app/api/analyze/route.ts",
                explanation: "POST route handler executing GitHub API parsing and Gemini AI heuristic logic.",
                code: `export async function POST(req: Request) {\n  const { url } = await req.json();\n  const tree = await fetchGitHubTree(url);\n  const analysis = await gemini.analyze(tree);\n  return Response.json({ success: true, result: analysis });\n}`,
              },
            ],
          },
          {
            name: "layout.tsx",
            type: "file",
            path: "src/app/layout.tsx",
            explanation: "Root HTML structure wrapper injecting global metadata, styles, and providers.",
            code: `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body className="antialiased">{children}</body>\n    </html>\n  );\n}`,
          },
        ],
      },
      {
        name: "db",
        type: "folder",
        path: "src/db",
        explanation: "Database schema mappings and Drizzle ORM PostgreSQL configuration.",
        children: [
          {
            name: "schema.ts",
            type: "file",
            path: "src/db/schema.ts",
            explanation: "Drizzle table schema definition for persistent analysis records.",
            code: `import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";\n\nexport const analyses = pgTable("analyses", {\n  id: serial("id").primaryKey(),\n  fullName: text("full_name").notNull(),\n  summary: text("summary"),\n  createdAt: timestamp("created_at").defaultNow(),\n});`,
          },
        ],
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    path: "package.json",
    explanation: "Project manifest detailing dependencies, version tags, and build scripts.",
    code: `{\n  "name": "codexa",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  }\n}`,
  },
];

export default function InteractiveExplorer() {
  const [selectedNode, setSelectedNode] = useState<FileNode>(MOCK_FILES[0]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/app": true,
    "src/app/api": true,
  });

  const getFlatNodes = (nodes: FileNode[]): FileNode[] => {
    const list: FileNode[] = [];
    const traverse = (n: FileNode) => {
      list.push(n);
      if (n.children) n.children.forEach(traverse);
    };
    nodes.forEach(traverse);
    return list;
  };

  const flatNodes = getFlatNodes(MOCK_FILES);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedNode((current) => {
        const idx = flatNodes.findIndex((n) => n.path === current.path);
        const nextIdx = (idx + 1) % flatNodes.length;
        const nextNode = flatNodes[nextIdx];

        const parts = nextNode.path.split("/");
        if (parts.length > 1) {
          const parentPaths: Record<string, boolean> = {};
          let currentPath = "";
          for (let i = 0; i < parts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
            parentPaths[currentPath] = true;
          }
          setExpandedFolders((prev) => ({ ...prev, ...parentPaths }));
        }

        return nextNode;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedNode.path === node.path;

    return (
      <div key={node.path} className="select-none">
        <div
          onClick={() => {
            setSelectedNode(node);
            if (isFolder) toggleFolder(node.path);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center gap-2 py-1.5 px-2.5 rounded cursor-pointer transition-all text-xs font-mono ${
            isSelected
              ? "bg-blue-600 text-white font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          {isFolder ? (
            <>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-90 text-gray-300" : "text-gray-500"
                }`}
              />
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-gray-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-3.5" />
              <FileCode className="w-4 h-4 text-blue-400" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>

        {isFolder && isExpanded && node.children && (
          <div className="mt-0.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#0D1117] shadow-xl overflow-hidden font-mono min-h-[440px] text-gray-200">
      {/* VS Code / Cursor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Cursor IDE Interactive Sandbox</span>
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-12 min-h-[380px]">
        {/* Left Explorer */}
        <div className="col-span-12 md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-gray-800 bg-[#0D1117]/80">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2.5 mb-3">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              FILES EXPLORER
            </span>
          </div>
          <div className="space-y-0.5 max-h-[320px] overflow-y-auto pr-1">
            {MOCK_FILES.map((node) => renderNode(node))}
          </div>
        </div>

        {/* Right Code Area */}
        <div className="col-span-12 md:col-span-8 flex flex-col justify-between p-5 bg-[#0D1117]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Path: <span className="text-white font-mono">{selectedNode.path}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {selectedNode.type}
                </span>
              </div>

              {/* AI Explanation Box */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5">
                <div className="flex items-start gap-2.5 text-blue-300">
                  <Info className="w-4.5 h-4.5 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block mb-1">
                      AI Explanation (Hinglish):
                    </span>
                    <p className="text-gray-300 font-sans leading-relaxed">
                      {selectedNode.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              {selectedNode.code && (
                <div className="rounded-xl border border-gray-800 bg-black/60 p-3.5 relative overflow-x-auto max-h-[190px]">
                  <pre className="text-xs text-gray-300 leading-relaxed font-mono">
                    <code>{selectedNode.code}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-800">
            <CornerDownRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Autoplay Active • Select any file to inspect details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
