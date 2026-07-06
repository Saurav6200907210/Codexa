import { db } from "@/db";
import { analyses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Analyzer } from "@/components/Analyzer";

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
    <main className="min-h-screen px-4 py-14 sm:py-20">
      <Analyzer recent={recent} />
      <footer className="mx-auto mt-24 max-w-4xl border-t border-white/10 pt-8 text-center text-sm text-slate-500">
        <p>
          RepoSamjho — GitHub repos ko aasaan Hinglish mein samjho. Sirf public repos
          support hain.
        </p>
        <p className="mt-1">Built with Next.js, Drizzle ORM & PostgreSQL.</p>
      </footer>
    </main>
  );
}
