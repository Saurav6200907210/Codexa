import { pgTable, serial, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

// Stores every repository that has been analyzed so users can revisit
// past analyses and we can show a "recent analyses" list on the home page.
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  fullName: text("full_name").notNull(),
  description: text("description"),
  stars: integer("stars").default(0).notNull(),
  language: text("language"),
  // The full analysis object (summary, workflow, folders, files, tree).
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
