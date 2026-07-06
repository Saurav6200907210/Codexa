import { db } from "@/db";
import { analyses } from "@/db/schema";
import { analyzeRepo } from "@/lib/analyzer";
import {
  fetchRepoMeta,
  fetchRepoTree,
  parseRepoUrl,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseRepoUrl(body.url ?? "");
  if (!parsed) {
    return Response.json(
      { error: "Yeh valid GitHub repo URL nahi lag rahi. Example: https://github.com/vercel/next.js" },
      { status: 400 }
    );
  }

  try {
    const meta = await fetchRepoMeta(parsed.owner, parsed.repo);
    const tree = await fetchRepoTree(meta.owner, meta.name, meta.defaultBranch);
    const result = await analyzeRepo(meta, tree);

    // Save to history (best effort — analysis still returns even if DB fails).
    try {
      await db.insert(analyses).values({
        owner: meta.owner,
        repo: meta.name,
        fullName: meta.fullName,
        description: meta.description,
        stars: meta.stars,
        language: meta.language,
        result,
      });
    } catch (e) {
      console.error("Failed to save analysis:", e);
    }

    return Response.json({ result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "NOT_FOUND")
      return Response.json(
        { error: "Repo nahi mili. Check karo ki URL sahi hai aur repo public hai." },
        { status: 404 }
      );
    if (msg === "RATE_LIMIT")
      return Response.json(
        { error: "GitHub ki rate limit hit ho gayi. Thodi der baad try karo." },
        { status: 429 }
      );
    console.error("Analyze error:", e);
    return Response.json({ error: "Analysis fail ho gaya. Baad mein try karein." }, { status: 500 });
  }
}
