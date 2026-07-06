import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import { analyses } from "./schema.js";
import { desc } from "drizzle-orm";
import { analyzeRepo } from "./analyzer.js";
import { fetchRepoMeta, fetchRepoTree, parseRepoUrl } from "./github.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET /api/health
app.get("/api/health", async (req, res) => {
  try {
    // Run simple health check query
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
});

// GET /api/recent
app.get("/api/recent", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: analyses.id,
        fullName: analyses.fullName,
        description: analyses.description,
        stars: analyses.stars,
        language: analyses.language,
      })
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(8);
    res.json({ recent: rows });
  } catch (e) {
    console.error("Recent fetch error:", e);
    res.json({ recent: [] });
  }
});

// POST /api/analyze
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "GitHub URL parameter is required." });
  }

  const parsed = parseRepoUrl(url);
  if (!parsed) {
    return res.status(400).json({
      error: "Yeh valid GitHub repo URL nahi lag rahi. Example: https://github.com/vercel/next.js",
    });
  }

  try {
    const meta = await fetchRepoMeta(parsed.owner, parsed.repo);
    const tree = await fetchRepoTree(meta.owner, meta.name, meta.defaultBranch);
    const result = await analyzeRepo(meta, tree);

    // Save to database (best-effort)
    try {
      await db.insert(analyses).values({
        owner: meta.owner,
        repo: meta.name,
        fullName: meta.fullName,
        description: meta.description,
        stars: meta.stars,
        language: meta.language,
        result: result,
      });
    } catch (dbErr) {
      console.error("Failed to save analysis to DB:", dbErr);
    }

    res.json({ result });
  } catch (e: any) {
    const msg = e.message || "UNKNOWN";
    if (msg === "NOT_FOUND") {
      return res.status(404).json({ error: "Repo nahi mili. Check karo ki URL sahi hai aur repo public hai." });
    }
    if (msg === "RATE_LIMIT") {
      return res.status(429).json({ error: "GitHub rate limit hit ho gayi. Thodi der baad try karo." });
    }
    console.error("Analysis error:", e);
    res.status(500).json({ error: "Analysis fail ho gaya. Baad mein try karein." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
