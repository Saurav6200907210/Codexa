import { db } from "@/db";
import { analyses } from "@/db/schema";
import { desc } from "drizzle-orm";
import LandingPage from "@/components/LandingPage";

export const dynamic = "force-dynamic";

async function getRecent() {
  try {
    return await db
      .select({
        id: analyses.id,
        fullName: analyses.fullName,
        description: analyses.description,
        stars: analyses.stars,
        language: analyses.language,
      })
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(6);
  } catch {
    return [];
  }
}

export default async function Home() {
  const recent = await getRecent();

  return (
    <main className="min-h-screen">
      <LandingPage recent={recent} />
    </main>
  );
}
