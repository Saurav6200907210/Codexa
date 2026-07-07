import { useState, useEffect } from "react";
import { Folder, FolderOpen, FileCode, ChevronRight, Terminal, Info, CornerDownRight } from "lucide-react";

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
    explanation: "Core logic containing all web application assets, styles, database connects, and server endpoints.",
    children: [
      {
        name: "app",
        type: "folder",
        path: "src/app",
        explanation: "Next.js App router directories housing the layout, templates, APIs, and client views.",
        children: [
          {
            name: "api",
            type: "folder",
            path: "src/app/api",
            explanation: "REST framework routing folder containing route.ts backend controllers.",
            children: [
              {
                name: "analyze",
                type: "folder",
                path: "src/app/api/analyze",
                explanation: "Repository analyzer backend parser handler.",
              },
              {
                name: "route.ts",
                type: "file",
                path: "src/app/api/analyze/route.ts",
                explanation: "POST route parser that extracts metadata and invokes Drizzle DB hooks.",
                code: `export async function POST(req: Request) {\n  const { url } = await req.json();\n  // AI analyzes code here...\n  return Response.json({ success: true });\n}`,
              },
            ],
          },
          {
            name: "layout.tsx",
            type: "file",
            path: "src/app/layout.tsx",
            explanation: "Root template file where HTML wrapper, fonts, and global metadata is injected.",
            code: `export default function RootLayout({\n  children,\n}: { children: React.ReactNode }) {\n  return (\n    <html>\n      <body>{children}</body>\n    </html>\n  );\n}`,
          },
        ],
      },
      {
        name: "db",
        type: "folder",
        path: "src/db",
        explanation: "Database schema files, drizzle connectors, and custom migration scripts.",
        children: [
          {
            name: "schema.ts",
            type: "file",
            path: "src/db/schema.ts",
            explanation: "Drizzle definitions detailing table maps, structures, datatypes, and indices.",
            code: `import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";\n\nexport const analyses = pgTable("analyses", {\n  id: serial("id").primaryKey(),\n  repo: text("repo").notNull(),\n});`,
          },
        ],
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    path: "package.json",
    explanation: "Manifest package describing all production/dev dependencies, version tags, and package scripts.",
    code: `{\n  "name": "reposamjho",\n  "dependencies": {\n    "next": "latest",\n    "drizzle-orm": "latest"\n  }\n}`,
  },
];

export default function InteractiveExplorer() {
  const [selectedNode, setSelectedNode] = useState<FileNode>(MOCK_FILES[0]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/app": true,
    "src/app/api": true,
    "src/app/api/analyze": true,
  });

  // Flat list of nodes for auto cycling
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

        // Automatically expand parents of the next selected node
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
    }, 4000);

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
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
            isSelected
              ? "bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500 font-semibold"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {isFolder ? (
            <>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-600" />
              )}
            </>
          ) : (
            <>
              <div className="w-3.5" />
              <FileCode className="w-4 h-4 text-indigo-400" />
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
    <div className="grid grid-cols-12 rounded-2xl border border-white/10 bg-gray-950/80 shadow-2xl backdrop-blur-xl overflow-hidden font-mono min-h-[420px]">
      <div className="col-span-12 md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-white/5 bg-gray-950/40">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-gray-300">EXPLORER</span>
        </div>
        <div className="space-y-0.5 max-h-[350px] overflow-y-auto pr-1">
          {MOCK_FILES.map((node) => renderNode(node))}
        </div>
      </div>

      <div className="col-span-12 md:col-span-7 flex flex-col justify-between bg-black/20 p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Node Explainer</span>
            <span className="text-xs font-bold text-white bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {selectedNode.name}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-pink-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-start gap-2 text-indigo-300">
              <Info className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white block mb-1">AI Explanation (Hinglish):</span>
                {selectedNode.explanation}
              </div>
            </div>
          </div>

          {selectedNode.code && (
            <div className="rounded-xl border border-white/5 bg-black/40 p-4 relative overflow-x-auto max-h-[180px]">
              <pre className="text-[11px] text-gray-300 leading-relaxed font-semibold">
                <code>{selectedNode.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-4">
          <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Autoplay active: Cycles files automatically or click any node to explore.</span>
        </div>
      </div>
    </div>
  );
}
