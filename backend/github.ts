import type { RepoMeta } from "./types.js";

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "repo-explainer-app",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export interface ParsedRepo {
  owner: string;
  repo: string;
}

export function parseRepoUrl(input: string): ParsedRepo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const shorthand = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shorthand) {
    return { owner: shorthand[1], repo: shorthand[2].replace(/\.git$/, "") };
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!url.hostname.includes("github.com")) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const res = await fetch(`${API}/repos/${owner}/${repo}`, {
    headers: headers(),
  });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (res.status === 403) throw new Error("RATE_LIMIT");
  if (!res.ok) throw new Error(`GitHub error: ${res.status}`);
  const d = await res.json();
  return {
    owner: d.owner?.login ?? owner,
    name: d.name,
    fullName: d.full_name,
    description: d.description ?? null,
    stars: d.stargazers_count ?? 0,
    forks: d.forks_count ?? 0,
    language: d.language ?? null,
    defaultBranch: d.default_branch ?? "main",
    url: d.html_url,
    topics: Array.isArray(d.topics) ? d.topics : [],
    license: d.license?.spdx_id ?? null,
  };
}

export interface GitTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string
): Promise<GitTreeItem[]> {
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: headers() }
  );
  if (res.status === 403) throw new Error("RATE_LIMIT");
  if (!res.ok) throw new Error(`GitHub tree error: ${res.status}`);
  const d = await res.json();
  const tree = Array.isArray(d.tree) ? d.tree : [];
  return tree
    .filter((t: any) => t.type === "blob" || t.type === "tree")
    .map((t: any) => ({
      path: t.path,
      type: t.type as "blob" | "tree",
      size: t.size,
    }));
}

export async function fetchRawFile(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
    );
    if (!res.ok) return null;
    const text = await res.text();
    if (text.length > 200_000) return text.slice(0, 200_000);
    return text;
  } catch {
    return null;
  }
}
