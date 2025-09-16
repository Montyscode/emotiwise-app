import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Journal entries table for emotional journaling
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mood: varchar("mood"), // positive, negative, mixed, neutral
  selectedMentor: varchar("selected_mentor"), // sage, jax
  sageResponse: text("sage_response"),
  jaxResponse: text("jax_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Psychology assessments table
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assessmentType: varchar("assessment_type").notNull(), // mbti, big5, etc
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  content: true,
  mood: true,
  selectedMentor: true,
}).extend({
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
  mood: z.enum(["positive", "negative", "mixed", "neutral"]).optional(),
  selectedMentor: z.enum(["sage", "jax"]).optional(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  assessmentType: true,
  results: true,
}).extend({
  assessmentType: z.enum(["mbti", "big5", "enneagram", "disc"]),
  results: z.record(z.any()).refine(
    (val) => Object.keys(val).length > 0,
    "Assessment results cannot be empty"
  ),
});

// Query parameter schemas for validation
export const getJournalEntriesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export const updateJournalEntrySchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  mood: z.enum(["positive", "negative", "mixed", "neutral"]).optional(),
  selectedMentor: z.enum(["sage", "jax"]).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided for update"
);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
