import { useState } from "react";
import type { TreeNode } from "../types";

function fileEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "🔷";
  if (n.endsWith(".js") || n.endsWith(".jsx") || n.endsWith(".mjs")) return "🟨";
  if (n.endsWith(".json")) return "🧾";
  if (n.endsWith(".md")) return "📝";
  if (n.endsWith(".css") || n.endsWith(".scss")) return "🎨";
  if (n.endsWith(".html")) return "🌐";
  if (n.endsWith(".py")) return "🐍";
  if (n.endsWith(".go")) return "🐹";
  if (n.endsWith(".rs")) return "🦀";
  if (n.endsWith(".vue")) return "💚";
  if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".svg") || n.endsWith(".ico"))
    return "🖼️";
  if (n.startsWith(".env")) return "🔑";
  if (n.includes("dockerfile")) return "🐳";
  return "📄";
}

function Node({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  if (node.type === "file") {
    return (
      <div
        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-zinc-650 hover:bg-zinc-50"
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        <span>{fileEmoji(node.name)}</span>
        <span className="truncate font-mono text-xs text-zinc-700">{node.name}</span>
      </div>
    );
  }
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm font-bold text-zinc-800 hover:bg-zinc-50 cursor-pointer bg-transparent border-0"
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
      >
        <span className={`inline-block text-[10px] text-zinc-400 transition-transform ${open ? "rotate-90" : ""}`}>
          ▶
        </span>
        <span>{open ? "📂" : "📁"}</span>
        <span className="truncate">{node.name}</span>
        <span className="ml-auto text-[10px] text-zinc-400">
          {node.children?.length ?? 0}
        </span>
      </button>
      {open && node.children && (
        <div>
          {node.children.map((child) => (
            <Node key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ tree }: { tree: TreeNode }) {
  return (
    <div className="max-h-[520px] overflow-auto rounded-xl border border-zinc-200 bg-white p-4">
      {tree.children?.map((child) => (
        <Node key={child.path} node={child} depth={0} />
      ))}
    </div>
  );
}
