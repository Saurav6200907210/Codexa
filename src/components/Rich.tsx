import { Fragment, type ReactNode } from "react";

/**
 * Tiny renderer that turns **bold** and `code` markers into styled spans.
 * Keeps explanations readable without pulling a full markdown library.
 */
export function Rich({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  // Split on `code` and **bold** while keeping delimiters.
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={i}
          className="rounded bg-indigo-500/15 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    } else {
      nodes.push(<Fragment key={i}>{part}</Fragment>);
    }
  });
  return <>{nodes}</>;
}
