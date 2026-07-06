import { pgTable, serial, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  fullName: text("full_name").notNull(),
  description: text("description"),
  stars: integer("stars").default(0).notNull(),
  language: text("language"),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
