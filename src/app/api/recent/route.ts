import { db } from "@/db";
import { analyses } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: analyses.id,
        fullName: analyses.fullName,
        description: analyses.description,
        stars: analyses.stars,
        language: analyses.language,
        createdAt: analyses.createdAt,
      })
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(8);
    return Response.json({ recent: rows });
  } catch (e) {
    console.error("Recent error:", e);
    return Response.json({ recent: [] });
  }
}
