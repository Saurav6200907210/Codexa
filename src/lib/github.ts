import type { RepoMeta } from "./types";

const API = "https://api.github.com";
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
const REPO_SEGMENT_RE = /^[A-Za-z0-9_.-]+$/;
const BRANCH_SEGMENT_RE = /^[A-Za-z0-9._/-]+$/;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "repo-explainer-app",
  };
  // Optional token gives higher rate limits. Never hardcode secrets.
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function isValidRepoSegment(v: string): boolean {
  return v.length > 0 && REPO_SEGMENT_RE.test(v);
}

export interface ParsedRepo {
  owner: string;
  repo: string;
}

/** Extract owner/repo from many GitHub URL shapes (or "owner/repo"). */
export function parseRepoUrl(input: string): ParsedRepo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Plain "owner/repo"
  const shorthand = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shorthand) {
    const owner = shorthand[1];
    const repo = shorthand[2].replace(/\.git$/, "");
    if (!isValidRepoSegment(owner) || !isValidRepoSegment(repo)) return null;
    return { owner, repo };
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.toLowerCase();
    if (!GITHUB_HOSTS.has(host)) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    if (!isValidRepoSegment(owner) || !isValidRepoSegment(repo)) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const res = await fetch(`${API}/repos/${owner}/${repo}`, {
    headers: headers(),
    cache: "no-store",
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
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 403) throw new Error("RATE_LIMIT");
  if (!res.ok) throw new Error(`GitHub tree error: ${res.status}`);
  const d = await res.json();
  const tree = Array.isArray(d.tree) ? d.tree : [];
  return tree
    .filter((t: { type: string }) => t.type === "blob" || t.type === "tree")
    .map((t: { path: string; type: string; size?: number }) => ({
      path: t.path,
      type: t.type as "blob" | "tree",
      size: t.size,
    }));
}

/** Fetch a raw text file. Returns null on failure or if too big. */
export async function fetchRawFile(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<string | null> {
  if (!isValidRepoSegment(owner) || !isValidRepoSegment(repo)) return null;
  if (!branch || !BRANCH_SEGMENT_RE.test(branch) || branch.includes("..") || branch.startsWith("/")) return null;
  if (!path || path.includes("..") || path.startsWith("/") || path.includes("\\") || path.includes("//")) return null;

  const encodedPath = path
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
  if (!encodedPath) return null;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${encodedPath}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const text = await res.text();
    // Skip huge files to stay fast.
    if (text.length > 200_000) return text.slice(0, 200_000);
    return text;
  } catch {
    return null;
  }
}
